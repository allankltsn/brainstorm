import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

type FormFieldContextValue = {
  id: string
  descriptionId: string
  messageId: string
  error: boolean
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null)

function useFormField() {
  const ctx = React.useContext(FormFieldContext)
  if (!ctx) {
    throw new Error("useFormField must be used within a <FormField>")
  }
  return ctx
}

function FormField({
  className,
  error = false,
  children,
  ...props
}: React.ComponentProps<"div"> & { error?: boolean }) {
  const id = React.useId()
  const value = React.useMemo<FormFieldContextValue>(
    () => ({
      id,
      descriptionId: `${id}-description`,
      messageId: `${id}-message`,
      error,
    }),
    [id, error]
  )

  return (
    <FormFieldContext.Provider value={value}>
      <div
        data-slot="form-field"
        className={cn("grid gap-1.5", className)}
        {...props}
      >
        {children}
      </div>
    </FormFieldContext.Provider>
  )
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  const { id, error } = useFormField()
  return (
    <Label
      data-slot="form-label"
      htmlFor={id}
      className={cn(error && "text-destructive", className)}
      {...props}
    />
  )
}

function FormControl({ children }: { children: React.ReactElement }) {
  const { id, descriptionId, messageId, error } = useFormField()
  return React.cloneElement(children, {
    id,
    "aria-invalid": error || undefined,
    "aria-describedby": error ? `${descriptionId} ${messageId}` : descriptionId,
  } as React.HTMLAttributes<HTMLElement>)
}

function FormDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  const { descriptionId } = useFormField()
  return (
    <p
      data-slot="form-description"
      id={descriptionId}
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

function FormMessage({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  const { messageId } = useFormField()
  if (!children) return null
  return (
    <p
      data-slot="form-message"
      id={messageId}
      className={cn("text-xs text-destructive", className)}
      {...props}
    >
      {children}
    </p>
  )
}

export { FormField, FormLabel, FormControl, FormDescription, FormMessage }
