import { CustomerForm } from "@/components/customer-form";
import { CustomerTable } from "@/components/customer-table";
import { QuerySearch } from "@/components/query-search";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/stores/$storeId/customers/")({
    component: RouteComponent,
    validateSearch: z.object({ q: z.string().optional() })
});

function RouteComponent() {
    const { storeId } = Route.useParams();
    const { q } = Route.useSearch();
    const navigate = Route.useNavigate();
    const teste = (searchParam: string) => {
        navigate({ search: { q: searchParam } })
    }
    console.log(q);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Clientes</h1>
            <div>
                <h2 className="text-xl font-semibold mb-4">Lista de Clientes</h2>
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <QuerySearch callBack={teste} placeholder="Pesquise pelo nome ou número de celular do cliente" />
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className=" h-4 w-4" />
                                    Adicionar Cliente
                                </Button>
                            </DialogTrigger>
                            <CustomerForm storeId={storeId} />
                        </Dialog>
                    </div>
                    <CustomerTable storeId={storeId} query={q || ""} />
                </div>
            </div>
        </div>
    );
}
