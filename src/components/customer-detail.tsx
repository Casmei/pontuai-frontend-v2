import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "@radix-ui/react-separator";
import { Button } from "react-day-picker";

export function CustomerSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <div className="h-20 w-20 rounded-full border border-primary/20 bg-primary/10 flex items-center justify-center">
        <Skeleton className="h-20 w-20 rounded-full" />
      </div>

      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-48 rounded" />
          <Skeleton className="h-5 w-12 rounded" />
          <Skeleton className="h-5 w-16 rounded" />
        </div>

        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-32 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-28 rounded" />
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <Skeleton className="h-5 w-20 rounded" />
        </div>
      </div>
    </div>
  );
}

export function CustomerDetailsSkeleton() {
  return (
    <Card className="md:col-span-5">
      <CardHeader>
        <CardTitle className="text-lg">Detalhes do Cliente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i}>
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-5 w-32" />
            </div>
          ))}
        </div>

        <Separator />

        <div>
          <Skeleton className="h-4 w-20 mb-1" />
          <Skeleton className="h-5 w-full max-w-md" />
        </div>

        <div>
          <Skeleton className="h-4 w-24 mb-1" />
          <div className="flex flex-wrap gap-2 mt-1">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-20 rounded" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function RewardListSkeleton() {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-40" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-80" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="border rounded-lg p-4 bg-muted/40 opacity-50 animate-pulse"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" /> {/* Título */}
                  <Skeleton className="h-3 w-40" /> {/* Descrição */}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Skeleton className="h-4 w-4 rounded" /> {/* Ícone */}
                  <Skeleton className="h-5 w-12 rounded-full" /> {/* Badge */}
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-8" />
                </div>
                <Skeleton className="h-1 w-full rounded" />{" "}
                {/* Barra de progresso */}
                <Skeleton className="h-4 w-32 mx-auto" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function RecentActivitySkeleton() {
  return (
    <Card className="md:col-span-3">
      <CardHeader>
        <CardTitle className="text-lg">Atividades Recentes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-6 w-6 rounded-full" />
              <div className="flex-1 space-y-1">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" /> {/* Tipo da transação */}
                  <Skeleton className="h-4 w-12" /> {/* Pontos */}
                </div>
                <Skeleton className="h-3 w-32" /> {/* Nome da recompensa */}
              </div>
            </div>
          ))}
        </div>
        <Skeleton className="h-4 w-24 mx-auto" />
      </CardContent>
    </Card>
  );
}

export function CustomerPointsSkeleton() {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg">Pontos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" /> {/* Label */}
            <Skeleton className="h-6 w-28 rounded" /> {/* Badge */}
          </div>
          <div className="text-right space-y-2">
            <Skeleton className="h-4 w-28 ml-auto" /> {/* Label */}
            <Skeleton className="h-6 w-16 ml-auto" /> {/* Points */}
          </div>
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />{" "}
          {/* Subtítulo "Detalhes dos pontos" */}
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div
                className="flex justify-between items-center text-sm"
                key={i}
              >
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <Skeleton className="h-10 w-full rounded-md" />{" "}
          {/* Manage Points button */}
        </div>
      </CardContent>
    </Card>
  );
}
