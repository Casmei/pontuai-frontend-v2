import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone } from "lucide-react";
import { CustomerSkeleton } from "@/components/customer-detail";
import type { GetCustomerDetailResponse } from '@/gen';

type AvailableRewardsProps = {
    customer?: GetCustomerDetailResponse;
    isLoading: boolean;
}

export function CustomerHeader({ customer, isLoading }: AvailableRewardsProps) {
    if (isLoading) {
        return <CustomerSkeleton />;
    }

    if (!customer) { return null; }

    const initials = customer?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("") || "??";

    return (
        <div className="flex items-center justify-between flex-1">
            <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 rounded-full border border-primary/20 bg-primary/10">
                    <AvatarFallback className="rounded-full text-xl font-semibold text-primary flex items-center justify-center h-full w-full">
                        {initials}
                    </AvatarFallback>
                </Avatar>

                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold">{customer.name}</h2>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            Ativo
                        </Badge>
                    </div>

                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {customer.email ?? "Não informado"}
                        </div>
                        <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-1" />
                            {customer.phone ?? "Não informado"}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
