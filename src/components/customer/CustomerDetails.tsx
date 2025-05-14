import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CustomerDetailsSkeleton } from "@/components/customer-detail";
import { GetCustomerDetailResponse } from '@/gen';

type CustomerDetailsProps = {
    customer: GetCustomerDetailResponse;
    isLoading: boolean;
}

export function CustomerDetails({ customer, isLoading }: CustomerDetailsProps) {
    if (isLoading) {
        return <CustomerDetailsSkeleton />;
    }

    if (!customer) {
        return null;
    }

    const formattedMemberSince = customer?.memberSince
        ? new Date(customer.memberSince).toLocaleDateString("pt-BR")
        : "Não informado";

    return (
        <Card className="md:col-span-5">
            <CardHeader>
                <CardTitle className="text-lg">
                    Detalhes do Cliente
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <DetailItem
                        label="Membro desde"
                        value={formattedMemberSince}
                    />
                    <DetailItem
                        label="Aniversário"
                        value={customer?.birthdate || "Não informado"}
                    />
                    <DetailItem
                        label="Nível"
                        value={customer?.tier || "Não informado"}
                    />
                    <DetailItem
                        label="Endereço"
                        value={customer?.address || "Não informado"}
                    />
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Preferências
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1">
                            <Badge variant="outline">Em desenvolvimento 😜</Badge>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Componente reutilizável para cada item de detalhe
const DetailItem = React.memo(({ label, value }: { label: string, value: any }) => {
    return (
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-medium">{value}</p>
        </div>
    );
});

DetailItem.displayName = 'DetailItem';