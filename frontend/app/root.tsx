import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { AlertCircle } from "lucide-react";

import type { Route } from "./+types/root";
import "./app.css";
import { ToastProvider } from "~/contexts/toast-context";
import { QueryProvider } from "~/providers/query-provider";
import { Alert, AlertDescription, AlertTitle } from "~/ui/alert";
import { Button } from "~/ui/button";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <QueryProvider>
      <ToastProvider>
        <Outlet />
      </ToastProvider>
    </QueryProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let title = "Something went wrong";
  let message = "An unexpected error occurred.";
  let status: number | undefined;

  if (isRouteErrorResponse(error)) {
    status = error.status;
    title = error.status === 404 ? "Page not found" : `Error ${error.status}`;
    message =
      error.status === 404
        ? "The page you're looking for doesn't exist."
        : error.statusText || message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="flex items-center gap-2">
            {status && (
              <span className="text-3xl font-bold opacity-50">{status}</span>
            )}
            {title}
          </AlertTitle>
          <AlertDescription className="mt-2">
            <p className="mb-4">{message}</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.history.back()}
              >
                Go back
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => (window.location.href = "/")}
              >
                Home
              </Button>
            </div>
            {import.meta.env.DEV && error instanceof Error && error.stack && (
              <pre className="mt-4 max-h-40 overflow-auto rounded bg-destructive/10 p-2 text-xs">
                <code>{error.stack}</code>
              </pre>
            )}
          </AlertDescription>
        </Alert>
      </div>
    </main>
  );
}
