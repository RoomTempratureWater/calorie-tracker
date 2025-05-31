
"use client"

import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"
import Logs from "@/components/logs";
import { fetchWithDebounce } from "@/lib/debounce";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "Dashboard with logs and charts"
  // NOTE: aditya -> if youre working on this, use fetchWithDebounce method to call the api while chaning this dummy api call
const chartData = [
  { macro: "protien", grams: 50, fill: "var(--color-protien)" },
  { macro: "carbs", grams: 200, fill: "var(--color-carbs)" },
  { macro: "fats", grams: 187, fill: "var(--color-fats)" },
]

const chartConfig = {
  grams: {
    label: "grams",
  },
  carbs: {
    label: "carbs",
    color: "var(--chart-2)",
  },
  fats: {
    label: "fats",
    color: "var(--chart-3)",
  },
  protien: {
    label: "protien",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig

export default function AnalyticsPage() {
  return (
    <div>
    <Card className="flex flex-col justify-start bg-[var(--sidebar)] text-[var(--sidebar-foreground)]">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Donut</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="grams"
              nameKey="macro"
              innerRadius={60}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total grams for the last 6 months
        </div>
      </CardFooter>
      </Card>
      <Card>
        <Logs/>
      </Card>
    </div>
  )
}
