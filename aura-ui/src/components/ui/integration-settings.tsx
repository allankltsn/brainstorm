"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

type IntegrationFieldBase = {
  id: string
  label: string
  description?: string
}

type IntegrationField = IntegrationFieldBase &
  (
    | { type: "toggle"; value: boolean }
    | { type: "text"; value: string; placeholder?: string }
  )

type IntegrationSettingsProps = React.ComponentProps<"div"> & {
  name: string
  fields: IntegrationField[]
  onChange?: (id: string, value: boolean | string) => void
  onSave?: () => void
}

function IntegrationSettings({
  name,
  fields,
  onChange,
  onSave,
  className,
  ...props
}: IntegrationSettingsProps) {
  const headingId = React.useId()

  return (
    <div data-slot="integration-settings" className={className} {...props}>
      <Card>
        <CardHeader>
          <CardTitle id={headingId}>{name}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {fields.map((field) => {
            const fieldLabelId = `${field.id}-label`
            const fieldDescriptionId = `${field.id}-description`

            if (field.type === "toggle") {
              return (
                <div
                  key={field.id}
                  data-slot="integration-field"
                  className="flex items-start justify-between gap-4"
                >
                  <div className="grid gap-0.5">
                    <Label id={fieldLabelId} htmlFor={field.id}>
                      {field.label}
                    </Label>
                    {field.description ? (
                      <p
                        id={fieldDescriptionId}
                        className="text-xs text-muted-foreground"
                      >
                        {field.description}
                      </p>
                    ) : null}
                  </div>
                  <Switch
                    id={field.id}
                    checked={field.value}
                    aria-labelledby={fieldLabelId}
                    aria-describedby={
                      field.description ? fieldDescriptionId : undefined
                    }
                    onCheckedChange={(checked) => onChange?.(field.id, checked)}
                  />
                </div>
              )
            }

            return (
              <div
                key={field.id}
                data-slot="integration-field"
                className="grid gap-1.5"
              >
                <Label id={fieldLabelId} htmlFor={field.id}>
                  {field.label}
                </Label>
                {field.description ? (
                  <p
                    id={fieldDescriptionId}
                    className="text-xs text-muted-foreground"
                  >
                    {field.description}
                  </p>
                ) : null}
                <Input
                  id={field.id}
                  defaultValue={field.value}
                  placeholder={field.placeholder}
                  aria-describedby={
                    field.description ? fieldDescriptionId : undefined
                  }
                  onChange={(event) => onChange?.(field.id, event.target.value)}
                />
              </div>
            )
          })}
        </CardContent>
        <CardFooter className={cn("justify-end")}>
          <Button type="button" onClick={() => onSave?.()}>
            Salvar
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export { IntegrationSettings }
export type { IntegrationSettingsProps, IntegrationField }
