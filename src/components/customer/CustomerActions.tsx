import { Button } from "@/components/ui/button";
import { Gift, Plus } from "lucide-react";
import {
    Dialog,
    DialogTrigger
} from "@/components/ui/dialog";
import { ProcessRewardModal } from '../dialogs/ProcessRewardDialog';
import { AddTransactionDialog } from '../dialogs/AddTransactionDialog';
import type { CreateRewardResponse, GetCustomerDetailResponse } from '@/gen';
type CustomerActionsProps = {
    storeId: string,
    customer?: GetCustomerDetailResponse;
    rewards?: CreateRewardResponse[];
    points?: number;
}

export function CustomerActions({ storeId, customer, rewards, points }: CustomerActionsProps) {
    const isCustomerLoaded = !!customer?.id;

    return (
        <div className="flex gap-2">
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        size="lg"
                        disabled={!isCustomerLoaded}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Transaction
                    </Button>
                </DialogTrigger>
                {isCustomerLoaded && (
                    <AddTransactionDialog
                        customer={customer}
                        storeId={storeId}
                    />
                )}
            </Dialog>

            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        size="lg"
                        disabled={!isCustomerLoaded}
                    >
                        <Gift className="h-4 w-4 mr-2" />
                        Realizar Resgate
                    </Button>
                </DialogTrigger>

                {rewards && isCustomerLoaded && (
                    <ProcessRewardModal
                        points={points}
                        storeId={storeId}
                        customer={customer}
                        rewards={rewards}
                    />
                )}
            </Dialog>
        </div>
    );
}