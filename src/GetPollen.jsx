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
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Footer, FooterContent, FooterText } from "./components/ui/footer";

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
  const [searchHistory, setSearchHistory] = useState([]);

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

Assess the risk level for each pollen type (Low, Moderate, High, Very High) based on typical pollen count thresholds.

Write a detailed public health advisory that includes:

General health advice and recommendations.

Specific indoor and outdoor precautions, with extra emphasis on the pollen type that presents the highest risk.

Over-the-counter or commonly prescribed medicine recommendations for allergy relief (such as antihistamines, nasal sprays, or eye drops).

Ensure the advisory reads like an official public health notice, and avoid including any date information.
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
      setError(null);
      const response = await axios.get(CORS_PROXY + API_URL, {
        headers: {
          "x-api-key": `1522d28eff09b5f35d5d9c92efb3c74175777d1b4357ddd5e7e71818f6610e2d`,
          "Content-type": "application/json",
        },
      });
      setLoading(false);
      setPollenData(response.data);
      // Add to search history
      if (place && !searchHistory.includes(place)) {
        setSearchHistory((prev) => [place, ...prev].slice(0, 5));
      }
    } catch (error) {
      setLoading(false);
      setError("Failed to fetch pollen data. Please try again.");
      console.error("Error fetching pollen data:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (place.trim()) {
      fetchPollenData();
    }
  };

  const handleHistoryClick = (location) => {
    setPlace(location);
    fetchPollenData();
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
            backgroundColor: [
              "hsl(var(--primary))",
              "hsl(var(--secondary))",
              "hsl(var(--destructive))",
            ],
            borderColor: [
              "hsl(var(--primary))",
              "hsl(var(--secondary))",
              "hsl(var(--destructive))",
            ],
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
        labels: {
          color: "hsl(var(--foreground))",
        },
      },
      title: {
        display: true,
        text: `Pollen Count in ${place || "your area"}`,
        color: "hsl(var(--foreground))",
      },
    },
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
  };

  const getRiskLevelColor = (risk) => {
    switch (risk.toLowerCase()) {
      case "high":
        return "text-destructive";
      case "moderate":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-muted-foreground";
    }
  };

  const getRiskLevelDescription = (risk) => {
    switch (risk.toLowerCase()) {
      case "high":
        return "Consider staying indoors and taking precautions";
      case "moderate":
        return "Take basic precautions when going outside";
      case "low":
        return "Generally safe for outdoor activities";
      default:
        return "No specific precautions needed";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 max-w-4xl mx-auto p-4 space-y-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Pollen Data for {place || "your area"}
            </CardTitle>
            <CardDescription className="text-center">
              Enter a location to view detailed pollen information and health
              recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Input
                  type="text"
                  required
                  className="w-full sm:w-64"
                  placeholder="Enter location"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                />
                <Button type="submit" disabled={loading}>
                  {loading ? "Searching..." : "Find"}
                </Button>
              </div>

              {searchHistory.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="text-sm text-muted-foreground">
                    Recent searches:
                  </span>
                  {searchHistory.map((location, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleHistoryClick(location)}
                      className="text-xs"
                    >
                      {location}
                    </Button>
                  ))}
                </div>
              )}
            </form>

            {error && (
              <div className="text-center p-4 text-destructive animate-fade-in">
                <p>{error}</p>
              </div>
            )}

            {loading && (
              <div className="text-center p-4 animate-fade-in">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
                <p className="mt-2">Loading pollen data...</p>
              </div>
            )}

            {!loading &&
              pollenData &&
              pollenData.data &&
              pollenData.data.length > 0 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                      <CardHeader>
                        <CardTitle>Risk Assessment</CardTitle>
                        <CardDescription>
                          Current pollen risk levels
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {Object.entries(pollenData.data[0].Risk).map(
                            ([type, risk]) => (
                              <div
                                key={type}
                                className="flex flex-col p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors duration-200"
                              >
                                <div className="flex justify-between items-center">
                                  <span className="font-medium capitalize">
                                    {type.replace("_", " ")}
                                  </span>
                                  <span className={getRiskLevelColor(risk)}>
                                    {risk}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {getRiskLevelDescription(risk)}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow duration-300">
                      <CardHeader>
                        <CardTitle>Pollen Counts</CardTitle>
                        <CardDescription>
                          Detailed pollen measurements
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {Object.entries(pollenData.data[0].Count).map(
                            ([type, count]) => (
                              <div
                                key={type}
                                className="flex justify-between items-center p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors duration-200"
                              >
                                <span className="font-medium capitalize">
                                  {type.replace("_", " ")}
                                </span>
                                <span className="text-foreground font-semibold">
                                  {count}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle>Pollen Distribution</CardTitle>
                      <CardDescription>
                        Visual representation of pollen levels
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Bar data={getPollenChartData()} options={options} />
                    </CardContent>
                  </Card>

                  <div className="flex justify-center">
                    <Button
                      onClick={getdata}
                      className="w-full sm:w-auto hover:scale-105 transition-transform duration-200"
                      disabled={precautionLoading}
                    >
                      {precautionLoading
                        ? "Generating recommendations..."
                        : "Get Health Recommendations"}
                    </Button>
                  </div>

                  {precautionLoading && (
                    <div className="text-center p-4 animate-fade-in">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
                      <p className="mt-2">
                        Generating health recommendations...
                      </p>
                    </div>
                  )}

                  {!precautionLoading && answer && (
                    <Card className="hover:shadow-lg transition-shadow duration-300 animate-fade-in">
                      <CardHeader>
                        <CardTitle>Health Recommendations</CardTitle>
                        <CardDescription>
                          Based on current pollen levels
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="prose prose-sm max-w-none">
                          <pre className="whitespace-pre-wrap break-words text-sm">
                            {answer}
                          </pre>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Data provided by Ambee API | Last updated:{" "}
              {new Date().toLocaleDateString()}
            </p>
          </CardFooter>
        </Card>
      </div>

      <Footer className="border-t">
        <FooterContent>
          <FooterText>
            © {new Date().getFullYear()} Air Pollen Index. All rights reserved.
          </FooterText>
          <FooterText>
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>{" "}
            |{" "}
            <a href="#" className="hover:underline">
              Terms of Service
            </a>
          </FooterText>
        </FooterContent>
      </Footer>
    </div>
  );
};

export default GetPollen;
