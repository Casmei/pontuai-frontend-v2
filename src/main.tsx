import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RouterProvider, createRouter } from "@tanstack/react-router"
import { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { routeTree } from "./routeTree.gen"
import { LogtoProvider } from "@logto/react"

const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
  },
})

const queryClient = new QueryClient()

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

function InnerApp() {
  return <RouterProvider router={router} />
}

const rootElement = document.getElementById("root")!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <LogtoProvider config={{
        endpoint: 'https://0zyxhw.logto.app/',
        appId: 'osxcdqwhvkx7n7l9s1ie6',
        resources: ["https://pontuai-api.kontact.com.br"],
        scopes: ["openid", "profile", "email", "offline_access"],
      }}>
        <QueryClientProvider client={queryClient}>
          <InnerApp />
        </QueryClientProvider>
      </LogtoProvider>
    </StrictMode>,
  )
}
