import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import StudentForm, { formSchema } from "./studentForm";
import { createStudent, StudentData } from "../services/studentService";
import { useContext } from "react";
import CourseContext from "../../CourseContext";

const AddStudentDialog: React.FC = () => {

  const { courseID, setStudentData } = useContext(CourseContext);

  const handleCreateStudent = async (
    formData: z.infer<typeof formSchema>
  ): Promise<boolean> => {
    try {
      const studentData: StudentData = {
        ...formData,
        courseID: courseID,
      };
      const student = await createStudent(studentData);
      if (student) {
        setStudentData(prevStudents => {
          // Create a new array that includes the new student
          const newStudents = [...prevStudents, student];
          // Sort the array based on the username
          newStudents.sort((a, b) => a.name.localeCompare(b.name));
          // Update the state with the sorted array
          return newStudents;
        });
        return true;
      }
      
      return false;
    } catch (error) {
      return false; // Return false indicating failure
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
  }, [studentData, courseID]); removing to reduce api calls*/

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Student</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Student Form</DialogTitle>
          <DialogDescription>
            Fill in the form to add student into the course.
          </DialogDescription>
          <StudentForm onSubmit={handleCreateStudent} />
        </DialogHeader>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentDialog;

/*
const handleCreateStudent = useCallback(async (formData: z.infer<typeof formSchema>) => {
  try {
    const studentData: StudentData = {
      ...formData,
      courseID: courseID,
    };
    const student = await createStudent(studentData);
    if (student) {
      setStudentData(prevStudents => [...prevStudents, student]);
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}, [studentData]);
*/
