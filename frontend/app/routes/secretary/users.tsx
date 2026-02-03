import { Link } from "react-router";
import { AppShell } from "~/components/layouts";
import { Button } from "~/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/ui/card";
import { Input } from "~/ui/input";

export default function SecretaryUsers() {
  const mockUser = {
    id: "1",
    email: "marie.martin@example.com",
    firstName: "Marie",
    lastName: "Martin",
    role: "secretary" as const,
    status: "active" as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <AppShell
      role="secretary"
      title="Gestion des utilisateurs"
      user={mockUser}
      actions={
        <Button asChild size="sm">
          <Link to="/secretary/users/new">
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
            </svg>
            Nouvel utilisateur
          </Link>
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Filters */}
        <Card>
          <CardContent className="flex flex-wrap items-center gap-4 pt-6">
            <Input placeholder="Rechercher..." className="max-w-xs" />
            <Button variant="secondary" size="sm">
              Tous
            </Button>
            <Button variant="ghost" size="sm">
              Employés
            </Button>
            <Button variant="ghost" size="sm">
              Secrétaires
            </Button>
            <Button variant="ghost" size="sm">
              Managers
            </Button>
            <Button variant="ghost" size="sm">
              Inactifs
            </Button>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des utilisateurs</CardTitle>
            <CardDescription>
              Gérez les comptes utilisateurs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border bg-muted/50 p-8 text-center">
              <svg className="mx-auto size-12 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
              <p className="mt-4 text-muted-foreground">
                Aucun utilisateur trouvé
              </p>
              <Button variant="link" asChild className="mt-2">
                <Link to="/secretary/users/new">Ajouter un utilisateur</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
