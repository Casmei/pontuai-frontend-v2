import { Toaster } from "@/components/ui/sonner"
import { useLogto } from "@logto/react"
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/stores")({
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
      <Toaster />
    </>
  )
}
