"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { TenantConfig } from "@/gen";
import { updatePointConfigAction } from "@/action/update-point-config"

const formSchema = z.object({
    apikey: z.string().min(1, "API Key é obrigatória"),
    baseUrl: z.string().url("URL inválida"),
    instanceName: z.string().min(1, "Nome da instância é obrigatório"),
})

export type NotificationConfig = {
    apikey: string
    baseUrl: string
    instanceName: string
}

interface NotificationConfigFormProps {
    storeId: string
    initialData: TenantConfig
}

export function NotificationConfigForm({ storeId, initialData }: NotificationConfigFormProps) {
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            apikey: initialData.whatsappConfig.apikey || "",
            baseUrl: initialData.whatsappConfig.baseUrl || "",
            instanceName: initialData.whatsappConfig.instanceName || "",
        },
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {
        setIsLoading(true);

        try {
            const [error] = await updatePointConfigAction({
                tenantId: storeId,
                updateTenantSettingsDto: {
                    expirationInDays: initialData.pointConfig.expirationInDays,
                    minimumValueForWinPoints: initialData.pointConfig.minimumValueForWinPoints,
                    pointsForMoneySpent: initialData.pointConfig.pointsForMoneySpent,
                    apikey: data.apikey,
                    baseUrl: data.baseUrl,
                    instanceName: data.instanceName,
                },
            });

            if (error) {
                toast.error("Erro ao salvar", {
                    description: error.message || "Erro desconhecido ao atualizar as configurações.",
                });
                return;
            }

            toast.success("Configurações atualizadas", {
                description: "As configurações foram salvas com sucesso.",
            });
        } catch (err: unknown) {
            console.error(err);
            toast.error("Erro inesperado", {
                description: "Ocorreu um erro ao salvar as configurações.",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card>
            <CardContent className="pt-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="apikey"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>API Key</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormDescription>Chave de API para o serviço de notificação</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="baseUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>URL Base</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormDescription>URL base do serviço de notificação</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="instanceName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome da Instância</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormDescription>Nome da instância no serviço de notificação</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Salvando..." : "Salvar Configurações"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
