import { ContentLayout } from "@/components/admin-panel/content-layout";
import { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import TopNavBar from "@/components/top-navbar";
import CourseContext from "../CourseContext";
import { columns } from "./student components/columns.tsx";
import { StudentTable } from "./student components/StudentTable.tsx";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Card, CardContent } from "@/components/ui/card";

const Students: React.FC = () => {
  const { courseId } = useParams();
  const { studentData } = useContext(CourseContext);
  return (
    <ContentLayout title={`Students`}>
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
            <BreadcrumbPage>Students</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="rounded-lg border-none mt-6 ">
        <CardContent className="p-2 ">
          <div className="flex justify-start items-start min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] min-w-20">
            <div className="flex flex-col relative justify-center min-w-full">
              <TopNavBar />
              <StudentTable columns={columns} data={studentData} />
            </div>
          </div>
        </CardContent>
      </Card>
    </ContentLayout>
  );
};

export default Students;
