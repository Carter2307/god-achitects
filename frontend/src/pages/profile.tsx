import { useAuth } from '@/contexts/auth-context'
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui'
import { getRoleLabel, formatDate } from '@/lib/utils'

export function ProfilePage() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Mon profil</h1>
        <p className="mt-1 text-muted-foreground">
          Consultez vos informations personnelles
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Prénom
              </label>
              <p className="mt-1 text-foreground">{user.firstName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Nom
              </label>
              <p className="mt-1 text-foreground">{user.lastName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Email
              </label>
              <p className="mt-1 text-foreground">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Rôle
              </label>
              <div className="mt-1">
                <Badge variant="secondary">{getRoleLabel(user.role)}</Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Membre depuis
              </label>
              <p className="mt-1 text-foreground">
                {formatDate(user.createdAt)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
