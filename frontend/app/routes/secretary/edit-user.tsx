import { useState } from "react";
import { Link, useParams } from "react-router";
import { AppShell } from "~/components/layouts";
import { Button } from "~/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/ui/card";
import { Input } from "~/ui/input";
import type { UserRole, UserStatus } from "~/types";

export default function EditUser() {
  const { id } = useParams();

  // TODO: Fetch user data by id
  const [firstName, setFirstName] = useState("Jean");
  const [lastName, setLastName] = useState("Dupont");
  const [email, setEmail] = useState("jean.dupont@example.com");
  const [role, setRole] = useState<UserRole>("employee");
  const [status, setStatus] = useState<UserStatus>("active");

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement user update
    console.log({ id, firstName, lastName, email, role, status });
  };

  return (
    <AppShell
      role="secretary"
      title="Modifier l'utilisateur"
      user={mockUser}
      actions={
        <Button variant="ghost" size="sm" asChild>
          <Link to="/secretary/users">
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
            </svg>
            Retour
          </Link>
        </Button>
      }
    >
      <div className="mx-auto max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Modifier le compte</CardTitle>
            <CardDescription>
              Modifiez les informations de l'utilisateur #{id}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium">
                    Prénom
                  </label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium">
                    Nom
                  </label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Rôle</label>
                <div className="grid gap-2 sm:grid-cols-3">
                  {(["employee", "secretary", "manager"] as const).map((r) => (
                    <label
                      key={r}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 hover:bg-accent ${
                        role === r ? "border-primary bg-accent" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={r}
                        checked={role === r}
                        onChange={() => setRole(r)}
                        className="size-4"
                      />
                      <span className="capitalize">{r === "employee" ? "Employé" : r === "secretary" ? "Secrétaire" : "Manager"}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Statut</label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {(["active", "inactive"] as const).map((s) => (
                    <label
                      key={s}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 hover:bg-accent ${
                        status === s ? "border-primary bg-accent" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={s}
                        checked={status === s}
                        onChange={() => setStatus(s)}
                        className="size-4"
                      />
                      <span className="capitalize">{s === "active" ? "Actif" : "Inactif"}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit">Enregistrer</Button>
                <Button type="button" variant="outline" asChild>
                  <Link to="/secretary/users">Annuler</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle>Réinitialiser le mot de passe</CardTitle>
            <CardDescription>
              Définir un nouveau mot de passe pour cet utilisateur
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="newPassword" className="text-sm font-medium">
                  Nouveau mot de passe
                </label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirmer le mot de passe
                </label>
                <Input id="confirmPassword" type="password" />
              </div>
              <Button type="submit" variant="secondary">
                Réinitialiser
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Zone de danger</CardTitle>
            <CardDescription>
              Actions irréversibles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive">
              Supprimer l'utilisateur
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
