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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {trend !== null && (
            <p className={`text-xs ${trendColor} flex items-center mt-1`}>
              <TrendIcon className="h-3 w-3 mr-1" />
              {formattedTrend}% from last month
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}