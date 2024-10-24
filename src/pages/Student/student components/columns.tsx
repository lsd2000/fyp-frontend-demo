import { Student } from "@/pages/types";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import UpdateStudentDialog from "./updateStudentDialog";
import DeleteStudentDialog from "./deleteStudentDialog";

export const columns: ColumnDef<Student>[] = [
  /*
    {
      accessorKey: "id",
      header: "SMU Student ID",
    }, */

  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "username",
    header: "SMU username",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const student = row.original;
      const [isEditDialogOpen, setEditDialogOpen] = useState(false);
      const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
      const navigate = useNavigate();

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(student.username.toString())
                }
              >
                Copy student username
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  navigate(`/courses/CS203/students/${student.username}`)
                }
              >
                View Student
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation(); // Prevent dropdown from closing
                  setEditDialogOpen(true); // Open the dialog
                }}
              >
                Edit Student
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation(); // Prevent dropdown from closing
                  setDeleteDialogOpen(true); // Open the delete confirmation dialog
                }}
              >
                Delete Student
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <UpdateStudentDialog
            isOpen={isEditDialogOpen}
            onOpenChange={setEditDialogOpen}
            student={student}
          />
          <DeleteStudentDialog
            isOpen={isDeleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            student={student} // Pass the student to be deleted
          />
        </>
      );
    },
  },
];
