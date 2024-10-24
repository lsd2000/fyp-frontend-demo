// This file will contain the student content, hence storing data from all the student api calls to be used at the dashboard page only

import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useMemo,
  useContext,
} from "react";

import CourseContext from "../CourseContext";
import { useParams } from "react-router-dom";
import {
  SingleStudentGradedQuizResults,
  SingleStudentUngradedQuizResults,
  ClassPartMetrics,
  Student,
  QuizStats,
  ClassPartResults,
  CombinedQuizResultWithStats,
  CombinedClassPartData,
} from "../types";

import {
  fetchSingleStudentGradedQuizResults,
  fetchUngradedQuizResults,
  fetchUnGradedQuizResultsMetricsByCourse,
  fetchGradedQuizResultsMetricsByCourse,
  fetchClassPartResults,
  fetchClassPartMetrics,
  fetchBatchRequests,
} from "./services/studentService";

interface StudentContextType {
  courseID: string;
  student: Student | null;
  setStudent: React.Dispatch<React.SetStateAction<Student | null>>;
  quizResults: SingleStudentGradedQuizResults[];
  setQuizResults: React.Dispatch<
    React.SetStateAction<SingleStudentGradedQuizResults[]>
  >;
  ungradedQuizResults: SingleStudentUngradedQuizResults[];
  setUngradedQuizResults: React.Dispatch<
    React.SetStateAction<SingleStudentUngradedQuizResults[]>
  >;
  combinedGradedQuizResults: CombinedQuizResultWithStats[];
  setCombinedGradedQuizResults: React.Dispatch<
    React.SetStateAction<CombinedQuizResultWithStats[]>
  >;
  combinedUngradedQuizResults: CombinedQuizResultWithStats[];
  setCombinedUngradedQuizResults: React.Dispatch<
    React.SetStateAction<CombinedQuizResultWithStats[]>
  >;
  classPartMetrics: ClassPartMetrics[];
  setClassPartMetrics: React.Dispatch<React.SetStateAction<ClassPartMetrics[]>>;
  gradedQuizMetrics: QuizStats[];
  setGradedQuizMetrics: React.Dispatch<React.SetStateAction<QuizStats[]>>;
  ungradedQuizMetrics: QuizStats[];
  setUngradedQuizMetrics: React.Dispatch<React.SetStateAction<QuizStats[]>>;
  classPartResults: ClassPartResults[];
  setClassPartResults: React.Dispatch<React.SetStateAction<ClassPartResults[]>>;
  combinedMetricResults: CombinedClassPartData[];
  setCombinedMetricResults: React.Dispatch<
    React.SetStateAction<CombinedClassPartData[]>
  >; 
}

const StudentContext = createContext<StudentContextType>({
  courseID: "",
  student: null,
  setStudent: () => {},
  quizResults: [],
  setQuizResults: () => {},
  ungradedQuizResults: [],
  setUngradedQuizResults: () => {},
  combinedGradedQuizResults: [],
  setCombinedGradedQuizResults: () => {},
  combinedUngradedQuizResults: [],
  setCombinedUngradedQuizResults: () => {},
  classPartMetrics: [],
  setClassPartMetrics: () => {},
  gradedQuizMetrics: [],
  setGradedQuizMetrics: () => {},
  ungradedQuizMetrics: [],
  setUngradedQuizMetrics: () => {},
  classPartResults: [],
  setClassPartResults: () => {},
  combinedMetricResults: [],
  setCombinedMetricResults: () => {},
});

interface StudentProviderProps {
  children: ReactNode;
}

