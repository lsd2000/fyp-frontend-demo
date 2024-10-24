import axios from 'axios';
import { API_URL } from './config';
//api call to upload quiz submissions

export const uploadGradedSubmissions = async (data : FormData, courseId: string, quizId: number) => {

    try {
        const response = await axios.post(`${API_URL}graded_quizzes/upload/${courseId}/${quizId}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const uploadUngradedSubmissions = async (data : FormData, courseId: string, quizId: number) => {

    try {
        const response = await axios.post(`${API_URL}ungraded_quizzes/upload/${courseId}/${quizId}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};