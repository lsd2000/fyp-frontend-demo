import React, { useState } from "react";
import { PlusCircleIcon } from "lucide-react";
import { createCourse } from "./DashboardService"; // API function

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddCourseSheetProps {
  onCourseAdded: () => void;
}

const AddCourseSheet: React.FC<AddCourseSheetProps> = ({ onCourseAdded }) => {
  const [formData, setFormData] = useState({
    course_id: "",
    course_name: "",
    course_ay: "",
    course_semester: 1,
    course_description: "",
    course_url: "",
  });

  const [Message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("text-red-500"); // Default to red
  const [isOpen, setIsOpen] = useState(false); // Manage sheet open state

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, course_semester: Number(value) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check for empty fields
    for (const [key,value] of Object.entries(formData)) {
      if (value === "") {
        setMessage(`Please fill in all the fields!`);
        setMessageColor("text-red-500"); // Set message color to red
        return; // Exit the function if any field is empty
      }
    }

    try {
      const response = await createCourse(formData); // Call API to create course
      if (response.message === "Course created successfully") {
        setMessage("Course created successfully!");
        setMessageColor("text-green-500");
        onCourseAdded();
        // Reset form fields
        setFormData({
          course_id: "",
          course_name: "",
          course_ay: "",
          course_semester: 1,
          course_description: "",
          course_url: "",
        });
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.detail) {
        setMessage(error.response.data.detail);
        setMessageColor("text-red-500");
      } else {
        setMessage("An unexpected error occurred");
        setMessageColor("text-red-500");
      }
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>
          <PlusCircleIcon className="mr-2 h-4 w-4" /> Add Course
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-lg md:max-w-xl lg:max-w-2xl">
        <SheetHeader>
          <SheetTitle>Add New Course</SheetTitle>
          <SheetDescription>
            Fill out the form below to add a new course.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-6">
            {/* Course Code */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="course_id" className="text-right">
                Course Code
              </Label>
              <Input
                id="course_id"
                className="col-span-3"
                value={formData.course_id}
                onChange={handleInputChange}
              />
            </div>

            {/* Course Name */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="course_name" className="text-right">
                Course Name
              </Label>
              <Input
                id="course_name"
                className="col-span-3"
                value={formData.course_name}
                onChange={handleInputChange}
              />
            </div>

            {/* Academic Year */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="course_ay" className="text-right">
                AY
              </Label>
              <Input
                id="course_ay"
                className="col-span-3"
                value={formData.course_ay}
                onChange={handleInputChange}
              />
            </div>

            {/* Semester */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="semester" className="text-right">
                Semester
              </Label>
              <Select onValueChange={handleSelectChange} defaultValue="1">
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select a semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="course_description" className="text-right">
                Description
              </Label>
              <Textarea
                id="course_description"
                className="col-span-3"
                value={formData.course_description}
                onChange={handleInputChange}
              />
            </div>

            {/* URL */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="course_url" className="text-right">
                URL
              </Label>
              <Input
                id="course_url"
                className="col-span-3"
                value={formData.course_url}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <SheetFooter>
            <Button type="submit">Add Course</Button>
          </SheetFooter>
          {Message && <p className={`mt-2 ${messageColor}`}>Status: {Message}</p>} {/* Apply dynamic class */}
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default AddCourseSheet;
