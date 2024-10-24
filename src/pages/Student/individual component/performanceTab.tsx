import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import React, { useContext, useMemo,} from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StudentContext from "../StudentContext";

const PerformanceContent: React.FC = () => {
  const {
    combinedGradedQuizResults,
    combinedMetricResults,
    combinedUngradedQuizResults,
  } = useContext(StudentContext);

  const radarData = useMemo(() => {
    // Normalizing individual quiz performance
    const gradedQuizData = combinedGradedQuizResults.map((quiz) => ({
      subject: quiz.quiz_name,
      NormalizedScore: (quiz.score / quiz.max) * 100, // Normalize by the max score
      NormalizedMean: (quiz.mean / quiz.max) * 100, // Normalize the mean as well
    }));

    const totalUngradedScore = combinedUngradedQuizResults.reduce(
      (acc, quiz) => acc + quiz.score,
      0
    );
    const totalUngradedMax = combinedUngradedQuizResults.reduce(
      (acc, quiz) => acc + quiz.max,
      0
    );
    const totalUngradedMean = combinedUngradedQuizResults.reduce(
      (acc, quiz) => acc + quiz.mean,
      0
    );

    const ungradedQuizData = {
      subject: "Ungraded Quizzes Total",
      NormalizedScore: (totalUngradedScore / totalUngradedMax) * 100,
      NormalizedMean: (totalUngradedMean / totalUngradedMax) * 100,
    };

    let result = [...gradedQuizData, ungradedQuizData];

    // If combinedMetricResults is not empty, add class participation data
    if (combinedMetricResults.length > 0) {
      const totalMaxScore = combinedMetricResults.reduce(
        (acc, curr) => acc + curr.max,
        0
      );

      const classPartAggregated = {
        subject: "Class Participation",
        NormalizedScore:
          (combinedMetricResults.reduce((acc, curr) => acc + curr.score, 0) /
            totalMaxScore) *
          100,
        NormalizedMean:
          (combinedMetricResults.reduce((acc, curr) => acc + curr.mean, 0) /
            totalMaxScore) *
          100,
      };

      result = [...result, classPartAggregated];
    }

    return result;
  }, [combinedGradedQuizResults, combinedMetricResults]);

  //console.log("RADAR DATA:", radarData);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Graded Quiz Score and Average</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={combinedGradedQuizResults}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quiz_name" tick={{ fontSize: "14px" }} />
              <YAxis />
              <Tooltip
                contentStyle={{
                  color: "#000000",
                  backgroundColor: "#d3d3d3", 
                }}
              />
              <Legend />
              <Bar
                dataKey="score"
                fill="hsl(var(--primary))"
                name="Student Score"
              />
              <Bar
                dataKey="mean"
                fill="hsl(var(--secondary))"
                name="Class Average"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Ungraded Quiz Score and Average</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={combinedUngradedQuizResults}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quiz_name" tick={{ fontSize: "14px" }} />
              <YAxis />
              <Tooltip
                contentStyle={{
                  color: "#000000",
                  backgroundColor: "#d3d3d3", 
                }}
              />
              <Legend />
              <Bar
                dataKey="score"
                fill="hsl(var(--primary))"
                name="Student Score"
              />
              <Bar
                dataKey="mean"
                fill="hsl(var(--secondary))"
                name="Class Average"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Class Participation Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
          <LineChart data={combinedMetricResults}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" />
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
          stroke="hsl(var(--primary))"
          name="Student Score"
          activeDot={{ r: 8 }}
        />
        <Line
          type="monotone"
          dataKey="mean"
          stroke="#FF7F7F"
          name="Class Average"
        />
      </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Overall Subject Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" tick={{}} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="Normalized Score"
                dataKey="NormalizedScore"
                stroke="#FF7F7F"
                fill="#FF7F7F"
                fillOpacity={0.6}
              />
              <Radar
                name="Normalized Mean"
                dataKey="NormalizedMean"
                stroke="#add8e6"
                fill="#add8e6"
                fillOpacity={0.6}
              />
              <Tooltip
                contentStyle={{
                  color: "#000000",
                  backgroundColor: "#FFFFFF", // Light background for contrast
                }}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceContent;
