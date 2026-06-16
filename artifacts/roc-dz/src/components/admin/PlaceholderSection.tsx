import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface PlaceholderSectionProps {
  title: string;
  icon: LucideIcon;
  message?: string;
}

export function PlaceholderSection({ title, icon: Icon, message }: PlaceholderSectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight text-foreground">{title}</h2>
      <Card className="bg-card/50 border-border/50">
        <CardContent className="flex flex-col items-center justify-center py-24 text-center">
          <Icon className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
          <p className="text-muted-foreground max-w-sm">
            {message || `${title} module is currently under development and will be available soon.`}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
