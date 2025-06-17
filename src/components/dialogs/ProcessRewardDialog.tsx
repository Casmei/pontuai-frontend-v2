import type { CreateRewardResponse, GetCustomerDetailResponse } from "@/gen";
import {
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Gift, Loader2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
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
import { useState } from "react";
import { DialogClose } from "@radix-ui/react-dialog";
import { useRedeemReward } from "@/lib/services/transaction-service";

type ProcessRewardModalProps = {
    storeId: string;
    customer?: GetCustomerDetailResponse;
    rewards?: CreateRewardResponse[];
    points?: number
};

const redeemSchema = z.object({
    customerId: z.string().min(1, "Cliente inválido"),
    rewardId: z.string().min(1, "Selecione um prêmio"),
});

export const ProcessRewardModal: React.FC<ProcessRewardModalProps> = ({
    storeId,
    customer,
    rewards,
    points
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof redeemSchema>>({
        resolver: zodResolver(redeemSchema),
        defaultValues: {
            customerId: customer?.id || "",
            rewardId: "",
        },
    });

    const { mutateAsync: redeemReward } = useRedeemReward();

    async function onSubmit(values: z.infer<typeof redeemSchema>) {
        try {
            setIsSubmitting(true);
            await redeemReward({
                xTenantId: storeId,
                id: values.rewardId,
                redeemRewardDto: { customerId: values.customerId },
            });
            form.reset({ rewardId: "", customerId: customer?.id });
        } catch (error) {
            console.error("Erro ao resgatar prêmio:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Processar resgate para {customer?.name}</DialogTitle>
            </DialogHeader>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="rewardId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Selecione o prêmio</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Selecione um prêmio" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {rewards?.map((reward) => (
                                            <SelectItem
                                                key={reward.id}
                                                value={reward.id.toString()}
                                                disabled={reward.pointValue > points!}
                                            >
                                                {reward.name} ({reward.pointValue} pts)
                                                {reward.pointValue > points!
                                                    ? " - Pts insuficientes"
                                                    : ""}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                type="submit"
                                disabled={isSubmitting || !form.formState.isValid}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Processando...
                                    </>
                                ) : (
                                    <>
                                        <Gift className="w-4 h-4 mr-2" />
                                        Processar Resgate
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