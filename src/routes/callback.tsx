import { createFileRoute } from "@tanstack/react-router"
import { useHandleSignInCallback } from "@logto/react"

export const Route = createFileRoute("/callback")({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { isLoading } = useHandleSignInCallback(() => {
    navigate({
      to: "/stores",
    })
  })

  if (isLoading) {
    return <div>Redirecting...</div>
  }

  return null
}
