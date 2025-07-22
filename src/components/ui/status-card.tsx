import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatusItem {
  label: string;
  value: number;
  color: string;
  percentage: number;
}

interface StatusCardProps {
  title: string;
  totalLabel: string;
  totalValue: number;
  badgeText: string;
  items: StatusItem[];
  progressHeight?: string;
  showChart?: boolean;
}

export function StatusCard({
  title,
  totalLabel,
  totalValue,
  badgeText,
  items,
  progressHeight = "h-5",
}: StatusCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Badge variant="outline">{badgeText}</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">{totalLabel}</p>
            <p className="text-3xl font-bold">{totalValue}</p>
          </div>
          <div className="space-y-3">
            <div
              className={`flex ${progressHeight} overflow-hidden rounded-full bg-muted`}
            >
              {items.map((item, index) => (
                <div
                  key={index}
                  className={item.color}
                  style={{ width: `${item.percentage}%` }}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {items.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${item.color}`} />
                    <span>
                      {item.label} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="text-2xl font-bold">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
