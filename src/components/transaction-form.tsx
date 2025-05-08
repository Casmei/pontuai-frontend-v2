"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreateRewardResponse, CustomerWithPointsResponse } from "@/gen";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { createTransactionAction } from "@/action/create-transaction";
import { redeemRewardAction } from "@/action/redeem-reward";
import { formatCurrency } from "@/lib/utils";

const purchaseSchema = z.object({
  type: z.literal("purchase"),
  customerId: z.string().min(1, "Selecione um cliente"),
  amount: z.coerce.number().min(0.01, "Valor deve ser maior que zero"),
});

const redeemSchema = z.object({
  type: z.literal("redeem"),
  customerId: z.string().min(1, "Selecione um cliente"),
  rewardId: z.string().min(1, "Selecione uma recompensa"),
});

const formSchema = z.discriminatedUnion("type", [purchaseSchema, redeemSchema]);

interface TransactionFormProps {
  customers: CustomerWithPointsResponse[] | null;
  rewards: CreateRewardResponse[] | null;
  storeId: string;
}

export function TransactionForm({
  storeId,
  customers,
  rewards,
}: TransactionFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const brlFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "purchase",
      customerId: "",
      amount: 0,
    },
  });

  const transactionType = form.watch("type");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);

      if (values.type === "purchase") {
        const [error] = await createTransactionAction({
          xTenantId: storeId,
          addPointsDto: {
            customerId: values.customerId,
            moneySpent: values.amount,
          },
        });

        if (error) {
          toast.error("Erro ao registrar transação", {
            description: error.message,
          });
          return;
        }

      } else {
        await redeemRewardAction({
          id: values.rewardId,
          xTenantId: storeId,
          redeemRewardDto: { customerId: values.customerId },
        });
      }

      toast.success("Transação registrada", {
        description: "A transação foi registrada com sucesso.",
      });

      form.reset(
        values.type === "purchase"
          ? {
            type: "purchase",
            customerId: "",
            amount: 0,
          }
          : {
            type: "redeem",
            customerId: "",
            rewardId: "",
          }
      );
    } catch (error) {
      console.error(error);
      toast.error("Erro inesperado", {
        description: "Ocorreu um erro ao registrar a transação.",
      });
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Tipo de Transação</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="purchase" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Compra (adicionar pontos)
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="redeem" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Resgate (usar pontos)
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="customerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {customers?.map(({ customer, points }) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name} ({customer.phone}) - {points} pts
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {transactionType === "purchase" && (
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => {
              const handleChange = useCallback(
                (e: React.ChangeEvent<HTMLInputElement>) => {
                  const rawValue = e.target.value.replace(/\D/g, ""); // Remove tudo que não é número
                  const numericValue = Number(rawValue) / 100;
                  field.onChange(numericValue);
                },
                [field]
              );
              return (<FormItem >
                <FormLabel>Valor da Compra (R$)</FormLabel>
                <FormControl>
                  <Input type="text"
                    value={formatCurrency(Number(field.value || 0))}
                    onChange={handleChange} />
                </FormControl>
                <FormMessage />
              </FormItem>)
            }}
          />
        )}

        {transactionType === "redeem" && (
          <FormField
            control={form.control}
            name="rewardId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recompensa</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma recompensa" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {rewards?.map((reward) => (
                      <SelectItem key={reward.id} value={reward.id}>
                        {reward.name} ({reward.pointValue} pts)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Processando..." : "Registrar Transação"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
