import type { WhatsappNotificationMapResponse } from "@/gen";
import { useGetStoreNotifications, useUpdateStoreNotifications } from "@/lib/services/store-service";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Skeleton } from "./ui/skeleton";
import { Textarea } from "./ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface NotificationConfigFormProps {
  storeId: string
}

export function WhatsappConfigForm({ storeId }: NotificationConfigFormProps) {
  const { data, isLoading } = useGetStoreNotifications({ xTenantId: storeId })

  const [selectedMessageType, setSelectedMessageType] = useState<
    keyof WhatsappNotificationMapResponse | null
  >(null)

  const [whatsappMessages, setWhatsappMessages] = useState<Record<string, string>>({})

  const { mutateAsync: updateStoreNotifictions } = useUpdateStoreNotifications()

  useEffect(() => {
    if (data && Object.keys(whatsappMessages).length === 0) {
      const initialMessages: Record<string, string> = {}
      for (const key of Object.keys(data) as Array<keyof WhatsappNotificationMapResponse>) {
        const config = data[key]
        if (config) {
          initialMessages[key] = config.defaultMessage
        }
      }
      setWhatsappMessages(initialMessages)
      setSelectedMessageType(Object.keys(data)[0] as keyof WhatsappNotificationMapResponse)
    }
  }, [data])

  const handleSaveWhatsappMessages = async () => {
    try {
      await updateStoreNotifictions({ xTenantId: storeId, body: whatsappMessages })
      toast.success("WhatsApp messages saved", {
        description: "Your WhatsApp message templates have been updated.",
      })

    } catch (error) {
      console.log(error)
    }

  }

  const handleMessageChange = (messageType: string, newMessage: string) => {
    setWhatsappMessages((prev) => ({
      ...prev,
      [messageType]: newMessage,
    }))
  }

  const insertVariable = (variable: string) => {
    const current = whatsappMessages[selectedMessageType ?? ""] || ""
    const updated = `${current} ${variable}`
    if (selectedMessageType) {
      handleMessageChange(selectedMessageType, updated)
    }
  }

  if (isLoading || !data || !selectedMessageType) {
    return (
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-2/3 mt-2" />
          </CardHeader>
          <CardContent className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-md" />
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 space-y-4 p-6">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-1/3 mb-4" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-full" />
        </Card>
      </div>
    )
  }

  const currentConfig = data[selectedMessageType]

  if (!currentConfig) {
    return <p>Configuração não encontrada.</p>
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Lista de tipos de mensagem */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Tipos de Mensagem</CardTitle>
          <CardDescription>Escolha uma mensagem para configurar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.entries(data).map(([key, config]) => (
            <Button
              key={key}
              variant={selectedMessageType === key ? "default" : "ghost"}
              className="w-full justify-start text-left h-auto p-3"
              onClick={() =>
                setSelectedMessageType(key as keyof WhatsappNotificationMapResponse)
              }
            >
              <div className="w-full">
                <div className="font-medium">{config.name}</div>
                <div
                  className={`text-xs mt-1 break-words whitespace-normal ${selectedMessageType === key
                    ? "text-primary-foreground"
                    : "text-muted-foreground"
                    }`}
                >
                  {config.description}
                </div>
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Editor de mensagem */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>{currentConfig.name}</CardTitle>
          <CardDescription>{currentConfig.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Variáveis disponíveis */}
          <div>
            <Label className="text-sm font-medium">Variáveis Disponíveis</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {currentConfig.variables.map((variable) => (
                <Tooltip key={variable.key}>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => insertVariable(variable.key)}
                    >
                      {variable.key}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{variable.description}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Clique em uma variável para inseri-la na mensagem
            </p>
          </div>

          {/* Editor de mensagem */}
          <div className="space-y-2">
            <Label htmlFor="message-content">Conteúdo da Mensagem</Label>
            <Textarea
              id="message-content"
              placeholder="Digite sua mensagem personalizada..."
              value={whatsappMessages[selectedMessageType] || ""}
              onChange={(e) =>
                handleMessageChange(selectedMessageType, e.target.value)
              }
              rows={8}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Use as variáveis acima para personalizar suas mensagens.
            </p>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label>Pré-visualização</Label>
            <div className="bg-muted p-4 rounded-lg border">
              <div className="bg-green-500 text-white p-3 rounded-lg max-w-sm ml-auto">
                <div className="whitespace-pre-wrap text-sm">
                  {whatsappMessages[selectedMessageType]?.replace(
                    /\{\{(\w+)\}\}/g,
                    (match, variable) => {
                      const exampleValues: Record<string, string> = {
                        customer_name: "João Silva",
                        store_name: "Minha Loja",
                        points_added: "25",
                        total_points: "150",
                        purchase_amount: "50,00",
                        points_used: "100",
                        remaining_points: "50",
                        reward_name: "10% de Desconto",
                        expiring_points: "75",
                        expiration_date: "15/12/2023",
                        welcome_points: "10",
                      }
                      return exampleValues[variable] || match
                    }
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Assim a mensagem aparecerá no WhatsApp (com dados de exemplo)
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveWhatsappMessages} className="w-full">
            Salvar Mensagem do WhatsApp
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
