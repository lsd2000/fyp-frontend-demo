import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StudentContext from "../StudentContext";


interface StudentAvatarProps {
    studentName: string; // Assuming studentName should be a string, not String object
  }

const StudentAvatar: React.FC<StudentAvatarProps> = ({ studentName }) => {
  return (
    <Avatar className="h-20 w-20 mr-4">
      <AvatarImage src="[lets find a suitable image here next time]]height=80&width=80/" alt="Student" />
      <AvatarFallback className="truncate max-w-full">{studentName}</AvatarFallback>
    </Avatar>
  );
};

export default StudentAvatar;
