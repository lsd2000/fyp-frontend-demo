import { useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteStudent, StudentData } from "../services/studentService";
import CourseContext from "../../CourseContext";

interface DeleteStudentDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  student: StudentData;
}

const DeleteStudentDialog: React.FC<DeleteStudentDialogProps> = ({
  isOpen,
  onOpenChange,
  student,
}) => {
  const { courseID, setStudentData} = useContext(CourseContext);

  const handleDelete = async () => {
    try {
      const studentData: StudentData = {
        ...student,
        courseID: courseID,
      };
      await deleteStudent(studentData);
      //console.log("Student successfully deleted:", studentData);
      setStudentData((prevStudents) =>
        prevStudents.filter(
          (s) =>
            !(
              s.username === studentData.username &&
              s.courseID === studentData.courseID
            )
        )
      );
      onOpenChange(false); // Close the dialog after successful deletion
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  /*useEffect(() => {
    const fetchAndUpdateStudents = async () => {
      const newStudentData = await fetchStudents(courseID);
      // Only update if there's a change
      if (JSON.stringify(studentData) !== JSON.stringify(newStudentData)) {
        setStudentData(newStudentData);
      }
    };
    fetchAndUpdateStudents();
  }, [studentData, courseID]); removed to reduce api calls. directly change array instead */

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {student.name}? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteStudentDialog;
