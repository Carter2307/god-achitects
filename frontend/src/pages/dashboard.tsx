import { useAuth } from '@/contexts/auth-context'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { CalendarDays, Car, Clock, CheckCircle } from 'lucide-react'

export function DashboardPage() {
  const { user } = useAuth()

  const stats = [
    {
      title: 'Réservations actives',
      value: '2',
      icon: <CalendarDays className="h-5 w-5" />,
      color: 'text-info',
    },
    {
      title: 'Places disponibles',
      value: '15',
      icon: <Car className="h-5 w-5" />,
      color: 'text-success',
    },
    {
      title: 'En attente',
      value: '1',
      icon: <Clock className="h-5 w-5" />,
      color: 'text-warning',
    },
    {
      title: 'Check-ins ce mois',
      value: '8',
      icon: <CheckCircle className="h-5 w-5" />,
      color: 'text-primary',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Tableau de bord</h1>
        <p className="mt-1 text-muted-foreground">
          Bienvenue, {user?.firstName} !
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <span className={stat.color}>{stat.icon}</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Mes prochaines réservations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Aucune réservation à venir.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Aucune activité récente.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
