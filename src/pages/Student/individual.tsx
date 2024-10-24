"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { useContext } from "react";
import { Link } from "react-router-dom";
import TopNavBar from "@/components/top-navbar";
import StudentAvatar from "./individual component/studentAvatar";
import FilterPopover from "./individual component/filterPopover";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Card, CardContent } from "@/components/ui/card";
import KPICard from "./individual component/KPIcards";

import PerformanceContent from "./individual component/performanceTab";
import ProgressContent from "./individual component/progressTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecommendationContent from "./individual component/recommendationTab";
import StudentContext from "./StudentContext";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Individual: React.FC = () => {
  const { courseID, student, combinedGradedQuizResults, combinedMetricResults } =
    useContext(StudentContext);

  const maxTypicalParticipation = 4;
  const averageQuizScore =
    combinedGradedQuizResults.reduce((acc, quiz) => acc + quiz.score, 0) /
    combinedGradedQuizResults.length;
  const averageClassPartScore =
    combinedMetricResults.reduce((acc, part) => acc + part.score, 0) /
    combinedMetricResults.length;
  const normalizedClassPartScore =
    (averageClassPartScore / maxTypicalParticipation) * 100;

  const overallPerformanceScore = Math.round(
    averageQuizScore * 0.6 +
      Math.min(100, Math.max(0, normalizedClassPartScore)) * 0.4
  );

  return (
    <ContentLayout title={`Students`}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={`/courses/${courseID}`}>Course {courseID}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={`/courses/${courseID}/students`}>students</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{student?.username}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="rounded-lg border-none mt-6 ">
        <CardContent className="p-2 ">
          <div className="flex justify-start items-start min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] min-w-20">
            <div className="flex flex-col  min-w-full">
              <TopNavBar />{" "}
              <div>
                {student ? (
                  <div className="container min-w-full px-4 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                      <div className="flex item-center mb-4 md:mb-0">
                        <StudentAvatar studentName={student.name} />
                        <div className="py-3">
                          <h1 className="text-3xl font-bold">{student.name}</h1>
                          <p className="text-muted-foreground">
                            Student username:{student.username}
                          </p>
                        </div>
                      </div>
                      <FilterPopover />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <KPICard
                        title="Overall Performance"
                        percentage={`${overallPerformanceScore}%`}
                        description="Combined average of quizzes and normalized class participation"
                        progressValue={overallPerformanceScore}
                        svgPath="M22 12h-4l-3 9L9 3l-3 9H2"
                      />

                      <KPICard
                        title="Average Graded Quiz Score"
                        percentage={`${Math.round(averageQuizScore)}%`}
                        description="Average score across all quizzes"
                        progressValue={averageQuizScore}
                        svgPath="M22 12h-4l-3 9L9 3l-3 9H2"
                      />

                      <KPICard
                        title="Average Class Participation Score"
                        percentage={`${normalizedClassPartScore.toFixed(2)}%`}
                        description="Normalized average score from class participation"
                        progressValue={Math.min(
                          100,
                          Math.max(1, normalizedClassPartScore)
                        )} // Ensure scores are within a logical range
                        svgPath="M22 12h-4l-3 9L9 3l-3 9H2"
                      />
                    </div>

                    <Tabs defaultValue="performance" className="w-full mb-6">
                      <TabsList className="grid w-full grid-cols-3 mb-4">
                        <TabsTrigger value="performance">
                          Performance
                        </TabsTrigger>
                        <TabsTrigger value="progress">Progress</TabsTrigger>
                        <TabsTrigger value="recommendations">
                          Recommendations
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="performance">
                        <div className="">
                          <PerformanceContent />
                        </div>
                      </TabsContent>
                      <TabsContent value="progress">
                        <ProgressContent />
                      </TabsContent>
                      <TabsContent value="recommendations">
                        <RecommendationContent />
                      </TabsContent>
                    </Tabs>
                  </div>
                ) : (
                  <div className="py-20">
                    {" "}
                    <Alert variant="destructive">
                      <ExclamationTriangleIcon className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>
                        Student does not exist
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </ContentLayout>
  );
};

export default Individual;
