import { Button } from "@/components/ui/button";
import { useGetStores } from "@/lib/services/store-service";
import { cn } from "@/lib/utils";
import { useHandleSignInCallback } from "@logto/react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/callback")({
  component: CallbackRoute,
});

function CallbackRoute() {
  const navigate = Route.useNavigate();

  const { isLoading: isAuthLoading, error } = useHandleSignInCallback();
  const { data: stores, isLoading: isStoresLoading } = useGetStores();

  useEffect(() => {
    if (!isAuthLoading && !error && !isStoresLoading && stores) {
      if (stores.length === 0) {
        navigate({ to: "/stores/create" });
      } else {
        navigate({ to: "/stores/$storeId", params: { storeId: stores[0].id } });
      }
    }
  }, [isAuthLoading, isStoresLoading, error, stores, navigate]);

  if (isAuthLoading || isStoresLoading) {
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

  return null;
}
