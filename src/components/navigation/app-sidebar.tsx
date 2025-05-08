"use client"

import {
  BarChart3,
  Gift,
  Receipt,
  Settings,
  Users,
  House,
} from "lucide-react"
import * as React from "react"

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
import { useUser } from "../@providers/user-provider"

const fakeData = {
  Loja: [
    {
      url: `/`,
      title: "Dashboard",
      icon: BarChart3,
    },
    {
      url: `/config`,
      title: "Configurações",
      icon: Settings,
    },
    {
      url: `/customers`,
      title: "Clientes",
      icon: Users,
    },
    {
      url: `/rewards`,
      title: "Recompensas",
      icon: Gift,
    },
    {
      url: `/transactions`,
      title: "Transações",
      icon: Receipt,
    },
  ]
}

type Props = React.ComponentProps<typeof Sidebar> & {
  data?: typeof fakeData
}

export function AppSidebar({ data = fakeData, ...props }: Props) {
  const user = useUser();

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
                  <span className="font-semibold">Usuário de teste</span>
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
        <NavUser user={{
          name: user.name || "",
          email: user.email || "",
          avatar: user.picture || "",
        }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
