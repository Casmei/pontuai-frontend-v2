"use client";

import { useCallback, useState } from "react";
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
import { toast } from "sonner";
import { createCustomerAction } from "@/action/create-customer";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { formatCurrency } from "@/lib/utils";
import { PhoneInput } from "./ui/phone-input";
import { DialogClose } from "@radix-ui/react-dialog";

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  moneySpent: z.number({
    invalid_type_error: "Valor gasto precisa ser um número",
  }),
});

interface CustomerFormProps {
  storeId: string;
}

export function CustomerForm({ storeId }: CustomerFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      moneySpent: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      await createCustomerAction({
        xTenantId: storeId,
        createCustomerDto: {
          name: values.name,
          phone: values.phone,
          moneySpent: values.moneySpent,
        },
      });
      toast.success("Cliente adicionado", {
        description: "O cliente foi adicionado com sucesso.",
      });
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error("Erro", {
        description: "Ocorreu um erro ao adicionar o cliente.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (

    <DialogContent>
      <DialogHeader>
        <DialogTitle>Novo Cliente</DialogTitle>
        <DialogDescription>
          Criar uma nova conta de cliente no programa de fidelização.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Cliente</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <PhoneInput defaultCountry="BR" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="moneySpent"
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
                    <FormLabel>Dinheiro Gasto</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        value={formatCurrency(Number(field.value || 0))}
                        onChange={handleChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adicionando..." : "Adicionar Cliente"}
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
