import axios from "axios";

const API_URL = import.meta.env.VITE_COURSE_API_BASE_URL

// Function to read all students
export const getAllCourses = async () => {
    try {
      const response = await axios.get(`${API_URL}course`);
      return response.data.courses;
    } catch (error) {
      console.error("Error fetching courses", error);
      throw error;
    }
  };

// Function to add a new course
export const createCourse = async (courseData: {
  course_id: string;
  course_name: string;
  course_ay: string;
  course_semester: number;
  course_description: string;
  course_url: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}course/add`, courseData);
    return response.data;
  } catch (error) {
    console.error("Error creating course", error);
    throw error;
  }
};
