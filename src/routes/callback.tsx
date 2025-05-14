// src/routes/callback.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useHandleSignInCallback } from "@logto/react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";          // shadcn/ui
import { cn } from "@/lib/utils";                         // helper opcional

export const Route = createFileRoute("/callback")({
  component: CallbackRoute,
});

function CallbackRoute() {
  const navigate = Route.useNavigate();

  // Logto lida com o código ?callback=… e devolve loading / erro
  const { isLoading, error } = useHandleSignInCallback(() => {
    navigate({ to: "/stores" });
  });

  /* ---------------------------------------------------------------------- */
  /*  Loading                                                               */
  /* ---------------------------------------------------------------------- */
  if (isLoading) {
    return (
      <div
        className={cn(
          "min-h-screen w-full flex flex-col items-center justify-center gap-4",
          "bg-background text-muted-foreground"
        )}
        aria-busy="true"
      >
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm">Redirecionando para o painel…</p>
      </div>
    );
  }

  /* ---------------------------------------------------------------------- */
  /*  Erro                                                                  */
  /* ---------------------------------------------------------------------- */
  if (error) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center gap-6">
        <div className="text-center space-y-2">
          <h1 className="text-lg font-semibold text-destructive">Falha no login</h1>
          <p className="max-w-xs text-sm text-muted-foreground">
            {error.message || "Algo inesperado ocorreu durante a autenticação."}
          </p>
        </div>

        <Button onClick={() => navigate({ to: "/" })}>Voltar à página inicial</Button>
      </div>
    );
  }

  /* ---------------------------------------------------------------------- */
  /*  Nada a renderizar após o redirect                                     */
  /* ---------------------------------------------------------------------- */
  return null;
}
