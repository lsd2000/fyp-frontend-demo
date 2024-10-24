// This file will contain the course content, hence storing data from all the api calls to be used globally.

import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useMemo,
} from "react";

import { useParams } from "react-router-dom";
import { fetchStudents } from "./Student/services/studentService";
import { Student, Course, ClassPartRecommendation, GradedQuiz, GradedQuizResult } from "./types";
import { getOneCourse } from "./Course/CourseService";
import { fetchAssignments, AssignmentData } from "./Lab/AssignmentService";
import { fetchClassPart } from "./ClassParticipation/services/classPartService";
import { fetchGradedQuizzes } from "./Quiz/services/QuizService";
import { fetchAllGradedQuizResults } from "./Quiz/services/QuizResultsService";
import { fetchClassPartRecommendation } from "./ClassParticipation/services/classPartService";

interface CourseContextType {
  courseID: string;
  setCourseID: React.Dispatch<React.SetStateAction<string>>;
  studentData: Student[];
  setStudentData: React.Dispatch<React.SetStateAction<Student[]>>;
  courseData: Course | null; // Add courseData to the context
  setCourseData: React.Dispatch<React.SetStateAction<any | null>>;
  assignmentData: AssignmentData | null;
  setAssignmentData: React.Dispatch<
    React.SetStateAction<AssignmentData | null>
  >;
  //ClassPartRecommendationData: ClassPartRecommendation[];
  //setClassPartRecommendationData: React.Dispatch<React.SetStateAction<ClassPartRecommendation[]>>;
  gradedQuizData: GradedQuiz[];
  setGradedQuizData: React.Dispatch<React.SetStateAction<GradedQuiz[]>>;
  gradedQuizResultData: GradedQuizResult[];
  setGradedQuizResultData: React.Dispatch<React.SetStateAction<GradedQuizResult[]>>;
}

const CourseContext = createContext<CourseContextType>({
  courseID: "",
  setCourseID: () => {},
  studentData: [],
  setStudentData: () => {},
  courseData: null,
  setCourseData: () => {},
  assignmentData: null,
  setAssignmentData: () => {},
  //ClassPartRecommendationData: [],
  //setClassPartRecommendationData: () => {},
  gradedQuizData: [],
  setGradedQuizData: () => {},
  gradedQuizResultData: [],
  setGradedQuizResultData: () => {},
});

interface CourseProviderProps {
  children: ReactNode;
}

export const CourseProvider: React.FC<CourseProviderProps> = ({ children }) => {
  const { courseId } = useParams<{ courseId?: string }>();
  const [courseID, setCourseID] = useState<string>("");
  const [studentData, setStudentData] = useState<Student[]>([]);
  const [courseData, setCourseData] = useState<Course | null>(null);
  const [assignmentData, setAssignmentData] = useState<AssignmentData | null>(
    null
  );
  const [gradedQuizData, setGradedQuizData] = useState<GradedQuiz[]>([]);
  //const [ClassPartRecommendationData, setClassPartRecommendationData] = useState<ClassPartRecommendation[]>([]);
  const [gradedQuizResultData, setGradedQuizResultData] = useState<GradedQuizResult[]>([]);
  //   const [quizData, setQuizData] = useState([]);

  // Memoized data fetch function
  const fetchData = useCallback(async () => {
    if (courseID) {
      // Load data from your services/just add in your endpoint to call here
      const fetchedCourse = await getOneCourse(courseID);
      const fetchedStudentData = await fetchStudents(courseID);
      const fetchedAssignmentData = await fetchAssignments(courseID);
      const fetchedGradedQuizData = await fetchGradedQuizzes(courseID);
      //const fetchedClassPartRecommendationData = await fetchClassPartRecommendation(courseID);
      const fetchedGradedQuizResultData = await fetchAllGradedQuizResults(courseID);

      setCourseData(fetchedCourse);
      setStudentData(fetchedStudentData);
      setAssignmentData(fetchedAssignmentData|| null);
      setGradedQuizData(fetchedGradedQuizData || []);
      //setClassPartRecommendationData(fetchedClassPartRecommendationData || []);
      setGradedQuizResultData(fetchedGradedQuizResultData || []);
      //console.log(fetchedGradedQuizData);
    }
  }, [courseID]); // Dependencies array. all the apis will only be called when the courseID changes.

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (courseId) {
      setCourseID(courseId); // Assuming courseId is a string and required
    }
  }, [courseId]);

  const contextValue = useMemo(
    () => ({
      courseID,
      setCourseID,
      studentData,
      setStudentData,
      courseData,
      setCourseData,
      assignmentData,
      setAssignmentData,
      //ClassPartRecommendationData,
      //setClassPartRecommendationData,
      gradedQuizData,
      setGradedQuizData,
      gradedQuizResultData,
      setGradedQuizResultData,
    }),
    [
      courseID,
      studentData,
      courseData,
      assignmentData,
      //ClassPartRecommendationData,
      gradedQuizData,
      gradedQuizResultData
    ]
  );
  return (
    <CourseContext.Provider value={contextValue}>
      {children}
    </CourseContext.Provider>
  );
};

export default CourseContext;
