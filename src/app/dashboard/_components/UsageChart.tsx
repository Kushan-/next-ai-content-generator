
"use client"
import { useSelector } from "react-redux"
import { TrendingUp } from "lucide-react"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

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
const chartData = [{ month: "january", desktop: 1260, mobile: 570 }]

const chartConfig = {
    available: {
        label: "Available",
        color: "hsl(var(--chart-1))",
    },
    used: {
        label: "Used",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;




const UsageChart = () => {



    const remainingCredit = useSelector((state) => {
        return state.history.userCreditUsage
    })

    const isSubs = useSelector((state) => {
        if (state.userSubs.plan === "free") {
            return 100000
        }
        return 10000

    })

    const chartData = [
        {
            month: "january",
            available: { remainingCredit },
            used: { isSubs },
        },
    ];

    // const totalVisitors = chartData[0].desktop + chartData[0].mobile

    return (


        <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square w-full max-w-[250px]"
        >
            <RadialBarChart
                data={chartData}
                endAngle={180}
                innerRadius={80}
                outerRadius={130}
            >
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                />
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                    <Label
                        content={({ viewBox }: any) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                return (
                                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                                        <tspan
                                            x={viewBox.cx}
                                            y={(viewBox.cy || 0) - 16}
                                            className="fill-foreground text-2xl font-bold"
                                        >
                                            {remainingCredit / isSubs}
                                        </tspan>
                                        <tspan
                                            x={viewBox.cx}
                                            y={(viewBox.cy || 0) + 4}
                                            className="fill-muted-foreground"
                                        >
                                            Credit usage
                                        </tspan>
                                    </text>
                                )
                            }
                        }}
                    />
                </PolarRadiusAxis>
                <RadialBar
                    dataKey="available"
                    stackId="a"
                    cornerRadius={5}
                    fill="var(--color-available)"
                    className="stroke-transparent stroke-2"
                />
                <RadialBar
                    dataKey="used"
                    fill="var(--color-used)"
                    stackId="a"
                    cornerRadius={5}
                    className="stroke-transparent stroke-2"
                />
            </RadialBarChart>
        </ChartContainer>

    )

}

export default UsageChart