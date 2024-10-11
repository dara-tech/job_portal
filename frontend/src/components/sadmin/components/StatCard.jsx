import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export function StatCard({ title, value, icon: Icon, trend }) {
  const formattedTrend = trend !== null ? Math.abs(trend).toFixed(2) : null;
  const trendColor = trend > 0 ? "text-green-500" : "text-red-500";
  const TrendIcon = trend > 0 ? ArrowUpRight : ArrowDownRight;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="p-2 bg-primary/10 rounded-full">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline space-x-2">
            <div className="text-3xl font-bold">{value}</div>
            {trend !== null && (
              <div className={`text-sm ${trendColor} flex items-center`}>
                <TrendIcon className="h-4 w-4 mr-1" />
                <span>{formattedTrend}%</span>
              </div>
            )}
          </div>
          {trend !== null && (
            <p className="text-xs text-muted-foreground mt-1">
              from last month
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}