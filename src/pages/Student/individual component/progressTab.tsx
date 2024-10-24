import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  Scatter,
  ScatterChart,
} from "recharts";
import StudentContext from "../StudentContext";
import React, { useContext, useMemo } from "react";

const ProgressContent: React.FC = () => {
  const {
    combinedGradedQuizResults,
    combinedMetricResults,
    combinedUngradedQuizResults,
  } = useContext(StudentContext);

  const variedResults = useMemo(() => {
    return combinedGradedQuizResults.map((result, index) => ({
      ...result,
      score: result.score + index * 5, // Increasing score to simulate improvement
      mean: result.mean + (index % 2 === 0 ? 3 : -3), // Alternating pattern to simulate class average fluctuations
      std: result.std + index * 2, // Gradually increasing std deviation
      percentile_25: result.percentile_25 - index * 2, // Decreasing to simulate broadening lower quartile
      median: result.median + (index % 2 === 0 ? 2 : -2), // Small fluctuations in median
      percentile_75: result.percentile_75 + index * 3, // Increasing upper quartile
      upperStdDev: result.mean + result.std,
      lowerStdDev: result.mean - result.std
    }));
  }, [combinedGradedQuizResults]);

  console.log(variedResults);
  return (
    <div className="">
      <Card>
        <CardHeader>
          <CardTitle>Performance Progress</CardTitle>
          <CardDescription>
            Student's overall performance trend over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={variedResults}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quiz_name" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  color: "#000000",
                  backgroundColor: "#d3d3d3",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#8884d8"
                name="Student Score"
              />
              <Line
                type="monotone"
                dataKey="percentile_25"
                stroke="#82ca9d"
                name="25th Percentile"
              />
              <Line
                type="monotone"
                dataKey="median"
                stroke="#ffc658"
                name="Median"
              />
              <Line
                type="monotone"
                dataKey="percentile_75"
                stroke="#FF6347"
                name="75th Percentile"
              />
            </LineChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={variedResults.map((item, index, arr) => ({
                ...item,
                cumulativeScore: arr
                  .slice(0, index + 1)
                  .reduce((acc, curr) => acc + curr.score, 0),
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quiz_name" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  color: "#000000",
                  backgroundColor: "#d3d3d3",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="cumulativeScore"
                stroke="#8884d8"
                name="Cumulative Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressContent;
