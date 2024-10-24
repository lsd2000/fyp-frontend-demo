import axios from "axios";
import { Course, Slide } from "../types";

const API_URL = import.meta.env.VITE_COURSE_API_BASE_URL;

export type SlideAll = {
  slides: Slide[];
};

// Function to delete a course
export const deleteCourse = async (courseId: string) => {
  try {
    const response = await axios.delete(`${API_URL}course/delete/${courseId}`);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 404) {
        throw new Error("Course not found!"); // Handle 404 error
      } else {
        throw new Error("Error, Please try again!"); // Handle other errors
      }
    } else {
      throw new Error("Unexpected error occurred");
    }
  }
};

export const getOneCourse = async (courseId: string): Promise<Course> => {
  try {
    const response = await axios.get<Course>(`${API_URL}course/${courseId}`);
    return response.data; // Return only the data (of type Course)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 404) {
        throw new Error("Course not found!"); // Handle 404 error
      } else {
        throw new Error("Error, Please try again!"); // Handle other errors
      }
    } else {
      throw new Error("Unexpected error occurred");
    }
  }
};

// edit one course
export const editCourse = async (courseData: Course): Promise<Course> => {
  try {
    const response = await axios.patch<Course>(
      `${API_URL}course/${courseData.course_id}`,
      courseData
    );
    //console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error creating course", error);
    throw error;
  }
};

// get slides for the course
export const fetchSlidesByCourse = async (
  courseId: string
): Promise<SlideAll> => {
  try {
    const response = await axios.get<SlideAll>(
      `${API_URL}course/${courseId}/slide`
    );
    return response.data; // Return the data of type SlideAll
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 404) {
        throw new Error("Course or slides not found!"); // Handle 404 error
      } else {
        throw new Error("Error, Please try again!"); // Handle other errors
      }
    } else {
      throw new Error("Unexpected error occurred");
    }
  }
};

// Function to upload slides
export const uploadSlides = async (
  courseId: string,
  week: number,
  file: File
): Promise<Slide> => {
  try {
    const formData = new FormData();
    formData.append("week", week.toString());
    formData.append("file", file);

    const response = await axios.post<Slide>(
      `${API_URL}course/${courseId}/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data; // Return the uploaded slide info
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 404) {
        throw new Error("Course not found!"); // Handle 404 error
      } else {
        throw new Error("Error uploading slides, Please try again!"); // Handle other errors
      }
    } else {
      throw new Error("Unexpected error occurred");
    }
  }
};

// Function to delete a slide by courseId and week
export const deleteSlide = async (courseId: string, week: number) => {
  try {
    const response = await axios.delete(
      `${API_URL}course/${courseId}/slide/${week}`
    );
    return response.data; // Return the success message or data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 404) {
        throw new Error("Slide not found!"); // Handle 404 error
      } else {
        throw new Error("Error deleting slide, Please try again!"); // Handle other errors
      }
    } else {
      throw new Error("Unexpected error occurred");
    }
  }
};
