import type { GetCustomerDetailResponse } from "@/gen";
import { CustomerSkeleton } from "./customer-detail";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { AlertTriangle, Mail, Phone } from "lucide-react";

interface CustomerDetailHeaderProps {
  storeId: string;
  customer: GetCustomerDetailResponse;
  isLoading: boolean;
}

export async function CustomerDetailHeader({
  storeId,
  customer,
  isLoading,
}: CustomerDetailHeaderProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <CustomerSkeleton />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between flex-1">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20 rounded-full border border-primary/20 bg-primary/10">
          <AvatarFallback className="rounded-full text-base font-semibold text-primary flex items-center justify-center h-full w-full">
            {customer?.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>

        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">{customer?.name}</h2>
            <Badge className="ml-2 font-semibold">
              {customer?.tier ?? "Bronze"}
            </Badge>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
              Ativo
            </Badge>
          </div>

          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-1" />
              {customer?.email ?? "teste@teste.com"}
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-1" />
              {customer?.phone ?? "+55 (99) 99999-9999"}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3">
            {customer?.tags?.length ? (
              customer?.tags?.map((i, tag) => (
                <Badge key={i} variant="outline" className="bg-primary/5">
                  {tag}
                </Badge>
              ))
            ) : (
              <Badge variant="outline" className="bg-primary/5">
                Example
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Transaction
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Add Transaction for {selectedCustomer.name}
                  </DialogTitle>
                  <DialogDescription>
                    Record a new purchase or redemption
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="transaction-type">Transaction Type</Label>
                    <Select
                      defaultValue="purchase"
                      onValueChange={setTransactionType}
                    >
                      <SelectTrigger id="transaction-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="purchase">
                          Purchase (Add Points)
                        </SelectItem>
                        <SelectItem value="redemption">
                          Redemption (Use Points)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div
                    className="transaction-fields-purchase"
                    style={{
                      display:
                        transactionType === "purchase" ? "block" : "none",
                    }}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="transaction-store">Store</Label>
                      <Select>
                        <SelectTrigger id="transaction-store">
                          <SelectValue placeholder="Select store" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ice-cream">
                            Ice Cream Shop
                          </SelectItem>
                          <SelectItem value="clothing">
                            Clothing Store
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="transaction-amount">Amount ($)</Label>
                      <Input
                        id="transaction-amount"
                        type="number"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="transaction-points">Points</Label>
                      <Input id="transaction-points" type="number" min="0" />
                      <p className="text-xs text-muted-foreground">
                        Points will be calculated automatically based on
                        purchase amount
                      </p>
                    </div>
                  </div>

                  <div
                    className="transaction-fields-redemption"
                    style={{
                      display:
                        transactionType === "redemption" ? "block" : "none",
                    }}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="transaction-reward">Select Reward</Label>
                      <Select>
                        <SelectTrigger id="transaction-reward">
                          <SelectValue placeholder="Select reward" />
                        </SelectTrigger>
                        <SelectContent>
                          {rewards?.map((reward) => (
                            <SelectItem
                              key={reward.id}
                              value={reward.id.toString()}
                              disabled={reward.pointValue > customer?.points}
                            >
                              {reward.name} ({reward.pointValue} points)
                              {reward.pointValue > customer?.points
                                ? " - Not enough points"
                                : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="transaction-store-redemption">
                        Store
                      </Label>
                      <Select>
                        <SelectTrigger id="transaction-store-redemption">
                          <SelectValue placeholder="Select store" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ice-cream">
                            Ice Cream Shop
                          </SelectItem>
                          <SelectItem value="clothing">
                            Clothing Store
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="transaction-notes">Notes</Label>
                      <Input
                        id="transaction-notes"
                        placeholder="Optional notes about this redemption"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Add Transaction</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Gift className="h-4 w-4 mr-2" />
                  Process Reward
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Process Reward for {customer?.name}</DialogTitle>
                  <DialogDescription>
                    Redeem points for a reward
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="reward-select">Select Reward</Label>
                    <Select>
                      <SelectTrigger id="reward-select">
                        <SelectValue placeholder="Select reward" />
                      </SelectTrigger>
                      <SelectContent>
                        {rewards?.map((reward) => (
                          <SelectItem
                            key={reward.id}
                            value={reward.id.toString()}
                            disabled={reward.pointValue > customer?.points}
                          >
                            {reward.name} ({reward.pointValue} points)
                            {reward.pointValue > customer?.points
                              ? " - Not enough points"
                              : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reward-notes">Notes</Label>
                    <Input
                      id="reward-notes"
                      placeholder="Optional notes about this redemption"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Process Redemption</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div> */}
    </div>
  );
}

export function CustomerNotFound() {
  return (
    <div className="flex flex-col items-center justify-center w-full py-12 text-center text-muted-foreground">
      <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
      <h2 className="text-2xl font-bold text-destructive">
        Cliente não encontrado
      </h2>
      <p className="mt-2 text-sm">
        O cliente que você está tentando acessar não existe ou foi removido.
      </p>
      <Badge
        variant="outline"
        className="mt-4 bg-destructive/10 text-destructive"
      >
        Erro 404
      </Badge>
    </div>
  );
}
