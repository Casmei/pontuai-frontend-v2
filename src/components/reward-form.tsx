"use client"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useCreateReward } from "@/lib/services/reward-service"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  pointsRequired: z.coerce.number().int().min(1, "Deve ser pelo menos 1 ponto"),
})

interface RewardFormProps {
  storeId: string
}

export function RewardForm({ storeId }: RewardFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { mutateAsync: createReward } = useCreateReward()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      pointsRequired: 0,
    },
  })

  async function onSubmit({ name, pointsRequired, description }: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)

      await createReward({
        xTenantId: storeId,
        createRewardDto: {
          name,
          description: description || "",
          pointValue: pointsRequired,
        },
      })

      toast.success("Recompensa adicionada", {
        description: "A recompensa foi adicionada com sucesso.",
      })
      form.reset()
    } catch (error) {
      console.error(error)
      toast("Erro", {
        description: "Ocorreu um erro ao adicionar a recompensa.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da Recompensa</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Café Grátis" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pointsRequired"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pontos Necessários</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição (opcional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Descreva a recompensa" {...field} />
              </FormControl>
              <FormDescription>
                Forneça detalhes sobre a recompensa e como ela pode ser resgatada
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Adicionando..." : "Adicionar Recompensa"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
