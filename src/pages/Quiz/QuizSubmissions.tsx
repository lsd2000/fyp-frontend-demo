import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from 'react';

import TopNavBar from "@/components/top-navbar";
import UploadQuizSubmissionsForm from "./components/UploadQuizSubmissionsForm";
import { fetchGradedQuizResults, fetchUngradedQuizResults} from "./services/QuizResultsService";  
import { GradedQuizResult, UngradedQuizResult } from "../types";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Toaster } from "@/components/ui/toaster"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    TableCell,
  } from "@/components/ui/table";

const QuizSubmissions: React.FC = () => {
  const { courseId, quizTitle } = useParams();
  const location = useLocation();
  const { quiz, graded } = location.state || {};
  //console.log(`Quiz ID: ${quiz.quiz_id}, Type: ${typeof quiz.quiz_id}`);
  const navigate = useNavigate();

  const handleRowClick = (submission : {course_id: string, quiz_id: number, quiz_score: string, student_name: string, username: string, comments? :string}, quizTitle: string) => {
    const studentName = encodeURIComponent(submission.student_name)
    navigate(`/courses/${courseId}/quizzes/${quizTitle}/student_${submission.username}/${studentName}`, {state: {submission, graded}});
  };

  //stuff to get the graded quiz results
  const [gradedQuizResults, setGradedQuizResults] = useState<GradedQuizResult[]>([]);
	const [ungradedQuizResults, setUngradedQuizResults] = useState<UngradedQuizResult[]>([]);
  useEffect(() => {
    const fetchAndSetGradedQuizzes = async () => {
        try {
            const gradedQuizResultsList = await fetchGradedQuizResults(String(courseId), quiz.quiz_id); // Await the promise
            setGradedQuizResults(gradedQuizResultsList || []); //set state; use empty array if undefined
        } catch (error) {
            console.error("Error fetching graded quizzes:", error);
        }
    };

		const fetchAndSetUngradedQuizzes = async () => {
			try {
					const ungradedQuizResultsList = await fetchUngradedQuizResults(String(courseId), quiz.quiz_id); // Await the promise
					setUngradedQuizResults(ungradedQuizResultsList || []); //set state; use empty array if undefined
			} catch (error) {
					console.error("Error fetching ungraded quizzes:", error);
			}
	};

    if (graded == true) {
			fetchAndSetGradedQuizzes();
		} else {
			fetchAndSetUngradedQuizzes();
		}
  }, [courseId]); //Add courseId as a dependency if it can change

  return (
    <ContentLayout title={String(quizTitle).replace("_", " ")}>
			<Toaster/>
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
              <Link to={`/courses/${courseId}`}>Course {courseId}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={`/courses/${courseId}/quizzes`}>Quizzes</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
             {String(quizTitle).replace("_", " ")}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <Card className="rounded-lg border-none mt-6">
        <CardContent className="p-2">
          <div className="flex flex-col w-full h-[calc(100vh-56px-64px-20px-24px-56px-48px)]">
            <TopNavBar />
            <Card className="flex flex-col m-6 h-2/5">
              <CardHeader>
                <div className="flex flex-row items-center justify-between">
                  <CardTitle>Submissions</CardTitle>
                  <UploadQuizSubmissionsForm 
                    onUpload={()=> {fetchGradedQuizResults(String(courseId), quiz.quiz_id)}}
                    quizId = {quiz.quiz_id}
										graded = {graded}
                  />
                </div>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow overflow-hidden">
                  <Table>
                    <TableHeader className="sticky top-0 bg-background">
                      <TableRow>
                        <TableHead className="w-[150px]">Student ID</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead className="text-right">Percentage Score</TableHead>
                      </TableRow>
                    </TableHeader>
										{
											graded ? (
												<TableBody className="overflow-auto">
													{gradedQuizResults.map((results) => (
														<TableRow 
															key={results.username} 
															className="cursor-pointer hover:bg-muted"
															onClick={() => handleRowClick(results, String(quizTitle))}
														>
															<TableCell className="font-medium">{results.username}</TableCell>
															<TableCell className="font-medium">{results.student_name}</TableCell>
															<TableCell className="font-medium text-right">{results.quiz_score}</TableCell>
														</TableRow>
													))}
												</TableBody>
											) : (
												<TableBody className="overflow-auto">
													{ungradedQuizResults.map((results) => (
														<TableRow 
															key={results.username} 
															className="cursor-pointer hover:bg-muted"
															onClick={() => handleRowClick(results, String(quizTitle))}
														>
															<TableCell className="font-medium">{results.username}</TableCell>
															<TableCell className="font-medium">{results.student_name}</TableCell>
															<TableCell className="font-medium text-right">{results.quiz_score}</TableCell>
														</TableRow>
													))}
												</TableBody>
											)
										}
                    
                  </Table>
              </CardContent>
            </Card>

            <Card className="flex flex-col m-6 h-2/5">
              <CardHeader>
                Performance Overview
              </CardHeader>
            </Card>



          </div>
        </CardContent>
      </Card>
    </ContentLayout>
  );
};

export default QuizSubmissions;
