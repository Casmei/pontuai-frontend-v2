import { IdTokenClaims, useLogto } from "@logto/react"
import { BarChart3, Gift, House, Settings, Users } from "lucide-react"

import { NavCommon } from "@/components/navigation/nav-common"
import { NavUser } from "@/components/navigation/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useGetStoreById } from "@/lib/services/store-service"
import { useEffect, useState } from "react"

const fakeData = {
  Loja: [
    {
      url: `/stores/$storeId/`,
      title: "Dashboard",
      icon: BarChart3,
    },
    {
      url: `/stores/$storeId/settings`,
      title: "Configurações",
      icon: Settings,
    },
    {
      url: `/stores/$storeId/customers`,
      title: "Clientes",
      icon: Users,
    },
    {
      url: `/stores/$storeId/rewards`,
      title: "Recompensas",
      icon: Gift,
    }
  ],
}

type Props = React.ComponentProps<typeof Sidebar> & {
  data?: typeof fakeData
  storeId: string
}

export function AppSidebar({ data = fakeData, storeId, ...props }: Props) {

  const { data: store } = useGetStoreById(storeId)
  const { isAuthenticated, getIdTokenClaims } = useLogto();
  const [user, setUser] = useState<IdTokenClaims>();

  useEffect(() => {
    (async () => {
      if (isAuthenticated) {
        const claims = await getIdTokenClaims();
        setUser(claims);
      }
    })();
  }, [getIdTokenClaims, isAuthenticated]);


  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <House className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">{store?.name || "Sua Loja"}</span>
                  <span className="">Administrador</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="">
        <NavCommon title="Loja" items={data.Loja} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user?.username || "Teste",
            email: user?.email || "Teste",
            avatar: user?.username || "Pontuai",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
