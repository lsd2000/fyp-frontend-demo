import axios from 'axios';
import { API_URL } from './config';
import { GradedQuizQuestionBreakdown, UngradedQuizQuestionBreakdown } from '@/pages/types';

export const fetchGradedQuizQuestionBreakdown = async (courseId : string, quizId: number, username: string) => {
    try {
        const response = await axios.get<GradedQuizQuestionBreakdown[]>(`${API_URL}graded_quizzes/question_breakdown/${courseId}/${quizId}/${username}`);
        //console.log("Fetch graded quiz question breakdown api call launched")
        //console.log(response.data)
        return response.data
    } catch (err) {
        console.error(err);
    }
};

export const fetchUngradedQuizQuestionBreakdown = async (courseId : string, quizId: number, username: string) => {
    try {
        const response = await axios.get<GradedQuizQuestionBreakdown[]>(`${API_URL}ungraded_quizzes/question_breakdown/${courseId}/${quizId}/${username}`);
        //console.log("Fetch graded quiz question breakdown api call launched")
        //console.log(response.data)
        return response.data
    } catch (err) {
        console.error(err);
    }
};