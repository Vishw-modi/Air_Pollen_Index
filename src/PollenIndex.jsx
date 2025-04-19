import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

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
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: true,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
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
    <>
      <div className="min-h-screen flex justify-center items-center rounded-lg opacity-90 ">
        <div className="w-full lg:w-2/3 bg-white p-8 shadow-lg overflow-y-auto">
          <h1 className="text-3xl font-bold mb-6">Pollen Breakdown Chart</h1>
          <div>
            <div className="flex justify-center ">
              <canvas id="pollenChart"></canvas>
            </div>

            <div className="mt-6 text-left">
              <h2 className="font-bold text-lg">Info:</h2>
              <p>Monday: Low</p>
              <p>Tuesday: Moderate</p>
              <p>Wednesday: Moderate</p>
              <p>Thursday: High</p>
              <p>Friday: Low</p>
              <p>Saturday: Low</p>
              <p>Sunday: Low</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PollenIndex;
