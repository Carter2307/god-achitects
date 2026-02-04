import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { QueryEmailQueueDto } from './dto/query-email-queue.dto';
import { EmailStatus } from '@prisma/client';

@Injectable()
export class EmailQueueService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('email') private emailQueue: Queue,
  ) {}

  async findAll(query: QueryEmailQueueDto) {
    const { status, page = 1, limit = 50 } = query;
    const skip = (page - 1) * limit;

    const where = status ? { status } : {};

    const [messages, total] = await Promise.all([
      this.prisma.emailQueue.findMany({
        where,
        skip,
        take: limit,
        include: {
          reservation: {
            include: {
              user: {
                select: { id: true, email: true, firstName: true, lastName: true },
              },
              parkingSpot: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.emailQueue.count({ where }),
    ]);

    return {
      messages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async retry(id: string) {
    const email = await this.prisma.emailQueue.findUnique({
      where: { id },
    });

    if (!email) {
      throw new NotFoundException('Message email non trouvé');
    }

    if (email.status !== EmailStatus.FAILED) {
      throw new NotFoundException('Seuls les emails échoués peuvent être réessayés');
    }

    // Reset status to pending
    await this.prisma.emailQueue.update({
      where: { id },
      data: { status: EmailStatus.PENDING },
    });

    // Add to queue for processing
    await this.emailQueue.add('send-email', {
      emailId: id,
    });

    return { message: 'Email ajouté à la file d\'attente pour réessai' };
  }

  async addToQueue(emailId: string) {
    await this.emailQueue.add('send-email', {
      emailId,
    });
  }
}
