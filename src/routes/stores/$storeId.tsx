import { AppSidebar } from "@/components/navigation/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useLogto } from "@logto/react"
import { createFileRoute, Outlet } from "@tanstack/react-router"
import { useEffect } from "react"

export const Route = createFileRoute("/stores/$storeId")({
  component: RouteComponent,
})

function RouteComponent() {
  const { isAuthenticated, isLoading } = useLogto();
  const navigate = Route.useNavigate();
  const { storeId } = Route.useParams();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <SidebarProvider>
      <AppSidebar storeId={storeId} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
