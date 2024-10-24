export type Student = {
  courseID: string;
  name: string;
  username: string;
  email: string;
};

export type Course = {
  course_id: string;
  course_name: string;
  course_ay: string;
  course_semester: string;
  course_description: string;
  course_url: string;
};

export type Slide = {
  course_id: string;
  week: number;
  file_name: string;
  file_path: string;
};

export type ClassPartRecommendation = {
  id: number;
  student_id: string;
  course_id: string;
  week: string;
  score: number;
  comments: string;
  recommendation: string;
};

export type ClassPart = {
  id: number;
  student_id: string;
  course_id: string;
  week: string;
  score: number;
  comments: string;
};

export type GradedQuiz = {
  course_id: string;
  quiz_id: number;
  quiz_name: string;
  weightage: number;
};

export type UngradedQuiz = {
    course_id: string;
    quiz_id: number;
    quiz_name: string;
}

export type GradedQuizCreate = {
  course_id: string;
  quiz_name: string;
  weightage: number;
};

export type UngradedQuizCreate = {
    course_id: string;
    quiz_name: string;
}

export type GradedQuizResult = {
    course_id: string;
    quiz_id: number;
    username: string;
    student_name: string;
    quiz_score: string;
    comments?: string;
    recommendation?: string;
}

export type UngradedQuizResult = {
    course_id: string;
    quiz_id: number;
    username: string;
    student_name: string;
    quiz_score: string;
    comments?: string;
}
  
export type GradedQuizQuestionBreakdown = {
    unique_key: string;
    qn_num: number
    qn_type: string
    qn_text: string
    student_answer: string
    qn_score: string
}

export type UngradedQuizQuestionBreakdown = {
    unique_key: string;
    qn_num: number
    qn_type: string
    qn_text: string
    student_answer: string
}

export type SingleStudentUngradedQuizResults = {
  quiz_name: string;
  quiz_id: number;
  score: string;
};

export type SingleStudentGradedQuizResults = {
  quiz_name: string;
  quiz_id: number;
  score: string;
};

export type ClassPartMetrics = {
  week: string;
  mean: number;
  min: number;
  max: number;
  std: number;
  count: number;
  percentile_25: number;
  median: number;
  percentile_75: number;
};

export type ClassPartResults = {
  week: string;
  score: number;
  comments: string;
  recommendation: string;
};

export type QuizStats = {
  course_id: string;
  quiz_id: number;
  mean: number;
  min: number;
  max: number;
  std: number;
  count: number;
  percentile_25: number;
  median: number;
  percentile_75: number;
};

export type CombinedQuizResultWithStats = {
  quiz_name: string;
  score: number;
  mean: number;
  min: number;
  max: number;
  std: number;
  count: number;
  percentile_25: number;
  median: number;
  percentile_75: number;
};

export type CombinedClassPartData = {
  week: string;
  score: number;
  comments: string;
  recommendation: string;
  mean: number;
  min: number;
  max: number;
  std: number;
  count: number;
  percentile_25: number;
  median: number;
  percentile_75: number;
};
