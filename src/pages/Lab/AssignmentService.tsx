import axios from "axios";

export interface Submission {
    course_id: string;
    assignment_id: number;
    student_username: string;
    file_path: string | null;
    content: string | null;
    file_reco: string | null;
    text_reco: string | null;
}

export interface SubmissionAccepted {
    message: string;
    submission_details: Submission
}

export interface SubmissionData {
    submission_type: string | null;
    submission_count: number;
    submissions: Submission[];
}

export interface Assignment {
    course_id: string;
    assignment_id: number;
    file_path: string;
    file_ext: string | null;
    context: string | null;
    submission_count: number;
    submissions: Submission[]
}
export interface AssignmentData {
    assignment_count: number;
    assignments: Assignment[]
}

export interface Student {
    courseID: string;
    username: string;
    name: string;
    email: string;
}

export interface ErrorResponse {
    status_code: number;
    detail: string
}

const api = axios.create({
    baseURL: import.meta.env.VITE_ASSIGNMENT_API_BASE_URL,
    timeout: 10000, // 10 seconds
});


// API Call to fetch assignment data
export async function fetchAssignments(course_id: string | any) {
    const response = await api.get<AssignmentData>(`assignments/${course_id}`, {
        validateStatus(status) {
            return status < 500; // Resolve only if the status code is less than 500
        },
    })

    if (response.status == 404) {
        return { assignment_count: 0, assignments: [] }
    } else {
        return response.data
    }
}

// API Call to save an assignment in database
export function postAssignment(course_id: string | undefined, assignment_id: number, file_type: string | null, fileData: any) {
    const body = {
        "course_id": course_id,
        "assignment_id": assignment_id,
        "file_ext": file_type,
        "context": null,
        "file_path": null
    }
    var bodyFormData = new FormData()
    bodyFormData.append("body", JSON.stringify(body))
    bodyFormData.append("file", fileData)

    return api.post(`assignments`, bodyFormData)
};

// API Call to delete an assignment from database
export async function deleteAssignment(course_id: string | undefined, assignment_id: number) {
    try {
        return await api.delete(`assignments/${course_id}/${assignment_id}`);
    } catch (error) {
        console.error(error);
        return undefined;
    }
};

// API Call to retrieve submissions given course id and assignment id
export function getSubmissions(course_id: string | undefined, assignment_id: number) {
    const params = new URLSearchParams();
    if (course_id) params.append("course_id", course_id);
    if (assignment_id) params.append("assignment_id", String(assignment_id));

    return api.get<SubmissionData>(`submissions?${params.toString()}`);

}

// API Call to post a submission
export function postSubmission(course_id: string | undefined, assignment_id: number, student_username: string, content: string | null, fileData: any) {
    const submission_details = {
        "course_id": course_id,
        "assignment_id": assignment_id,
        "student_username": student_username,
        "content": content
    }
    var bodyFormData = new FormData();
    bodyFormData.append("submission_details", JSON.stringify(submission_details));
    if (fileData) {
        bodyFormData.append("file", fileData);
    }

    return api.post<SubmissionAccepted>(`submissions?resubmit=true`, bodyFormData)
}

// API Call to patch a submission
export function patchSubmission(submission: Submission) {
    return api.patch<SubmissionAccepted>(`submissions`, submission)
}

// Util function to get new assignment id
export function getAssignmentId(assignmentData: AssignmentData | null) {
    if (!assignmentData || assignmentData.assignment_count == 0) return 1
    const assignments = assignmentData.assignments
    let maxAssignmentId = Math.max(...assignments.map((assignment: Assignment) => assignment.assignment_id));
    return maxAssignmentId + 1;
};