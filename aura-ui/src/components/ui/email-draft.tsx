"use client"

import * as React from "react"
import { SendIcon, SparklesIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface EmailDraftProps extends React.ComponentProps<"div"> {
  to?: string
  subject?: string
  body?: string
  aiGenerated?: boolean
  onSend?: (draft: { to: string; subject: string; body: string }) => void
  onRegenerate?: () => void
}

function EmailDraft({
  to = "",
  subject = "",
  body = "",
  aiGenerated = false,
  onSend,
  onRegenerate,
  className,
  ...props
}: EmailDraftProps) {
  const [toValue, setToValue] = React.useState(to)
  const [subjectValue, setSubjectValue] = React.useState(subject)
  const [bodyValue, setBodyValue] = React.useState(body)

  function handleSend() {
    onSend?.({ to: toValue, subject: subjectValue, body: bodyValue })
  }

  return (
    <Card
      data-slot="email-draft"
      className={cn("w-full max-w-lg", className)}
      {...props}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Compor e-mail
          {aiGenerated ? (
            <Badge variant="secondary" data-icon="inline-start">
              <SparklesIcon />
              Rascunho da IA
            </Badge>
          ) : null}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email-draft-to"
            className="text-xs font-medium text-muted-foreground"
          >
            Para
          </label>
          <Input
            id="email-draft-to"
            type="email"
            placeholder="destinatario@exemplo.com"
            defaultValue={to}
            onChange={(event) => setToValue(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email-draft-subject"
            className="text-xs font-medium text-muted-foreground"
          >
            Assunto
          </label>
          <Input
            id="email-draft-subject"
            placeholder="Assunto do e-mail"
            defaultValue={subject}
            onChange={(event) => setSubjectValue(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email-draft-body"
            className="text-xs font-medium text-muted-foreground"
          >
            Mensagem
          </label>
          <Textarea
            id="email-draft-body"
            placeholder="Escreva sua mensagem…"
            className="min-h-32"
            defaultValue={body}
            onChange={(event) => setBodyValue(event.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="ghost" onClick={() => onRegenerate?.()}>
          Regenerar
        </Button>
        <Button variant="default" data-icon="inline-start" onClick={handleSend}>
          <SendIcon />
          Enviar
        </Button>
      </CardFooter>
    </Card>
  )
}

export { EmailDraft }
