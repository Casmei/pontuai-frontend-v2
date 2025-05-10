import { createFileRoute } from "@tanstack/react-router"
import { ConfigForm } from "@/components/config-form"
import { NotificationConfigForm } from "@/components/notification-config-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGetStoreById } from "@/lib/services/store-service"
import { Skeleton } from "@/components/ui/skeleton"

export const Route = createFileRoute("/stores/$storeId/settings/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { storeId } = Route.useParams()
  const { data, isLoading, isError, error } = useGetStoreById(storeId);

  if (isLoading || !data?.config) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <h2 className="text-lg font-semibold">Erro ao buscar loja</h2>
        <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
      </div>
    );
  }

  const config = data?.config;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Configurações</h1>

      <Tabs defaultValue="points" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 mb-8">
          <TabsTrigger value="points">Configuração de Pontos</TabsTrigger>
          <TabsTrigger value="notifications">Configuração de Notificações</TabsTrigger>
        </TabsList>
        <TabsContent value="points">
          <ConfigForm storeId={storeId} initialData={config} />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationConfigForm storeId={storeId} initialData={config} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
