import React, { useContext, useEffect } from "react";

interface CardProps {
  title: string;
  percentage: string;
  description: string;
  progressValue: number;
  svgPath: string;
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import StudentContext from "../StudentContext";

const KPICard: React.FC<CardProps> = ({
  title,
  percentage,
  description,
  progressValue,
  svgPath,
}) => {

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-muted-foreground"
        >
          <path d={svgPath} />
        </svg>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{percentage}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        <Progress value={progressValue} className="mt-2" />
      </CardContent>
    </Card>
  );
};

export default KPICard;
