import { useLogto } from "@logto/react"
import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/_stores")({
  component: RouteComponent,
})

function RouteComponent() {
  const { isLoading, isAuthenticated } = useLogto()

  const navigate = Route.useNavigate()

  if (!isAuthenticated && !isLoading) {
    navigate({
      to: "/",
    })
    return null
  }
  return (
    <>
      <Outlet />
    </>
  )
}
