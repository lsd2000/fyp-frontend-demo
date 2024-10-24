import { ContentLayout } from "@/components/admin-panel/content-layout";
import React, { useEffect, useState } from 'react';
import { Link, useParams, useLocation} from "react-router-dom";
import TopNavBar from "@/components/top-navbar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
		TableCell,
  } from "@/components/ui/table";
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { GradedQuizQuestionBreakdown, UngradedQuizQuestionBreakdown } from "../types"; 
import { fetchGradedQuizResults, updateGradedQuizComments, fetchUngradedQuizResults, updateUngradedQuizComments } from "./services/QuizResultsService";
import { fetchGradedQuizQuestionBreakdown, fetchUngradedQuizQuestionBreakdown } from "./services/QuizGraderPageServices";

const QuizGrader: React.FC = () => {
  const {courseId, quizTitle, studentName } = useParams();
	const {toast} = useToast();
  const location = useLocation();
  const { submission, graded } = location.state || {};
	//console.log(submission)

	const [comments, setComments] = useState(submission.comments);
	const handleSaveComments = async () => {
    try {
      // Call the API to update the comments
			if (graded == true) {
				await updateGradedQuizComments(String(courseId), submission.quiz_id, submission.username, comments);
			} else {
				await updateUngradedQuizComments(String(courseId), submission.quiz_id, submission.username, comments);
			}
      toast({
				title: <span className="text-green-600">Success!</span>,
				description: "Comments have been saved.", 
			})
    } catch (err) {
      console.error('Failed to save comments:', err);
			toast({
				title: <span className="text-red-600">A problem occurred.</span>,
				description: "Failed to save comments. Please try again.", 
			})
    }
  };


	const [gradedQuizQnBreakdown, setGradedQuizQnBreakdown] = useState<GradedQuizQuestionBreakdown[]>([]);
	const [ungradedQuizQnBreakdown, setUngradedQuizQnBreakdown] = useState<UngradedQuizQuestionBreakdown[]>([]);
	useEffect(() => {
    const fetchData = async () => {
			if (graded == true) {
        try {
						//fetch question breakdown
            const questionBreakdownList = await fetchGradedQuizQuestionBreakdown(String(courseId), submission.quiz_id, submission.username); // Await the promise
            setGradedQuizQnBreakdown(questionBreakdownList || []); //set state; use empty array if undefined

        } catch (error) {
            console.error("Error fetching graded quiz breakdown:", error);
        }
			} else {
				try {
					//fetch question breakdown
					const questionBreakdownList = await fetchUngradedQuizQuestionBreakdown(String(courseId), submission.quiz_id, submission.username); // Await the promise
					setUngradedQuizQnBreakdown(questionBreakdownList || []); //set state; use empty array if undefined

			} catch (error) {
					console.error("Error fetching ungraded quiz breakdown:", error);
			}
			}
    };

    fetchData();
  }, [courseId]); //Add courseId as a dependency if it can change

  return (
    <ContentLayout title={`${studentName}'s ${quizTitle} scores`}> 
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
            <BreadcrumbLink asChild>
              <Link 
								to={`/courses/${courseId}/quizzes/${quizTitle}`}
								state={{quiz: submission, graded: graded} as any}
							>
								{`${quizTitle}`.replace("_", " ")}
							</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator/>
          <BreadcrumbItem>
            <BreadcrumbPage>
             {`${quizTitle} grader`.replace("_", " ")}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <Card className="rounded-lg border-none mt-6">
        <CardContent className="p-2">
          <div className="flex flex-col w-full h-[calc(100vh-56px-64px-20px-24px-56px-48px)]">
            <TopNavBar />

            <div className="flex flex-row h-full"> 

              <div className="flex flex-col w-[70%] h-full">
								
              	{/* Question Breakdown */}
                <Card className="flex flex-col m-6 h-3/5">
                  <CardHeader>
                    <div className="flex flex-row items-center justify-between">
                      <CardTitle>Question Breakdown</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-grow overflow-hidden">
                      <Table>
                        <TableHeader className="sticky top-0 bg-background">
                          <TableRow>
                            <TableHead className="w-[50px]">No.</TableHead>
                            <TableHead className="w-[250px]">Question</TableHead>
                            <TableHead>Question Type</TableHead>
                            <TableHead>Student Answer</TableHead>
														{
														graded && 
                            <TableHead className="text-right">Score</TableHead>
														}
                          </TableRow>
                        </TableHeader>
                        <TableBody className="overflow-auto">
												{
													graded ? (
														gradedQuizQnBreakdown.map((response) => (
															<TableRow key={response.unique_key} className="cursor-pointer hover:bg-muted">
																<TableCell className="font-medium">{response.qn_num}</TableCell>
																<TableCell className="font-medium">{response.qn_text}</TableCell>
																<TableCell className="font-medium">{response.qn_type}</TableCell>
																<TableCell className="font-medium">{response.student_answer}</TableCell>
																<TableCell className="font-medium text-right whitespace-nowrap">{response.qn_score}</TableCell>
															</TableRow>
														))
													) : (
														ungradedQuizQnBreakdown.map((response) => (
															<TableRow key={response.unique_key} className="cursor-pointer hover:bg-muted">
																<TableCell className="font-medium">{response.qn_num}</TableCell>
																<TableCell className="font-medium">{response.qn_text}</TableCell>
																<TableCell className="font-medium">{response.qn_type}</TableCell>
																<TableCell className="font-medium">{response.student_answer}</TableCell>
															</TableRow>
														))
													)
												}
                        </TableBody>
                      </Table>
                  </CardContent>
                </Card>

                {/* LLM feedback */}
                <Card className="flex flex-col m-6 h-1/5">
                  <CardHeader>
                    LLM feedback
                  </CardHeader>
                </Card>

              </div>

              <div className="flex flex-col w-[30%] mt-6 mb-16">
                {/* Overall Quiz Grade */}
                <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight mt-8 ml-6">
                  Overall Quiz Grade: {submission.quiz_score}
                </h2>

                <Card className="flex flex-col mt-6 mr-4 ml-4 h-full">
                  <CardHeader>
                    <div className="flex flex-row items-center justify-between">
                      <CardTitle>Comments</CardTitle>
                      <Button>Email student</Button>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-grow">
                    <Textarea 
											placeholder="Type your comments here" 
											className="w-full h-full resize-none flex-grow mb-6" 
											value={comments}
											onChange={(e) => setComments(e.target.value)}
										/>
                    <Button onClick={handleSaveComments}>Save comments</Button>
                  </CardContent>
                </Card>
              </div>


            </div>
            

          </div>
        </CardContent>
      </Card>
    </ContentLayout>
  );
};

export default QuizGrader;
