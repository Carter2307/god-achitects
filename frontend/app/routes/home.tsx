import { Link } from "react-router";
import type { Route } from "./+types/home";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/ui";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "God Architects" },
    { name: "description", content: "Welcome to God Architects" },
  ];
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">God Architects</CardTitle>
          <CardDescription>
            Your application is ready to build
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-center text-sm text-muted-foreground">
            React Router v7 + TypeScript + Tailwind CSS + TanStack Query
          </p>
          <div className="flex justify-center gap-2">
            <Button asChild>
              <Link to="/dashboard">Get Started</Link>
            </Button>
            <Button variant="outline" asChild>
              <a
                href="https://reactrouter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Docs
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
