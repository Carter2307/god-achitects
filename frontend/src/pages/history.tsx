import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui'
import { History } from 'lucide-react'
import { getStatusLabel, formatDateTime } from '@/lib/utils'

interface HistoryItem {
  id: string
  parkingSpot: { spotNumber: string }
  startDate: string
  endDate: string
  status: string
  checkInTime?: string
}

export function HistoryPage() {
  const [history] = useState<HistoryItem[]>([])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Historique</h1>
        <p className="mt-1 text-muted-foreground">
          Consultez l'historique de vos réservations
        </p>
      </div>

      {history.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <History className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 font-medium text-foreground">
              Aucun historique
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Votre historique de réservations apparaîtra ici.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {history.map((item) => (
            <Card key={item.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">
                  Place {item.parkingSpot.spotNumber}
                </CardTitle>
                <Badge
                  variant={
                    item.status === 'CONFIRMED' ? 'success' : 'secondary'
                  }
                >
                  {getStatusLabel(item.status)}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>
                    Du {formatDateTime(item.startDate)} au{' '}
                    {formatDateTime(item.endDate)}
                  </p>
                  {item.checkInTime && (
                    <p>Check-in: {formatDateTime(item.checkInTime)}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
