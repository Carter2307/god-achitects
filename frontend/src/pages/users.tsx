import { useState } from 'react'
import { Button, Card, CardContent, Badge } from '@/components/ui'
import { Plus, Users } from 'lucide-react'
import { getRoleLabel, getInitials } from '@/lib/utils'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

export function UsersPage() {
  const [users] = useState<User[]>([])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Utilisateurs</h1>
          <p className="mt-1 text-muted-foreground">
            Gérez les utilisateurs du système
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un utilisateur
        </Button>
      </div>

      {users.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 font-medium text-foreground">
              Aucun utilisateur
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Commencez par ajouter des utilisateurs.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {users.map((user) => (
            <Card key={user.id}>
              <CardContent className="flex items-center gap-4 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                  {getInitials(user.firstName, user.lastName)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <Badge variant="secondary">{getRoleLabel(user.role)}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
