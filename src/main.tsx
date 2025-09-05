import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RouterProvider, createRouter } from "@tanstack/react-router"
import { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { routeTree } from "./routeTree.gen"
import { LogtoProvider } from "@logto/react"
import { Toaster } from "sonner"

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
      <LogtoProvider
        config={{
          endpoint: "https://lb61uu.logto.app/",
          appId: "0ovqsuv17kut1p5mayk04",
          resources: ["https://pontuai-api.kontact.com.br"],
        }}
      >
        <QueryClientProvider client={queryClient}>
          <Toaster />
          <InnerApp />
        </QueryClientProvider>
      </LogtoProvider>
    </StrictMode>,
  )
}
