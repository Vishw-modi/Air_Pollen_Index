import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GetPollen = () => {
  const [pollenData, setPollenData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [precautionLoading, setPrecautionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [place, setPlace] = useState("");
  const [answer, setAnswer] = useState("");

  const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
  const API_URL = `https://api.ambeedata.com/latest/pollen/by-place?place=${place}`;

  async function getdata() {
    setPrecautionLoading(true);
    try {
      const uurl =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyDAFa7yoX9aC6LxOMjdTEhtnot_ENEEvd4";
      const response = await axios({
        url: uurl,
        method: "post",
        data: {
          contents: [
            {
              parts: [
                {
                  text: `
                  Using the provided pollen count data:
Grass Pollen Count: ${pollenData.data[0].Count.grass_pollen}
Tree Pollen Count: ${pollenData.data[0].Count.tree_pollen}
Weed Pollen Count: ${pollenData.data[0].Count.weed_pollen}
Assess corresponding risk levels and write a detailed health advisory including indoor and outdoor precautions, especially for the highest pollen type. The output should resemble a public health notice.
                  `,
                },
              ],
            },
          ],
        },
      });
      let cleanText =
        response["data"]["candidates"][0]["content"]["parts"][0]["text"];
      cleanText = cleanText.replace(/[*#]/g, "");
      // console.log(pollenData.data[0].Count.weed_pollen);

      setAnswer(cleanText);
    } catch (error) {
      console.log(error);
    } finally {
      setPrecautionLoading(false);
    }
  }

  const fetchPollenData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(CORS_PROXY + API_URL, {
        headers: {
          "x-api-key": `1522d28eff09b5f35d5d9c92efb3c74175777d1b4357ddd5e7e71818f6610e2d`,
          "Content-type": "application/json",
        },
      });
      setLoading(false);
      setPollenData(response.data);
    } catch (err) {
      setLoading(false);
      setError("Failed to fetch pollen data. Try again.");
    }
  };

  useEffect(() => {
    setAnswer("");
  }, [place]);

  useEffect(() => {
    fetchPollenData();
  }, []);

  const getPollenChartData = () => {
    if (pollenData && pollenData.data && pollenData.data.length > 0) {
      const grassPollen = pollenData.data[0].Count.grass_pollen;
      const treePollen = pollenData.data[0].Count.tree_pollen;
      const weedPollen = pollenData.data[0].Count.weed_pollen;

      return {
        labels: ["Grass Pollen", "Tree Pollen", "Weed Pollen"],
        datasets: [
          {
            label: "Pollen Count",
            data: [grassPollen, treePollen, weedPollen],
            backgroundColor: ["#34D399", "#60A5FA", "#FCA5A5"],
            borderColor: ["#059669", "#2563EB", "#DC2626"],
            borderWidth: 1,
          },
        ],
      };
    }

    return {
      labels: [],
      datasets: [],
    };
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: `Pollen Count in ${place || "your area"}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-center mb-6">
        Pollen Data for {place || "your area"}
      </h2>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
        <input
          type="text"
          required
          className="p-2 border rounded-md w-full sm:w-64"
          placeholder="Enter location"
          onChange={(e) => setPlace(e.target.value)}
        />
        <button
          onClick={fetchPollenData}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Find
        </button>
      </div>

      {loading && (
        <div className="bg-gray-100 p-4 rounded-lg shadow-lg text-center opacity-90">
          <p className="text-center">Loading pollen data...</p>
        </div>
      )}
      {!loading &&
        pollenData &&
        pollenData.data &&
        pollenData.data.length > 0 && (
          <div className="bg-gray-100 p-4 rounded-lg shadow-lg text-center opacity-90">
            <h3 className="text-xl font-semibold mb-4">Risk Levels</h3>
            <ul className="list-disc pl-5 space-y-2 list-inside pl-0">
              <li>
                <strong>Grass Pollen:</strong>{" "}
                {pollenData.data[0].Risk.grass_pollen}
              </li>
              <li c>
                <strong>Tree Pollen:</strong>{" "}
                {pollenData.data[0].Risk.tree_pollen}
              </li>
              <li className="pl-[10px]">
                <strong>Weed Pollen:</strong>{" "}
                {pollenData.data[0].Risk.weed_pollen}
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-4">Pollen Counts</h3>
            <ul className="list-disc pl-5 space-y-2 list-inside ">
              <li className="pr-2">
                <strong>Grass Pollen Count:</strong>{" "}
                {pollenData.data[0].Count.grass_pollen}
              </li>
              <li className="pr-5">
                <strong>Tree Pollen Count:</strong>{" "}
                {pollenData.data[0].Count.tree_pollen}
              </li>
              <li className="pr-[2px]">
                <strong>Weed Pollen Count:</strong>{" "}
                {pollenData.data[0].Count.weed_pollen}
              </li>
            </ul>
            <div className="mt-6">
              <Bar data={getPollenChartData()} options={options} />
            </div>
            <button
              onClick={getdata}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition my-5"
            >
              Get Precautions
            </button>
            {precautionLoading && (
              <p className="text-center my-4">Loading precautions...</p>
            )}
            {!precautionLoading && answer && (
              <div className="bg-white rounded-lg shadow-md p-4 mt-6 text-left text-gray-700 leading-relaxed">
                <h4 className="font-bold text-lg mb-2">Precautions:</h4>
                <pre className="whitespace-pre-wrap break-words">{answer}</pre>
              </div>
            )}
          </div>
        )}
    </div>
  );
};

export default GetPollen;
