import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { EmailStatus, EmailMessageType } from '@prisma/client';

interface EmailJobData {
  emailId: string;
}

@Injectable()
@Processor('email')
export class EmailQueueProcessor extends WorkerHost {
  private transporter: nodemailer.Transporter;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    super();
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async process(job: Job<EmailJobData>) {
    const { emailId } = job.data;

    const email = await this.prisma.emailQueue.findUnique({
      where: { id: emailId },
      include: {
        reservation: {
          include: {
            user: true,
            parkingSpot: true,
          },
        },
      },
    });

    if (!email) {
      console.error(`Email ${emailId} not found`);
      return;
    }

    try {
      const { subject, html } = this.getEmailContent(email.messageType, email.reservation);

      await this.transporter.sendMail({
        from: this.configService.get('SMTP_FROM') || 'noreply@parking.com',
        to: email.recipientEmail,
        subject,
        html,
      });

      await this.prisma.emailQueue.update({
        where: { id: emailId },
        data: {
          status: EmailStatus.SENT,
          sentAt: new Date(),
        },
      });

      console.log(`Email ${emailId} sent successfully`);
    } catch (error) {
      console.error(`Failed to send email ${emailId}:`, error);

      await this.prisma.emailQueue.update({
        where: { id: emailId },
        data: { status: EmailStatus.FAILED },
      });

      throw error;
    }
  }

  private getEmailContent(
    messageType: EmailMessageType,
    reservation: {
      user: { firstName: string; lastName: string };
      parkingSpot: { spotNumber: string; row: string };
      startDate: Date;
      endDate: Date;
    },
  ) {
    const { user, parkingSpot, startDate, endDate } = reservation;
    const userName = `${user.firstName} ${user.lastName}`;
    const spotInfo = `${parkingSpot.spotNumber} (Rangée ${parkingSpot.row})`;
    const dateRange = `${startDate.toLocaleDateString('fr-FR')} au ${endDate.toLocaleDateString('fr-FR')}`;

    switch (messageType) {
      case EmailMessageType.RESERVATION_CONFIRMATION:
        return {
          subject: 'Confirmation de votre réservation de parking',
          html: `
            <h1>Confirmation de réservation</h1>
            <p>Bonjour ${userName},</p>
            <p>Votre réservation de parking a été enregistrée avec succès.</p>
            <p><strong>Détails :</strong></p>
            <ul>
              <li>Place : ${spotInfo}</li>
              <li>Période : ${dateRange}</li>
            </ul>
            <p>N'oubliez pas de scanner le QR code à votre arrivée pour confirmer votre présence.</p>
            <p>Cordialement,<br>L'équipe Parking</p>
          `,
        };

      case EmailMessageType.RESERVATION_REMINDER:
        return {
          subject: 'Rappel : Votre réservation de parking',
          html: `
            <h1>Rappel de réservation</h1>
            <p>Bonjour ${userName},</p>
            <p>Ceci est un rappel pour votre réservation de parking.</p>
            <p><strong>Détails :</strong></p>
            <ul>
              <li>Place : ${spotInfo}</li>
              <li>Période : ${dateRange}</li>
            </ul>
            <p>N'oubliez pas de scanner le QR code avant 11h pour confirmer votre présence.</p>
            <p>Cordialement,<br>L'équipe Parking</p>
          `,
        };

      case EmailMessageType.RESERVATION_CANCELLED:
        return {
          subject: 'Annulation de votre réservation de parking',
          html: `
            <h1>Réservation annulée</h1>
            <p>Bonjour ${userName},</p>
            <p>Votre réservation de parking a été annulée.</p>
            <p><strong>Détails de la réservation annulée :</strong></p>
            <ul>
              <li>Place : ${spotInfo}</li>
              <li>Période : ${dateRange}</li>
            </ul>
            <p>Si vous n'êtes pas à l'origine de cette annulation, veuillez contacter le secrétariat.</p>
            <p>Cordialement,<br>L'équipe Parking</p>
          `,
        };

      case EmailMessageType.RESERVATION_EXPIRED:
        return {
          subject: 'Votre réservation de parking a expiré',
          html: `
            <h1>Réservation expirée</h1>
            <p>Bonjour ${userName},</p>
            <p>Votre réservation de parking a expiré car aucun check-in n'a été effectué avant 11h.</p>
            <p><strong>Détails :</strong></p>
            <ul>
              <li>Place : ${spotInfo}</li>
              <li>Période : ${dateRange}</li>
            </ul>
            <p>La place a été remise à disposition pour d'autres utilisateurs.</p>
            <p>Cordialement,<br>L'équipe Parking</p>
          `,
        };

      default:
        return {
          subject: 'Notification Parking',
          html: `<p>Bonjour ${userName}, vous avez une notification concernant votre réservation.</p>`,
        };
    }
  }
}
