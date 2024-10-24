import React, { useState, useContext } from "react";
import { Pencil } from "lucide-react";
import { editCourse } from "./CourseService"; // API function

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import CourseContext from "../CourseContext";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Course } from "./CourseService";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EditCourseSheet: React.FC = () => {

  const { courseData, setCourseData } = useContext(CourseContext);

  const [formData, setFormData] = useState({
    course_id: courseData.course_id,
    course_name: courseData.course_name,
    course_ay: courseData.course_ay,
    course_semester: courseData.course_semester,
    course_description: courseData.course_description,
    course_url: courseData.course_url,
  });

  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  //   // Prepopulate form data when courseData changes
  //   useEffect(() => {
  //     if (courseData) {
  //       setFormData({
  //         course_id: courseData.course_id,
  //         course_name: courseData.course_name,
  //         course_ay: courseData.course_ay,
  //         course_semester: courseData.course_semester,
  //         course_description: courseData.course_description,
  //         course_url: courseData.course_url,
  //       });
  //     }
  //   }, [courseData]);

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

    try {
      const response = await editCourse(formData); // API call to edit course
      //console.log("check", response);
      setMessage("Course updated successfully");
      setCourseData((prevCourseData: Course | null) => ({
        ...prevCourseData!,
        ...formData, // Spread the formData to overwrite courseData
      }));

    } catch (error) {
      if (error.response && error.response.data && error.response.data.detail) {
        setMessage(error.response.data.detail);
      } else {
        setMessage("An unexpected error occurred");
      }
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>
          <Pencil className="mr-2 h-4 w-4" /> Edit
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-lg md:max-w-xl lg:max-w-2xl">
        <SheetHeader>
          <SheetTitle>Edit Course</SheetTitle>
          <SheetDescription>
            Modify the fields below to edit the course.
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
                disabled // Disable editing course ID
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
              <Label htmlFor="course_semester" className="text-right">
                Semester
              </Label>
              <Select
                onValueChange={handleSelectChange}
                defaultValue={String(formData.course_semester)}
              >
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
            <Button type="submit">Edit Course</Button>
          </SheetFooter>
          {message && <p>Status: {message}</p>}
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default EditCourseSheet;


