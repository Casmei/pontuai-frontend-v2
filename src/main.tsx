import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RouterProvider, createRouter } from "@tanstack/react-router"
import { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { routeTree } from "./routeTree.gen"
import { LogtoProvider, useLogto, LogtoContext } from "@logto/react"

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
  // const auth = useLogto()
  // if (auth.isLoading) {
  //   return (
  //     <div className="flex items-center justify-center w-screen h-screen bg-white">
  //       <div className="flex flex-col items-center space-y-4">
  //         <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
  //         <span className="text-lg font-semibold text-gray-700">Carregando...</span>
  //       </div>
  //     </div>
  //   )
  // }

  return <RouterProvider router={router} />
}

// Render the app
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
