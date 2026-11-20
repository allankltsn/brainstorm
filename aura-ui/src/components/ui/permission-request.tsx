import * as React from "react"
import { ShieldIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

function PermissionRequest({
  title,
  description,
  scope,
  icon = <ShieldIcon />,
  status = "pending",
  onAllow,
  onDeny,
  allowLabel = "Permitir",
  denyLabel = "Negar",
  className,
  ...props
}: Omit<React.ComponentProps<typeof Card>, "title"> & {
  title: string
  description?: React.ReactNode
  scope?: string
  icon?: React.ReactNode
  status?: "pending" | "allowed" | "denied"
  onAllow?: () => void
  onDeny?: () => void
  allowLabel?: string
  denyLabel?: string
}) {
  return (
    <Card
      data-slot="permission-request"
      className={cn(className)}
      {...props}
    >
      <CardHeader>
        <div className="flex items-start gap-2">
          <span
            data-slot="permission-request-icon"
            className="flex size-5 shrink-0 items-center justify-center text-muted-foreground [&_svg]:size-4"
          >
            {icon}
          </span>
          <div className="grid gap-1">
            <CardTitle>{title}</CardTitle>
            {description ? (
              <CardDescription>{description}</CardDescription>
            ) : null}
          </div>
        </div>
      </CardHeader>
      {scope ? (
        <CardContent>
          <Badge
            variant="secondary"
            data-slot="permission-request-scope"
            className="font-mono"
          >
            {scope}
          </Badge>
        </CardContent>
      ) : null}
      <CardFooter className="gap-2">
        {status === "pending" ? (
          <>
            <Button variant="default" onClick={onAllow}>
              {allowLabel}
            </Button>
            <Button variant="outline" onClick={onDeny}>
              {denyLabel}
            </Button>
          </>
        ) : status === "allowed" ? (
          <Badge variant="secondary">Permitido</Badge>
        ) : (
          <Badge variant="destructive">Negado</Badge>
        )}
      </CardFooter>
    </Card>
  )
}

export { PermissionRequest }
