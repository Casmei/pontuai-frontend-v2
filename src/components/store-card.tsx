import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, MapPin, PaperclipIcon } from "lucide-react"
import { GetTenant } from "@/gen/models/GetTenant"
import { Link } from "@tanstack/react-router"

interface StoreCardProps {
  store: GetTenant
}

export function StoreCard({ store }: StoreCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{store.name}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="h-4 w-4" />
          <span>{store.slug}</span>
        </div>
        <div className="flex items-center gap-2">
          <PaperclipIcon className="h-4 w-4" />
          <span>100 clientes</span>
        </div>
      </CardContent>
      <CardFooter>
        <Link
          to="/stores/$storeId"
          params={{
            storeId: store.id,
          }}
          className="w-full"
        >
          <Button className="w-full">
            Gerenciar
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
