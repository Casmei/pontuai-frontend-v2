import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Gift,
  ShoppingBag,
  Mail,
  Phone,
  ChevronLeft,
  BadgePercent,
  LockIcon,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { Badge } from "@/components/ui/badge";
import {
  useGetCustomerDetail,
  useGetCustomerTransactionDetail,
} from "@/lib/services/customer-service";
import {
  CustomerDetailsSkeleton,
  CustomerPointsSkeleton,
  CustomerSkeleton,
  RecentActivitySkeleton,
  RewardListSkeleton,
} from "@/components/customer-detail";
import { useGetRewards } from "@/lib/services/reward-service";
import { custom } from "zod";

export const Route = createFileRoute("/stores/$storeId/customers/$customerId/")(
  {
    component: RouteComponent,
  },
);

function RouteComponent() {
  const { storeId, customerId } = Route.useParams();
  const {
    data: customer,
    isError: err,
    isLoading,
  } = useGetCustomerDetail({ xTenantId: storeId, customerId });

  const {
    data: customerTransaction,
    isError: transactionErr,
    isLoading: transactionIsLoading,
  } = useGetCustomerTransactionDetail({ xTenantId: storeId, customerId });

  const {
    data: rewards,
    isError: rewardErr,
    isLoading: rewardLoading,
  } = useGetRewards({ xTenantId: storeId });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Link to="/stores/$storeId/customers" params={{ storeId }}>
          <Button variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Voltar a listagem
          </Button>
        </Link>
      </div>
      <div className="bg-white border rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {isLoading ? (
              <CustomerSkeleton />
            ) : (
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
                          <Badge
                            key={i}
                            variant="outline"
                            className="bg-primary/5"
                          >
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

                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Transaction
                      </Button>
                    </DialogTrigger>
                    {/* <DialogContent>
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
                          <Label htmlFor="transaction-type">
                            Transaction Type
                          </Label>
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
                            <Label htmlFor="transaction-amount">
                              Amount ($)
                            </Label>
                            <Input
                              id="transaction-amount"
                              type="number"
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="transaction-points">Points</Label>
                            <Input
                              id="transaction-points"
                              type="number"
                              min="0"
                            />
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
                              transactionType === "redemption"
                                ? "block"
                                : "none",
                          }}
                        >
                          <div className="space-y-2">
                            <Label htmlFor="transaction-reward">
                              Select Reward
                            </Label>
                            <Select>
                              <SelectTrigger id="transaction-reward">
                                <SelectValue placeholder="Select reward" />
                              </SelectTrigger>
                              <SelectContent>
                                {rewards?.map((reward) => (
                                  <SelectItem
                                    key={reward.id}
                                    value={reward.id.toString()}
                                    disabled={
                                      reward.pointValue > customer?.points
                                    }
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
                    </DialogContent> */}
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Gift className="h-4 w-4 mr-2" />
                        Process Reward
                      </Button>
                    </DialogTrigger>
                    {/* <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          Process Reward for {customer?.name}
                        </DialogTitle>
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
                                  disabled={
                                    reward.pointValue > customer?.points
                                  }
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
                    </DialogContent> */}
                  </Dialog>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {isLoading && transactionIsLoading ? (
                <CustomerDetailsSkeleton />
              ) : (
                <Card className="md:col-span-5">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Detalhes do Cliente
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Membro desde
                        </p>
                        <p className="font-medium">
                          {customer?.memberSince?.toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Aniversário
                        </p>
                        <p className="font-medium">
                          {customer?.birthdate || "Não informado"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Nível</p>
                        <p className="font-medium">
                          {customer?.tier || "Não informado"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Endereço
                        </p>
                        <p className="font-medium">
                          {customer?.address || "Não informado"}
                        </p>
                      </div>

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
              )}

              {isLoading && transactionIsLoading ? (
                <CustomerPointsSkeleton />
              ) : (
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg">Pontos</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col justify-between flex-1">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Nível Atual
                          </p>
                          <div className="flex items-center">
                            <Badge
                              variant="outline"
                              className="mt-1 font-semibold"
                            >
                              Super Amigo
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            Pontos disponíveis
                          </p>
                          <p className="text-2xl font-bold text-primary">
                            {customer?.points}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium">
                          Detalhes dos pontos
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span>Ganhados (Ao todo)</span>
                            <span className="font-medium">
                              {customerTransaction?.earnedPoints || 0}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span>Resgatados (Ao todo)</span>
                            <span className="font-medium">
                              {customerTransaction?.redeemedPoints || 0}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span>Expirados (Ao todo)</span>
                            <span className="font-medium">
                              {customerTransaction?.expiredPoints || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button disabled className="w-full">
                            <BadgePercent className="mr-2 h-4 w-4" />
                            Gerenciar Pontos
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Manage Points</DialogTitle>
                            <DialogDescription>
                              Add or remove points from Tiago de Castro's
                              account
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="points-action">Action</Label>
                              <Select>
                                <SelectTrigger id="points-action">
                                  <SelectValue placeholder="Select action" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="add">
                                    Add Points
                                  </SelectItem>
                                  <SelectItem value="remove">
                                    Remove Points
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="points-amount">
                                Points Amount
                              </Label>
                              <Input id="points-amount" type="number" min="1" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="points-reason">Reason</Label>
                              <Select>
                                <SelectTrigger id="points-reason">
                                  <SelectValue placeholder="Select reason" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="purchase">
                                    Purchase
                                  </SelectItem>
                                  <SelectItem value="bonus">
                                    Bonus Points
                                  </SelectItem>
                                  <SelectItem value="correction">
                                    Correction
                                  </SelectItem>
                                  <SelectItem value="promotion">
                                    Promotion
                                  </SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="points-notes">Notes</Label>
                              <Input
                                id="points-notes"
                                placeholder="Additional details"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit">Update Points</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              )}

              {isLoading && transactionIsLoading ? (
                <RecentActivitySkeleton />
              ) : (
                <Card className="md:col-span-3">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Atividades Recentes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      {customerTransaction?.transactions.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center">
                          Nenhuma transação encontrada para este cliente.
                        </p>
                      ) : (
                        customerTransaction?.transactions.map((transaction) => (
                          <div
                            key={transaction.id}
                            className="flex items-start gap-3"
                          >
                            <div
                              className={`mt-0.5 p-1.5 rounded-full ${transaction.type === "input"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-amber-100 text-amber-700"
                                }`}
                            >
                              {transaction.type === "input" ? (
                                <ShoppingBag className="h-3 w-3" />
                              ) : (
                                <Gift className="h-3 w-3" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <p className="text-sm font-medium">
                                  {transaction.type === "input"
                                    ? "Compra"
                                    : "Resgate"}
                                </p>
                                <p
                                  className={`text-sm font-medium ${transaction.points > 0
                                      ? "text-green-600"
                                      : "text-amber-600"
                                    }`}
                                >
                                  {transaction.points} pts
                                </p>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {transaction.reward?.name}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <Button variant="ghost" className="w-full text-sm">
                      Ver todas as transações
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
      {isLoading && rewardLoading && customer ? (
        <RewardListSkeleton />
      ) : (
        <Card className="mt-6" style={{ contentVisibility: "auto" }}>
          <CardHeader>
            <CardTitle>Prêmios disponíveis</CardTitle>
            <CardDescription>
              Prêmios que o cliente{" "}
              <span className="text-primary font-semibold">
                {customer?.name}
              </span>{" "}
              pode resgatar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {rewards?.map((reward) => (
                <div
                  key={reward.id}
                  className={`border rounded-lg p-4 relative transition-opacity ${reward.points > customer.points
                    ? "border-primary/20 bg-primary/5"
                    : "border-destructive/20 bg-muted/40 opacity-50 cursor-not-allowed"
                    }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{reward.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {reward.description || "Sem descrição"}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {reward.points > customer.points && (
                        <LockIcon className="w-4 h-4 text-destructive" />
                      )}
                      <LockIcon className="w-4 h-4 text-destructive" />
                      <Badge variant="outline">
                        {reward.pointValue} pts
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="text-xs text-muted-foreground">
                      <div className="flex justify-between mb-1">
                        <span>Progresso</span>
                        <span>
                          {Math.floor(
                            Math.min(
                              (customer?.points / reward.pointValue) *
                              100,
                              100,
                            ),
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        value={Math.min(
                          (customer?.points / reward.pointValue) * 100,
                          100,
                        )}
                        className="h-1"
                      />
                      <p className="mt-1 text-center">
                        {Math.max(
                          reward.pointValue - (customer?.points ?? 0),
                          0,
                        ) > 0
                          ? `Precisa de mais ${Math.max(reward.pointValue - (customer?.points ?? 0), 0)} points`
                          : "Prêmio disponível 🎉"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
