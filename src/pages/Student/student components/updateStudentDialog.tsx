import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { z } from "zod";
import StudentForm, { formSchema } from "./studentForm";
import { updateStudent, StudentData } from "../services/studentService";
import { useContext } from "react";
import CourseContext from "../../CourseContext";

interface UpdateStudentDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  student: StudentData;
}

const UpdateStudentDialog: React.FC<UpdateStudentDialogProps> = ({
  isOpen,
  onOpenChange,
  student,
}) => {
  const { courseID, setStudentData } = useContext(CourseContext);

  const handleUpdateStudent = async (
    formData: z.infer<typeof formSchema>
  ): Promise<boolean> => {
    try {
      const studentData: StudentData = {
        ...formData,
        courseID: courseID,
      };
      const updatedStudent = await updateStudent(studentData, student.username);
      setStudentData((prevStudents) =>
        prevStudents.map((s) =>
          s.courseID === student.courseID &&
          s.username === student.username
            ? updatedStudent
            : s
        )
      );
      onOpenChange(false); // Close the dialog after successful submission
      return true;
    } catch (error) {
      console.error("Error updating student:", error);
      return false;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Student</DialogTitle>
          <DialogDescription>
            Fill in the form to update student details.
          </DialogDescription>
          <StudentForm onSubmit={handleUpdateStudent} student={student} />
        </DialogHeader>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateStudentDialog;