export const StudentProvider: React.FC<StudentProviderProps> = ({
  children,
}) => {
  const { username } = useParams();
  const { courseID, studentData } = useContext(CourseContext);
  const [student, setStudent] = useState<Student | null>(null);
  const [quizResults, setQuizResults] = useState<
    SingleStudentGradedQuizResults[]
  >([]);
  const [ungradedQuizResults, setUngradedQuizResults] = useState<
    SingleStudentUngradedQuizResults[]
  >([]);
  const [gradedQuizMetrics, setGradedQuizMetrics] = useState<QuizStats[]>([]);
  const [ungradedQuizMetrics, setUngradedQuizMetrics] = useState<QuizStats[]>(
    []
  );
  const [combinedGradedQuizResults, setCombinedGradedQuizResults] = useState<
    CombinedQuizResultWithStats[]
  >([]);
  const [combinedUngradedQuizResults, setCombinedUngradedQuizResults] = useState<
    CombinedQuizResultWithStats[]
  >([]);
  const [classPartResults, setClassPartResults] = useState<ClassPartResults[]>(
    []
  );
  const [classPartMetrics, setClassPartMetrics] = useState<ClassPartMetrics[]>(
    []
  );
  const [combinedMetricResults, setCombinedMetricResults] = useState<
    CombinedClassPartData[]
  >([]);

  // Memoized data fetch function
  const fetchData = useCallback(async () => {
    if (courseID && student) {
      const requests: (() => Promise<any>)[] = [
        // Use 'any' to generalize the return types.
        () => fetchSingleStudentGradedQuizResults(courseID, student.username),
        () => fetchUngradedQuizResults(courseID, student.username),
        () => fetchGradedQuizResultsMetricsByCourse(courseID),
        () => fetchUnGradedQuizResultsMetricsByCourse(courseID),
        () => fetchClassPartResults(courseID, student.username),
        () => fetchClassPartMetrics(courseID),
      ];

      const results = await fetchBatchRequests(requests);
      const [
        gradedQuizResults,
        ungradedQuizResults,
        gradedQuizMetrics,
        ungradedQuizMetrics,
        classPartResults,
        classPartMetrics,
      ] = results;

      /*console.log("graded quiz results:", gradedQuizResults);
      console.log("ungraded quiz results:", ungradedQuizResults);
      console.log("graded quiz metrics:", gradedQuizMetrics);
      console.log("ungraded quiz metrics:", ungradedQuizMetrics);
      console.log("cp results:", classPartResults);
      console.log("cp metrics:", classPartMetrics);*/

      setQuizResults(gradedQuizResults || []);
      setUngradedQuizResults(ungradedQuizResults || []);
      setGradedQuizMetrics(gradedQuizMetrics || []);
      setUngradedQuizMetrics(ungradedQuizMetrics || []);
      setClassPartMetrics(classPartMetrics || []);
      setClassPartResults(classPartResults || []);

      // Combine graded quiz results with stats
      const combinedGradedResults = gradedQuizResults
        .map((result: SingleStudentGradedQuizResults) => {
          const stats: QuizStats | undefined = gradedQuizMetrics.find(
            (stats: QuizStats) => stats.quiz_id === result.quiz_id
          );
          return {
            quiz_name: result.quiz_name,
            score: parseFloat(result.score), // Parse score to a float
            ...stats,
          } as CombinedQuizResultWithStats;
        })
        .filter((item: CombinedQuizResultWithStats) => item.mean !== undefined); // Ensure that only results with stats are included

      // Combine ungraded quiz results with stats
      const combinedUngradedResults = ungradedQuizResults
        .map((result: SingleStudentUngradedQuizResults) => {
          const stats: QuizStats | undefined = ungradedQuizMetrics.find(
            (stats: QuizStats) => stats.quiz_id === result.quiz_id
          );
          return {
            quiz_name: `${result.quiz_name} (ungraded)`,
            score: parseFloat(result.score), // Parse score to a float
            ...stats,
          } as CombinedQuizResultWithStats;
        })
        .filter((item: CombinedQuizResultWithStats) => item.mean !== undefined); // Same as above

      setCombinedGradedQuizResults(combinedGradedResults);
      setCombinedUngradedQuizResults(combinedUngradedResults);

      const combinedClassPartData = classPartResults
      .map((result: ClassPartResults) => {
        const metrics: ClassPartMetrics | undefined = classPartMetrics.find(
          (metric: ClassPartMetrics) => metric.week === result.week
        );
        return {
          ...result,
          ...metrics,
        } as CombinedClassPartData;
      })
      .sort((a: CombinedClassPartData, b: CombinedClassPartData) => {
        // Extracting the numerical part from the week descriptor
        const weekNumberA = parseInt(a.week.replace('Week ', ''));
        const weekNumberB = parseInt(b.week.replace('Week ', ''));
        return weekNumberA - weekNumberB;
      });
    

      setCombinedMetricResults(combinedClassPartData);
      //console.log("cp data!!!:", combinedClassPartData)
    }
  }, [courseID, student]); // Dependencies array. all the apis will only be called when the courseID or student changes.

  useEffect(() => {
    if (username && studentData.length > 0) {
      // Ensure studentData is not empty
      const foundStudent = studentData.find((s) => s.username === username);
      //console.log("check found student", foundStudent);
      setStudent(foundStudent ?? null); // If foundStudent is undefined, set it to null
    }
  }, [username, studentData]);

  useEffect(() => {
    if (courseID && student) {
      fetchData();
    }
  }, [courseID, student, fetchData]);

  const contextValue = useMemo(
    () => ({
      courseID,
      student,
      setStudent,
      quizResults,
      setQuizResults,
      ungradedQuizResults,
      setUngradedQuizResults,
      setCombinedUngradedQuizResults,
      setCombinedGradedQuizResults,
      classPartMetrics,
      setClassPartMetrics,
      gradedQuizMetrics, // Add these to your context value so they can be accessed from the context
      setGradedQuizMetrics,
      ungradedQuizMetrics,
      setUngradedQuizMetrics,
      classPartResults,
      setClassPartResults,
      combinedGradedQuizResults,
      combinedUngradedQuizResults,
      combinedMetricResults,
      setCombinedMetricResults,
    }),
    [
      courseID,
      student,
      quizResults,
      ungradedQuizResults,
      classPartMetrics,
      gradedQuizMetrics,
      ungradedQuizMetrics,
      classPartResults,
      combinedGradedQuizResults,
      combinedUngradedQuizResults,
      combinedMetricResults,
    ]
  );

  return (
    <StudentContext.Provider value={contextValue}>
      {children}
    </StudentContext.Provider>
  );
};

export default StudentContext;
