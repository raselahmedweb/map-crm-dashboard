"use client"

import { Plus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface WelcomeCardProps {
  userName: string
  userAvatar: string
  pendingApprovals: number
  leaveRequests: number
  primaryAction?: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
}

export function WelcomeCard({
  userName,
  userAvatar,
  pendingApprovals,
  leaveRequests,
  primaryAction,
  secondaryAction,
}: WelcomeCardProps) {
  return (
    <Card className="mb-6">
      <CardContent className="flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={userAvatar || "/placeholder.svg"} />
            <AvatarFallback>{userName.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">Welcome Back, {userName}</h2>
            <p className="text-muted-foreground">
              You have <span className="font-medium text-orange-500">{pendingApprovals}</span> Pending Approvals &{" "}
              <span className="font-medium text-orange-500">{leaveRequests}</span> Leave Requests
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {primaryAction && (
            <Button onClick={primaryAction.onClick}>
              <Plus className="mr-2 h-4 w-4" />
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="destructive" onClick={secondaryAction.onClick}>
              <Plus className="mr-2 h-4 w-4" />
              {secondaryAction.label}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
