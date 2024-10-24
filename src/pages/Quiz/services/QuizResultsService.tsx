import axios from 'axios';
import { API_URL } from './config';
import { GradedQuizResult, UngradedQuizResult } from '@/pages/types';

//----------------
//GRADED QUIZ
//----------------
export const fetchAllGradedQuizResults = async (courseId : string) => {
    try {
        const response = await axios.get<GradedQuizResult[]>(`${API_URL}graded_quiz_results/${courseId}`);
        //console.log("Fetch quiz results api call launched")
        //console.log(response.data)
        return response.data
    } catch (err) {
        console.error("Error fetching all graded quiz results", err);
    }
};
//api call to get all graded quiz results by course id and quiz id
export const fetchGradedQuizResults = async (courseId : string, quizId: number) => {
    try {
        const response = await axios.get<GradedQuizResult[]>(`${API_URL}graded_quiz_results/${courseId}/${quizId}`);
        //console.log("Fetch quiz results api call launched")
        //console.log(response.data)
        return response.data
    } catch (err) {
        console.error("Error fetching graded quiz results", err);
    }
};

//api call to upload comments
export const updateGradedQuizComments = async (courseId: string, quizId: number, username: string, comments: string) => {
    try {
        const response = await axios.patch(`${API_URL}graded_quiz_results/${courseId}/${quizId}/${username}`, {
            comments, // The new comments field to update
        });
        //console.log("Update quiz result comments API call launched");
        //console.log(response.data);
        return response.data;
    } catch (err) {
        console.error("Error updating graded quiz result comments:", err);
    }
};

//----------------
//UNGRADED QUIZ
//----------------
//api call to get all ungraded quiz results by course id and quiz id
export const fetchUngradedQuizResults = async (courseId : string, quizId: number) => {
    try {
        const response = await axios.get<UngradedQuizResult[]>(`${API_URL}ungraded_quiz_results/${courseId}/${quizId}`);
        //console.log("Fetch quiz results api call launched")
        //console.log(response.data)
        return response.data
    } catch (err) {
        console.error("Error fetching ungraded quiz results", err);
    }
};

//api call to upload comments
export const updateUngradedQuizComments = async (courseId: string, quizId: number, username: string, comments: string) => {
    try {
        const response = await axios.patch(`${API_URL}ungraded_quiz_results/${courseId}/${quizId}/${username}`, {
            comments, // The new comments field to update
        });
        //console.log("Update quiz result comments API call launched");
        //console.log(response.data);
        return response.data;
    } catch (err) {
        console.error("Error updating ungraded quiz result comments:", err);
    }
};