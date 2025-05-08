import * as React from "react"
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router"
import { useLogto } from "@logto/react"

export const Route = createRootRouteWithContext()({
  component: RootComponent,
})

function RootComponent() {
  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  )
}
