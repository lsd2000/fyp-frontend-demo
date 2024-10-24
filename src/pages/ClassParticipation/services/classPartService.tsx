import axios, { AxiosResponse } from "axios";
//import { mockStudentData } from "../studentMockData";
import { ClassPart, ClassPartRecommendation } from "@/pages/types";

const classPartApiBaseUrl = import.meta.env.VITE_CLASSPART_API_BASE_URL;

export type FilteredClassPart = {
    student_id: string;
    score: number;
    comments: string;
}

export type CreateClassPart = {
    student_id: string;
    course_id: string;
    week: string;
    score: number;
    comments: string;
}

// Function to get all classpart entries
export async function fetchClassPart(courseID: string): Promise<ClassPart[]> {
  try {
      const response: AxiosResponse<any> = await axios.get(`${classPartApiBaseUrl}classpart/course/${courseID}`);
      //console.log(response.data);
      return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
      console.log("No class part found for the course, returning minimal structure");
      return [];
    }
       console.error("Failed to fetch students:", error);
      // Simply just for development purpose
      return [];
      //throw error;
  }
}

// Function to get all classpart entries with recommendations
export async function fetchClassPartRecommendation(courseID: string): Promise<ClassPartRecommendation[]> {
  try {
      const response: AxiosResponse<any> = await axios.get(`${classPartApiBaseUrl}classpart/all_recommendations/${courseID}`);
      //console.log(response.data);
      return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
      console.log("No class part found for the course, returning minimal structure");
      return [];
    }
       console.error("Failed to fetch students:", error);
      // Simply just for development purpose
      return [];
      //throw error;
  }
}

// Function to create a classpart entry
export const createClassPart = async (
    classPartData : CreateClassPart
  ): Promise<CreateClassPart> => {
    try {
      const response = await axios.post<CreateClassPart>(`${classPartApiBaseUrl}classpart/`, classPartData);
      //console.log("Class Part Entry created:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to create student:", error);
      throw new Error("Failed to create student");
    }
  };