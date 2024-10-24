import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Link, useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState, useContext } from 'react';
import TopNavBar from "@/components/top-navbar";
import CourseContext from "../CourseContext";
import { fetchClassPart } from "./services/classPartService";
import { ClassPart, Student } from "../types.tsx";
import { FilteredClassPart } from "./services/classPartService.tsx";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Card, CardContent } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";

const aggregateDataByStudent = (data: ClassPart[], studentData: Student[]) => {
  // Initialize all students with empty class participation data
  const aggregatedData: { [key: string]: { score: number; comments: string } } = {};

  studentData.forEach((student) => {
    aggregatedData[student.username] = { score: 0, comments: "-" };
  });

  // Aggregate class participation data for students who have entries
  data.forEach((entry) => {
    const { student_id, score, comments } = entry;

    if (aggregatedData[student_id]) {
      aggregatedData[student_id].score += score;
      aggregatedData[student_id].comments = aggregatedData[student_id].comments !== "-"
        ? `${aggregatedData[student_id].comments}, ${comments}`
        : comments;
    }
  });

  return Object.keys(aggregatedData).map((student_id) => ({
    student_id,
    score: aggregatedData[student_id].score,
    comments: aggregatedData[student_id].comments,
  }));
};

const ClassParts: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate(); 
  const { studentData } = useContext(CourseContext); // Get studentData from CourseContext
  const [classPartData, setClassPartData] = useState<ClassPart[]>([]);
  const [filteredData, setFilteredData] = useState<FilteredClassPart[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<string>("week 1");

  const getStudentNameById = (student_id: string) => {
    const student = studentData.find((student) => student.username === student_id);
    return student ? student.name : "Unknown Student"; // Default if student not found
  };

  useEffect(() => {
    // Filter the data by the selected week and then aggregate by student_id
    const weekFilteredData = classPartData.filter(
      (entry) => entry.week.toLowerCase() === selectedWeek.toLowerCase()
    );
    const aggregatedData = aggregateDataByStudent(weekFilteredData, studentData);
    setFilteredData(aggregatedData);
  }, [selectedWeek, classPartData, studentData]);

  const handleWeekChange = (value: string) => {
    setSelectedWeek(value); // Set the selected week
  };

  const handleAddClassPartClick = (courseId:string) => {
    navigate(`/courses/${courseId}/classparts/addclasspart`);
  };

  useEffect(() => {
    const fetchAndSetClassPart = async () => {
        try {
            const classPartData = await fetchClassPart(String(courseId)); // Await the promise
            setClassPartData(classPartData || []); //set state; use empty array if undefined
        } catch (error) {
            console.error("Error fetching quizzes:", error);
        }
    };

    fetchAndSetClassPart();
  }, [courseId]); //Add courseId as a dependency if it can change

  return (
    <ContentLayout title={`Class Participation`}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={`/courses/${courseId}`}>Course {courseId}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Class Participation</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="rounded-lg border-none mt-6">
        <CardContent className="p-2 ">
          <div className="flex justify-start items-start min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] ">
            <div className="flex flex-col relative justify-center min-w-full">
              <TopNavBar />
              <div className="flex items-center justify-between ml-6 mr-6 mt-2">
                <Select onValueChange={handleWeekChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Week 1" defaultValue="Week 1" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {/* Week Options from 1 to 13 */}
                      {[...Array(13)].map((_, i) => (
                        <SelectItem key={i} value={`Week ${i + 1}`}>
                          Week {i + 1}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="ml-auto" onClick={() => handleAddClassPartClick(courseId!)}>
                  Add Class Participation
                </Button>
              </div>
              <Card className="flex flex-col m-6 h-full">
                <CardContent className="flex flex-col flex-grow p-2 h-[400px]">
                  <Table>
                    <TableHeader className="sticky top-0 bg-background">
                      <TableRow>
                        <TableHead className="text-left">Name</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Comments</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="overflow-auto">
                      {filteredData.map((student) => (
                        <TableRow
                          key={student.student_id}
                          className="cursor-pointer hover:bg-muted"
                        >
                          <TableCell className="font-medium">
                            {getStudentNameById(student.student_id)}
                          </TableCell>
                          <TableCell>{student.score || "-"}</TableCell>
                          <TableCell>{student.comments || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </ContentLayout>
  );
};

export default ClassParts;
