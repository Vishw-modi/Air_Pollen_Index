import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { Card, CardHeader, CardTitle, CardContent } from "./components/ui/card";

Chart.register(...registerables);

function displayPollenChart(chartRef) {
  if (chartRef.current) {
    chartRef.current.destroy();
  }

  const ctx = document.getElementById("pollenChart").getContext("2d");
  chartRef.current = new Chart(ctx, {
    type: "line",
    data: {
      labels: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      datasets: [
        {
          label: "Pollen Index",
          data: [10, 15, 20, 25, 18, 12, 8],
          borderColor: "hsl(var(--primary))",
          backgroundColor: "hsl(var(--primary) / 0.2)",
          fill: true,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "hsl(var(--border))",
          },
          ticks: {
            color: "hsl(var(--foreground))",
          },
        },
        x: {
          grid: {
            color: "hsl(var(--border))",
          },
          ticks: {
            color: "hsl(var(--foreground))",
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: "hsl(var(--foreground))",
          },
        },
      },
    },
  });
}

function PollenIndex() {
  const chartRef = useRef(null);

  useEffect(() => {
    displayPollenChart(chartRef);
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-2xl">Pollen Breakdown Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <canvas id="pollenChart" className="w-full"></canvas>
          </div>

          <div className="mt-6 space-y-2">
            <h2 className="font-semibold text-lg">Weekly Pollen Levels:</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 rounded-lg bg-muted">
                <p className="font-medium">Monday</p>
                <p className="text-muted-foreground">Low</p>
              </div>
              <div className="p-3 rounded-lg bg-muted">
                <p className="font-medium">Tuesday</p>
                <p className="text-muted-foreground">Moderate</p>
              </div>
              <div className="p-3 rounded-lg bg-muted">
                <p className="font-medium">Wednesday</p>
                <p className="text-muted-foreground">Moderate</p>
              </div>
              <div className="p-3 rounded-lg bg-muted">
                <p className="font-medium">Thursday</p>
                <p className="text-muted-foreground">High</p>
              </div>
              <div className="p-3 rounded-lg bg-muted">
                <p className="font-medium">Friday</p>
                <p className="text-muted-foreground">Low</p>
              </div>
              <div className="p-3 rounded-lg bg-muted">
                <p className="font-medium">Saturday</p>
                <p className="text-muted-foreground">Low</p>
              </div>
              <div className="p-3 rounded-lg bg-muted">
                <p className="font-medium">Sunday</p>
                <p className="text-muted-foreground">Low</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PollenIndex;
