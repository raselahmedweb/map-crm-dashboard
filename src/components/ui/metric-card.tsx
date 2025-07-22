import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  icon: LucideIcon;
  color: string;
  actionText?: string;
  onActionClick?: () => void;
}

export function MetricCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color,
  actionText = "View Details",
}: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className={`rounded-full p-3 ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold">{value}</p>
            <span
              className={`text-sm ${
                changeType === "positive" ? "text-green-500" : "text-red-500"
              }`}
            >
              {change}
            </span>
          </div>
          <Button variant="link" className="mt-2 h-auto p-0 text-sm">
            {actionText}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
