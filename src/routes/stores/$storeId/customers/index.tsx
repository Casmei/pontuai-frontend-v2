import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/stores/$storeId/customers/')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/stores/$storeId/"!</div>
}
