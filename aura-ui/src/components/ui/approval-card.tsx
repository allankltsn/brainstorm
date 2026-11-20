import * as React from "react"
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

function ApprovalCard({
  title,
  description,
  details,
  icon,
  status = "pending",
  onApprove,
  onReject,
  approveLabel = "Aprovar",
  rejectLabel = "Recusar",
  className,
  ...props
}: Omit<React.ComponentProps<typeof Card>, "title"> & {
  title: string
  description?: React.ReactNode
  details?: React.ReactNode
  icon?: React.ReactNode
  status?: "pending" | "approved" | "rejected"
  onApprove?: () => void
  onReject?: () => void
  approveLabel?: string
  rejectLabel?: string
}) {
  return (
    <Card data-slot="approval-card" className={className} {...props}>
      <CardHeader>
        <div className="flex items-start gap-2">
          {icon ? (
            <span
              data-slot="approval-card-icon"
              className="flex size-5 shrink-0 items-center justify-center text-muted-foreground [&_svg]:size-4"
            >
              {icon}
            </span>
          ) : null}
          <div className="grid gap-1">
            <CardTitle>{title}</CardTitle>
            {description ? (
              <CardDescription>{description}</CardDescription>
            ) : null}
          </div>
        </div>
      </CardHeader>
      {details ? (
        <CardContent data-slot="approval-card-details">{details}</CardContent>
      ) : null}
      <CardFooter className="gap-2">
        {status === "pending" ? (
          <>
            <Button variant="default" onClick={onApprove}>
              {approveLabel}
            </Button>
            <Button variant="outline" onClick={onReject}>
              {rejectLabel}
            </Button>
          </>
        ) : status === "approved" ? (
          <Badge variant="secondary">Aprovado</Badge>
        ) : (
          <Badge variant="destructive">Recusado</Badge>
        )}
      </CardFooter>
    </Card>
  )
}

export { ApprovalCard }
