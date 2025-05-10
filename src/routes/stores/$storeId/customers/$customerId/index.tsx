import { createFileRoute, Link } from "@tanstack/react-router";
import {
    Gift,
    ShoppingBag,
    Mail,
    Phone,
    ChevronLeft,
    BadgePercent,
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
import { Separator } from "@radix-ui/react-separator";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { Badge } from "@/components/ui/badge";
import { useGetCustomerDetail } from "@/lib/services/customer-service";
import { CustomerDetailsSkeleton, CustomerSkeleton } from "@/components/customer-detail";

export const Route = createFileRoute("/stores/$storeId/customers/$customerId/")(
    {
        component: RouteComponent,
    }
);

function RouteComponent() {
    const { storeId, customerId } = Route.useParams();
    const {
        data: customer,
        isError: err,
        isLoading,
        isRefetching,

    } = useGetCustomerDetail({ xTenantId: storeId, customerId });


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
                        {isRefetching || isLoading ? (
                            <CustomerSkeleton />
                        ) : (
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
                                        {"active" === "active" ? (
                                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                                Ativo
                                            </Badge>
                                        ) : (
                                            <Badge>Inativo</Badge>
                                        )}
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
                                        {customer?.tags?.map((tag) => (
                                            <Badge variant="outline" className="bg-primary/5">
                                                {tag}
                                            </Badge>
                                        )) ?? (
                                                <Badge variant="outline" className="bg-primary/5">
                                                    Example
                                                </Badge>
                                            )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Customer Avatar and Basic Info */}
                    </div>

                    <div className="mt-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Customer Details Card */}
                            {isRefetching || isLoading ? (
                                <CustomerDetailsSkeleton />
                            ) : (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Detalhes do Cliente</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-muted-foreground">
                                                    Member Since
                                                </p>
                                                <p className="font-medium">
                                                    {customer?.memberSince?.toLocaleDateString('pt-BR')}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Status</p>
                                                <p className="font-medium capitalize">asdad</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Birthdate</p>
                                                <p className="font-medium">adsadsa</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Tier</p>
                                                <p className="font-medium">dsadasd</p>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div>
                                            <p className="text-sm text-muted-foreground">Address</p>
                                            <p className="font-medium">sadad</p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-muted-foreground">Preferences</p>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                <Badge variant="outline">aasdads</Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                            {/* Points & Tier Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        Points & Tier Status
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Current Tier
                                            </p>
                                            <div className="flex items-center">
                                                <Badge variant="outline" className="mt-1 font-semibold">
                                                    asdasd
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-muted-foreground">
                                                Available Points
                                            </p>
                                            <p className="text-2xl font-bold text-primary">10</p>
                                        </div>
                                    </div>

                                    {/* Progress to next tier */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Progress to TESTE</span>
                                            <span>85</span>
                                        </div>
                                        <Progress value={100} className="h-2" />
                                        <p className="text-xs text-muted-foreground">
                                            100 more points needed for TESTE
                                        </p>
                                    </div>

                                    <Separator />

                                    <div className="space-y-2">
                                        <p className="text-sm font-medium">Points History</p>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center text-sm">
                                                <span>Earned (Lifetime)</span>
                                                <span className="font-medium">350</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span>Redeemed (Lifetime)</span>
                                                <span className="font-medium">125</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span>Expired</span>
                                                <span className="font-medium">0</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button className="w-full">
                                                    <BadgePercent className="mr-2 h-4 w-4" />
                                                    Manage Points
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Manage Points</DialogTitle>
                                                    <DialogDescription>
                                                        Add or remove points from Tiago de Castro's account
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
                                                                <SelectItem value="add">Add Points</SelectItem>
                                                                <SelectItem value="remove">
                                                                    Remove Points
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="points-amount">Points Amount</Label>
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

                            {/* Recent Activity Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div
                                                className={`mt-0.5 p-1.5 rounded-full ${"Purchase" === "Purchase"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-amber-100 text-amber-700"
                                                    }`}
                                            >
                                                {"Purchase" === "Purchase" ? (
                                                    <ShoppingBag className="h-3 w-3" />
                                                ) : (
                                                    <Gift className="h-3 w-3" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between">
                                                    <p className="text-sm font-medium">
                                                        {"Purchase" === "Purchase"
                                                            ? "Purchase"
                                                            : "Redemption"}
                                                    </p>
                                                    <p
                                                        className={`text-sm font-medium ${1 > 0 ? "text-green-600" : "text-amber-600"
                                                            }`}
                                                    >
                                                        10 pts
                                                    </p>
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    asdasd • landajdnasd
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <Button variant="ghost" className="w-full text-sm">
                                        View All Activity
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Available Rewards */}
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Available Rewards</CardTitle>
                                <CardDescription>Rewards that asda can redeem</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div
                                        key={1}
                                        className={`border rounded-lg p-4 ${1 <= 2
                                            ? "border-primary/20 bg-primary/5"
                                            : "border-muted bg-muted/10"
                                            }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="font-medium">10% de desconto</div>
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    tralalero tralala
                                                </div>
                                            </div>
                                            <Badge variant="outline">75 pts</Badge>
                                        </div>

                                        <div className="mt-4">
                                            <div className="text-xs text-muted-foreground">
                                                <div className="flex justify-between mb-1">
                                                    <span>Progress</span>
                                                    <span>100</span>
                                                </div>
                                                <Progress value={20 * 100} className="h-1" />
                                                <p className="mt-1 text-center">Need 04 more points</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
