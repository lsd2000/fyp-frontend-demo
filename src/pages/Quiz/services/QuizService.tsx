import axios from 'axios';
import { API_URL } from './config';
import { GradedQuiz, GradedQuizCreate } from '@/pages/types';
import { UngradedQuiz, UngradedQuizCreate } from '@/pages/types';
//----------------
//GRADED QUIZZES
//----------------

//api call to get graded quizzes
export const fetchGradedQuizzes = async (courseId : string) => {
    try {
        const response = await axios.get<GradedQuiz[]>(`${API_URL}graded_quizzes/${courseId}`);
        return response.data
    } catch (err) {
        console.error("Error fetching graded quizzes:", err);
    }
};

// API call function for creating a quiz
export const createGradedQuiz = async (quiz: GradedQuizCreate) => {
    try {
      const response = await axios.post(`${API_URL}graded_quizzes`, quiz);
      return response.data;
    } catch (error) {
      console.error("Error creating graded quiz:", error);
    }
  };

//api call to delete graded quiz
export const deleteGradedQuiz = async (courseId: string, quizId: number) => {
    try {
      const response = await axios.delete(`${API_URL}graded_quizzes/${courseId}/${quizId}`);
      return response.data; // Returns the response from the server
    } catch (error) {
      console.error('Error deleting graded quiz:', error);
    }
};


//----------------
//UNGRADED QUIZZES
//----------------

//api call to get ungraded quizzes
export const fetchUngradedQuizzes = async (courseId : string) => {
    try {
        const response = await axios.get<UngradedQuiz[]>(`${API_URL}ungraded_quizzes/${courseId}`);
        //console.log("Fetch quizzes api call launched")
        //console.log(response.data)
        return response.data
    } catch (err) {
        console.error("Error fetching ungraded quiz: ", err);
    }
};

// API call function for creating a quiz
export const createUngradedQuiz = async (quiz: UngradedQuizCreate) => {
    try {
      const response = await axios.post(`${API_URL}ungraded_quizzes`, quiz);
      //console.log("Quiz created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating ungraded quiz:", error);
    }
  };

//api call to delete graded quiz
export const deleteUngradedQuiz = async (courseId: string, quizId: number) => {
    try {
      const response = await axios.delete(`${API_URL}ungraded_quizzes/${courseId}/${quizId}`);
      return response.data; // Returns the response from the server
    } catch (error) {
      console.error('Error deleting ungraded quiz:', error);
    }
};
