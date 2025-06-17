import type { GetCustomerDetailResponse } from "@/gen";
import {
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Gift, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { useCallback, useState } from "react";
import { Input } from "../ui/input";
import { useCreateTransaction } from "@/lib/services/transaction-service";
import { DialogClose } from "@radix-ui/react-dialog";

type ProcessRewardModalProps = {
    storeId: string;
    customer: GetCustomerDetailResponse;
};

const redeemSchema = z.object({
    amount: z.number().min(0.01, "Valor deve ser maior que zero"),
});

export const AddTransactionDialog: React.FC<ProcessRewardModalProps> = ({
    storeId,
    customer,
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof redeemSchema>>({
        resolver: zodResolver(redeemSchema),
        defaultValues: {
            amount: 0,
        },
    });

    const { mutateAsync: createTransaction } = useCreateTransaction();

    async function onSubmit(values: z.infer<typeof redeemSchema>) {
        try {
            setIsSubmitting(true);
            await createTransaction({
                xTenantId: storeId,
                addPointsDto: { customerId: customer.id, moneySpent: values.amount },
            });
            form.reset({ amount: 0 });
        } catch (error) {
            form.reset({ amount: 0 });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Adicionar transação para {customer.name}</DialogTitle>
            </DialogHeader>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => {
                            const handleChange = useCallback(
                                (e: React.ChangeEvent<HTMLInputElement>) => {
                                    const rawValue = e.target.value.replace(/\D/g, "");
                                    const numericValue = Number(rawValue) / 100;
                                    field.onChange(numericValue);
                                },
                                [field]
                            );
                            return (
                                <FormItem>
                                    <FormLabel>Valor da Compra (R$)</FormLabel>
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

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="submit" disabled={isSubmitting || !form.formState.isValid}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Processando...
                                    </>
                                ) : (
                                    <>
                                        <Gift className="w-4 h-4 mr-2" />
                                        Adicionar transação
                                    </>
                                )}
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    );
};
