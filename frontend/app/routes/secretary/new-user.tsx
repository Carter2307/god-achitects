import { useState } from "react";
import { Link } from "react-router";
import { AppShell } from "~/components/layouts";
import { Button } from "~/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/ui/card";
import { Input } from "~/ui/input";
import type { UserRole } from "~/types";

export default function NewUser() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("employee");

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
    // TODO: Implement user creation
    console.log({ firstName, lastName, email, password, role });
  };

  return (
    <AppShell
      role="secretary"
      title="Nouvel utilisateur"
      user={mockUser}
      actions={
        <Button variant="ghost" size="sm" asChild>
          <Link to="/secretary/users">
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            Annuler
          </Link>
        </Button>
      }
    >
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Créer un compte utilisateur</CardTitle>
            <CardDescription>
              Remplissez les informations pour créer un nouveau compte
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
                <label htmlFor="password" className="text-sm font-medium">
                  Mot de passe
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              <div className="flex gap-2 pt-4">
                <Button type="submit">Créer l'utilisateur</Button>
                <Button type="button" variant="outline" asChild>
                  <Link to="/secretary/users">Annuler</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
