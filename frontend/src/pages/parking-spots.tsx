import { useState } from 'react'
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui'
import { Plus, Car, Zap } from 'lucide-react'

interface ParkingSpot {
  id: string
  spotNumber: string
  row: string
  hasElectricCharger: boolean
  isAvailable: boolean
}

export function ParkingSpotsPage() {
  const [parkingSpots] = useState<ParkingSpot[]>([])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Places de parking</h1>
          <p className="mt-1 text-muted-foreground">
            Gérez les places de parking disponibles
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une place
        </Button>
      </div>

      {parkingSpots.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Car className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 font-medium text-foreground">
              Aucune place configurée
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Commencez par ajouter des places de parking.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {parkingSpots.map((spot) => (
            <Card key={spot.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">
                  Place {spot.spotNumber}
                </CardTitle>
                <Badge variant={spot.isAvailable ? 'success' : 'secondary'}>
                  {spot.isAvailable ? 'Disponible' : 'Occupée'}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Rangée {spot.row}</span>
                  {spot.hasElectricCharger && (
                    <span className="flex items-center gap-1 text-success">
                      <Zap className="h-3 w-3" />
                      Borne électrique
                    </span>
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
