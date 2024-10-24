import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Link, useParams } from "react-router-dom";
import TopNavBar from "@/components/top-navbar";
import StudentCSVDialog from "../Student/student components/studentCSVdialog";


import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Card, CardContent } from "@/components/ui/card";

const Settings: React.FC = () => {
  const { courseId } = useParams();
  return (
    <ContentLayout title={`Settings`}>
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
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="rounded-lg border-none mt-6 ">
        <CardContent className="p-2 ">
          <TopNavBar />
          <div className="flex justify-start items-start min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] justify-center items-center">
            <div className="flex flex-col relative ">
              This page will not be developed.
            <StudentCSVDialog/>
            </div>
          </div>
        </CardContent>
      </Card>
    </ContentLayout>
  );
};

export default Settings;
