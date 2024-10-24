import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Link, useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState, useContext } from 'react';
import { GradedQuiz, UngradedQuiz } from "../types";

import {
  fetchGradedQuizzes, 
  deleteGradedQuiz,
	fetchUngradedQuizzes,
	deleteUngradedQuiz,
} from './services/QuizService';

import TopNavBar from "@/components/top-navbar";
import AddGradedQuizForm from "./components/AddQuizForm";
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

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@radix-ui/react-toast";


const ungraded_quizzes = [
  { quiz_id: 1, title: "Quiz 1" },
  { quiz_id: 2, title: "Quiz 2" },
];
  
const Quizzes: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate(); 
  const { toast } = useToast();
  const [gradedQuizzes, setGradedQuizzes] = useState<GradedQuiz[]>([]);
	const [ungradedQuizzes, setUngradedQuizzes] = useState<UngradedQuiz[]>([]);

  const handleGradedQuizRowClick = (courseId:string, quiz: GradedQuiz) => {
    navigate(`/courses/${courseId}/quizzes/${quiz.quiz_name}`, {state: {quiz, graded: true}});
  };

  const handleUngradedQuizRowClick = (courseId:string, quiz: UngradedQuiz) => {
    navigate(`/courses/${courseId}/quizzes/${quiz.quiz_name}`, {state: {quiz, graded: false}});
  };

  const handleDeleteGradedQuiz = async (courseId: string, quizId: number) => {
    try {
      const result = await deleteGradedQuiz(courseId, quizId);
      //console.log(result);
      setGradedQuizzes(prevGradedQuizzes => prevGradedQuizzes.filter(quiz => quiz.quiz_id !== quizId));
      toast({
        title: <span className="text-green-600">Success!</span>,
        description: "Quiz has been deleted.", 
			})
    } catch (error) {
      console.log(error)
			toast({
        title: <span className="text-red-600">A problem occurred.</span>,
        description: "Failed to delete quiz. Please try again.", 
			})
    }
  };

  const handleDeleteUngradedQuiz = async (courseId: string, quizId: number) => {
		try {
      const result = await deleteUngradedQuiz(courseId, quizId);
      //console.log(result);
      setUngradedQuizzes(prevGradedQuizzes => prevGradedQuizzes.filter(quiz => quiz.quiz_id !== quizId));
      toast({
        title: <span className="text-green-600">Success!</span>,
        description: "Quiz has been deleted.", 
			})
    } catch (error) {
      console.log(error)
			toast({
        title: <span className="text-red-600">A problem occurred.</span>,
        description: "Failed to delete quiz. Please try again.", 
			})
    }
  }

  //Use effect to call fetchGradedQuizzes and fetchUngradedQuizzes when the component mounts
  useEffect(() => {
    const fetchAndSetGradedQuizzes = async () => {
        try {
            const gradedQuizList = await fetchGradedQuizzes(String(courseId)); // Await the promise
            setGradedQuizzes(gradedQuizList || []); //set state; use empty array if undefined
        } catch (error) {
            console.error("Error fetching graded quizzes:", error);
        }
    };

		const fetchAndSetUngradedQuizzes = async () => {
			try {
				const ungradedQuizList = await fetchUngradedQuizzes(String(courseId));
				setUngradedQuizzes(ungradedQuizList || []);
			} catch (error) {
				console.error("Error fetching ungraded quizzes:", error)
			}
		}

    fetchAndSetGradedQuizzes();
		fetchAndSetUngradedQuizzes();
  }, [courseId]); //Add courseId as a dependency if it can change

  return (
    <ContentLayout title={`Quizzes`}>
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
            <BreadcrumbPage>Quizzes</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <Card className="rounded-lg border-none mt-6">
        <CardContent className="p-2">
				<div className="flex flex-col w-full h-screen"> {/* Full-screen height */}
  <TopNavBar />

  <div className="flex flex-row w-full h-full justify-between min-h-0"> {/* Parent container with height fully constrained */}
    
    {/* Graded Quizzes Card */}
    <Card className="flex flex-col m-6 w-1/2 flex-grow"> {/* Card with constrained height */}
      <CardHeader>
        <div className="flex flex-row items-center justify-between">
          <CardTitle>Graded Quizzes</CardTitle>
          <AddGradedQuizForm 
            onQuizAdded={() => fetchGradedQuizzes(String(courseId))} 
            graded={true}
          />
        </div>
      </CardHeader>

      <CardContent className="flex-grow overflow-y-auto" style={{ maxHeight: 'calc(100% - 60px)' }}> {/* Adjusted max-height */}
        <Table>
          <TableHeader className="sticky top-0 bg-background">
            <TableRow>
              <TableHead>Quiz title</TableHead>
              <TableHead>Weightage</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gradedQuizzes.map((quiz) => (
              <TableRow
                key={quiz.quiz_id}
                className="cursor-pointer hover:bg-muted"
                onClick={() => handleGradedQuizRowClick(courseId!, quiz)}
              >
                <TableCell className="font-medium">{quiz.quiz_name}</TableCell>
                <TableCell>{quiz.weightage}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteGradedQuiz(String(courseId), quiz.quiz_id); 
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    {/* Ungraded Quizzes Card */}
    <Card className="flex flex-col m-6 w-1/2 flex-grow">
      <CardHeader>
        <div className="flex flex-row items-center justify-between">
          <CardTitle>Ungraded Quizzes</CardTitle>
          <AddGradedQuizForm 
            onQuizAdded={() => fetchUngradedQuizzes(String(courseId))} 
            graded={false}
          />
        </div>
      </CardHeader>

      <CardContent className="flex-grow overflow-y-auto" style={{ maxHeight: 'calc(100% - 60px)' }}>
        <Table>
          <TableHeader className="sticky top-0 bg-background">
            <TableRow>
              <TableHead>Quiz title</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ungradedQuizzes.map((quiz) => (
              <TableRow
                key={quiz.quiz_id}
                className="cursor-pointer hover:bg-muted"
                onClick={() => handleUngradedQuizRowClick(courseId!, quiz)}
              >
                <TableCell className="font-medium">{quiz.quiz_name}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteUngradedQuiz(String(courseId), quiz.quiz_id); 
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</div>
        </CardContent>
      </Card>
    </ContentLayout>
  );
};

export default Quizzes;
