import { ContentLayout } from "@/components/admin-panel/content-layout";
import { useNavigate } from "react-router-dom"; // Using useNavigate for navigation
import React, { useState, useEffect } from "react";
import { getAllCourses } from "./DashboardService";

import AddCourseSheet from "./AddCourseForm";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

import { Card, CardContent } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface Course {
  course_id: string;
  course_name: string;
  course_ay: string;
  course_semester: number;
  course_description: string;
  course_url: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate(); // Use navigate for programmatic navigation
  //const { setCourseID } = useContext(CourseContext);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await getAllCourses();
      setCourses(data);
    } catch (error) {
      console.error("Failed to fetch courses", error);
    }
  };

  const handleRowClick = (courseId: string) => {
    //setCourseID(courseId);
    navigate(`/courses/${courseId}`);
  };

  return (
    <ContentLayout title="Dashboard">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Card Layout */}
      <Card className="rounded-lg border-none mt-6">
        <CardContent className="p-6">
          <div className="flex flex-col relative min-w-full">
            <h1 className="mb-5">Your Courses</h1>

            <div className="absolute top-0 right-0">
              <AddCourseSheet onCourseAdded={fetchCourses}></AddCourseSheet>
            </div>

            {/* Table to display courses */}
            <Table>
              <TableCaption>A list of your registered courses.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Code</TableHead>
                  <TableHead>Course Name</TableHead>
                  <TableHead>AY</TableHead>
                  <TableHead>Semester</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <TableRow
                      key={course.course_id}
                      className="cursor-pointer hover:bg-neutral-400"
                      onClick={() => handleRowClick(course.course_id)}
                    >
                      <TableCell className="font-medium">
                        {course.course_id}
                      </TableCell>
                      <TableCell>{course.course_name}</TableCell>
                      <TableCell>{course.course_ay}</TableCell>
                      <TableCell>{course.course_semester}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  // Render this when there are no courses
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No courses available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </ContentLayout>
  );
};

export default Dashboard;
