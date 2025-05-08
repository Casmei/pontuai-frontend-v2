"use client";

import { useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { TenantConfig } from "@/gen";
import { updatePointConfigAction } from "@/action/update-point-config";

const formSchema = z.object({
  pointsForMoneySpent: z.coerce.number().min(0.1, "Deve ser pelo menos 0.1"),
  expirationInDays: z.coerce.number().int().min(1, "Deve ser pelo menos 1 dia"),
  minimumValueForWinPoints: z.coerce
    .number()
    .min(1, "Deve ser pelo menos 1 ponto"),
});

interface ConfigFormProps {
  storeId: string;
  initialData: TenantConfig;
}

export function ConfigForm({ storeId, initialData }: ConfigFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const brlFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pointsForMoneySpent: initialData.pointConfig.pointsForMoneySpent,
      expirationInDays: initialData.pointConfig.expirationInDays,
      minimumValueForWinPoints: initialData.pointConfig.minimumValueForWinPoints,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const [error] = await updatePointConfigAction({
        tenantId: storeId,
        updateTenantSettingsDto: {
          minimumValueForWinPoints: data.minimumValueForWinPoints,
          pointsForMoneySpent: data.pointsForMoneySpent,
          expirationInDays: data.expirationInDays,
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
              name="pointsForMoneySpent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pontos por Real</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" {...field} />
                  </FormControl>
                  <FormDescription>
                    Quantos pontos o cliente ganha para cada R$ 1,00 gasto
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expirationInDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dias para Expiração</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Número de dias até os pontos expirarem
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="minimumValueForWinPoints"
              render={({ field }) => {
                const handleChange = useCallback(
                  (e: React.ChangeEvent<HTMLInputElement>) => {
                    const rawValue = e.target.value.replace(/\D/g, ""); // Remove tudo que não é número
                    const numericValue = Number(rawValue) / 100;
                    field.onChange(numericValue);
                  },
                  [field]
                );

                return (
                  <FormItem>
                    <FormLabel>Valor Mínimo para Pontuar (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        value={brlFormatter.format(Number(field.value || 0))}
                        onChange={handleChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Valor mínimo que o cliente precisa gastar para começar a ganhar pontos
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
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
  );
}
