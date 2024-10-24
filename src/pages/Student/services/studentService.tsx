import axios, { AxiosResponse } from "axios";
import { mockStudentData } from "../studentMockData";
import {
  Student,
  SingleStudentUngradedQuizResults,
  SingleStudentGradedQuizResults,
  ClassPartMetrics,
  QuizStats,
  ClassPartResults,
} from "@/pages/types";

const studentApiBaseUrl = import.meta.env.VITE_STUDENT_API_BASE_URL;
const quizApiBaseUrl = import.meta.env.VITE_QUIZ_API_BASE_URL;
const cpApiBaseUrl = import.meta.env.VITE_CLASSPART_API_BASE_URL;

// Function to read all students
export async function fetchStudents(courseID: string): Promise<Student[]> {
  try {
    const response: AxiosResponse<Student[]> = await axios.get(
      `${studentApiBaseUrl}students/${courseID}`
    );
    // console.log("Students fetched:", response.data);
    return response.data;
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response &&
      error.response.status === 404
    ) {
      console.log(
        "No students found for the course, returning minimal structure"
      );
      return [];
    }
    console.error("Failed to fetch students:", error);
    // Simply just for development purpose
    return mockStudentData;
    //throw error;
  }
}

// Function to create a student
export const createStudent = async (studentData: Student): Promise<Student> => {
  try {
    const response = await axios.post<Student>(
      `${studentApiBaseUrl}students/${studentData.courseID}`,
      studentData
    );
    //console.log("Student created:", response.data);
    return response.data; // Return the created student data
  } catch (error) {
    console.error("Failed to create student:", error);
    throw new Error("Failed to create student");
  }
};

// Function to update a student
export const updateStudent = async (
  studentData: Student,
  originalUsername: string
): Promise<Student> => {
  try {
    // Use originalUsername for the URL, which is assumed to be constant during this operation
    const response = await axios.put<Student>(
      `${studentApiBaseUrl}students/${studentData.courseID}/${originalUsername}`,
      studentData
    );
    //console.log("Student updated:", response.data);
    return response.data; // Return the updated student data
  } catch (error) {
    console.error("Failed to edit student:", error);
    throw new Error("Failed to edit student");
  }
};

export const deleteStudent = async (studentData: Student): Promise<Student> => {
  try {
    // Ensuring axios is set to handle the data correctly with the config parameter if needed
    const response = await axios.delete<Student>(
      `${studentApiBaseUrl}students/${studentData.courseID}/${studentData.username}`,
      {
        data: studentData,
      }
    );
    //console.log("Student deleted:", response.data);
    return response.data; // Return the deleted student data
  } catch (error) {
    console.error("Failed to delete student:", error);
    throw new Error("Failed to delete student");
  }
};

export const uploadCSV = async (
  courseID: string,
  file: File
): Promise<Student[]> => {
  const formData = new FormData();
  formData.append("file", file); // Add file to FormData

  try {
    const response = await axios.post(
      `${studentApiBaseUrl}students/${courseID}/upload-csv`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure correct content type
        },
      }
    );

    //console.log("CSV file uploaded:", response.data);

    // Check if the API response contains students and handle appropriately
    if (response.data.students && response.data.students.length > 0) {
      return response.data.students; // Return only the array of successfully inserted students
    } else {
      console.error("No students were successfully imported.");
      throw new Error("No students were successfully imported.");
    }
  } catch (error) {
    console.error("Failed to upload CSV file:", error);
    throw new Error("Failed to upload CSV file");
  }
};

export const fetchSingleStudentGradedQuizResults = async (
  courseID: string,
  studentUsername: string
): Promise<SingleStudentGradedQuizResults[]> => {
  try {
    const response: AxiosResponse<SingleStudentGradedQuizResults[]> =
      await axios.get(
        `${quizApiBaseUrl}graded_quiz_results/per_student/${courseID}/${studentUsername}`
      );
    // console.log("Students fetched:", response.data);
    return response.data;
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response &&
      error.response.status === 404
    ) {
      console.log("Unable to retrieve student results");
      return [];
    }
    console.error("Failed to fetch student results:", error);
    // Simply just for development purpose
    return [];
    //throw error;
  }
};

export const fetchUngradedQuizResults = async (
  courseID: string,
  studentUsername: string
): Promise<SingleStudentUngradedQuizResults[]> => {
  try {
    const response: AxiosResponse<SingleStudentUngradedQuizResults[]> =
      await axios.get(
        `${quizApiBaseUrl}ungraded_quiz_results/per_student/${courseID}/${studentUsername}`
      );
    // console.log("Students fetched:", response.data);
    return response.data;
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response &&
      error.response.status === 404
    ) {
      console.log("Unable to retrieve student results");
      return [];
    }
    console.error("Failed to fetch student results:", error);
    // Simply just for development purpose
    return [];
    //throw error;
  }
};

export const fetchGradedQuizResultsMetricsByCourse = async (
  courseID: string
): Promise<QuizStats[]> => {
  try {
    const response: AxiosResponse<QuizStats[]> = await axios.get(
      `${quizApiBaseUrl}graded_quiz_statistics/${courseID}`
    );
    // console.log("Students fetched:", response.data);
    return response.data;
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response &&
      error.response.status === 404
    ) {
      console.log("Unable to retrieve course statistic results");
      return [];
    }
    console.error("Failed to retrieve course statistic results:", error);
    // Simply just for development purpose
    return [];
    //throw error;
  }
};

export const fetchUnGradedQuizResultsMetricsByCourse = async (
  courseID: string
): Promise<QuizStats[]> => {
  try {
    const response: AxiosResponse<QuizStats[]> = await axios.get(
      `${quizApiBaseUrl}ungraded_quiz_statistics/${courseID}`
    );
    // console.log("Students fetched:", response.data);
    return response.data;
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response &&
      error.response.status === 404
    ) {
      console.log("Unable to retrieve course statistic results");
      return [];
    }
    console.error("Failed to retrieve course statistic results:", error);
    // Simply just for development purpose
    return [];
    //throw error;
  }
};

export const fetchClassPartResults = async (
  courseID: string,
  studentUsername: string
): Promise<ClassPartMetrics[]> => {
  try {
    const response: AxiosResponse<ClassPartMetrics[]> = await axios.get(
      `${cpApiBaseUrl}classpart/studentdata/${courseID}/${studentUsername}`
    );
    // console.log("Students fetched:", response.data);
    return response.data;
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response &&
      error.response.status === 404
    ) {
      console.log("Unable to retrieve student class part results");
      return [];
    }
    console.error("Failed to fetch student results:", error);
    // Simply just for development purpose
    return [];
    //throw error;
  }
};

export const fetchClassPartMetrics = async (
  courseID: string
): Promise<ClassPartResults[]> => {
  try {
    const response: AxiosResponse<ClassPartResults[]> = await axios.get(
      `${cpApiBaseUrl}classpart/statistics/${courseID}`
    );
    // console.log("Students fetched:", response.data);
    return response.data;
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response &&
      error.response.status === 404
    ) {
      console.log("Unable to retrieve student class part results");
      return [];
    }
    console.error("Failed to fetch student results:", error);
    // Simply just for development purpose
    return [];
    //throw error;
  }
};

// Define a generic type for request functions that return a promise of any type
export async function fetchBatchRequests<T>(requests: (() => Promise<T>)[]): Promise<(T | null)[]> {
  try {
    const results = await Promise.all(requests.map(request => request()));
    return results;
  } catch (error) {
    console.error("Error during batch requests:", error);
    // Return an array of nulls with the same length as the requests array
    return Array(requests.length).fill(null);
  }
}

