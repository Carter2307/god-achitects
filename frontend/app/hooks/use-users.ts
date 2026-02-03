import { useApiQuery } from "./use-api";

interface UserApi {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: "EMPLOYE" | "GESTIONNAIRE" | "SECRETAIRE";
  statut: "ACTIF" | "INACTIF";
}

export function useUsers() {
  return useApiQuery<UserApi[]>(["users"], "/users");
}

export function useCurrentUser(email: string) {
  const { data: users, ...rest } = useUsers();
  const user = users?.find((u) => u.email === email);
  return { data: user, ...rest };
}
