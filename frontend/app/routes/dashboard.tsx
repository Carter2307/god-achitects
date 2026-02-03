import { Link } from "react-router";
import type { Route } from "./+types/dashboard";
import { useApiQuery, getErrorMessage } from "~/hooks/use-api";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ErrorDisplay,
  Loading,
} from "~/ui";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard - God Architects" },
    { name: "description", content: "Dashboard" },
  ];
}

type User = {
  id: number;
  name: string;
  email: string;
};

function UsersList() {
  const { data, isLoading, error, refetch } = useApiQuery<User[]>(
    ["users"],
    "/users",
    {
      enabled: false, // Disabled by default - demo only
    }
  );

  if (isLoading) {
    return <Loading message="Loading users..." />;
  }

  if (error) {
    return (
      <ErrorDisplay
        title="Failed to load users"
        message={getErrorMessage(error)}
        onRetry={() => refetch()}
      />
    );
  }

  if (!data) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        Click "Fetch Users" to load data from API
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {data.map((user) => (
        <li
          key={user.id}
          className="rounded-md border p-3 text-sm"
        >
          <p className="font-medium">{user.name}</p>
          <p className="text-muted-foreground">{user.email}</p>
        </li>
      ))}
    </ul>
  );
}

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-muted/30 p-4">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Example page with TanStack Query integration
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                Example of data fetching with useApiQuery hook
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UsersList />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stack</CardTitle>
              <CardDescription>Technologies used in this project</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  React Router v7
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-600" />
                  TypeScript
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-500" />
                  Tailwind CSS v4
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-purple-500" />
                  TanStack Query
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-orange-500" />
                  Axios
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-slate-800" />
                  shadcn/ui components
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
