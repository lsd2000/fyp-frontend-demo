import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import CsvUploader from "./csvUploader";

const StudentCSVDialog: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Upload CSV</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription>
            Upload student csv to create new students. Ensure that you have the
            following column headers:{" "}
            <b className="text-red-500">name, username, email</b>
          </DialogDescription>
        </DialogHeader>
        <CsvUploader/>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StudentCSVDialog;
