import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/stores/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/stores/create"!</div>
}
