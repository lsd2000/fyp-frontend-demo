// Others
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Link, useParams } from "react-router-dom";
import TopNavBar from "@/components/top-navbar";
import { Button } from "@/components/ui/button";
import DeleteCourseButton from "./DeleteCourseButton";
import CourseContext from "../CourseContext";
import EditCourseSheet from "./EditCourseButton";
import React, { useState, useEffect, useContext } from "react";
import { fetchSlidesByCourse, deleteSlide} from "./CourseService";
import { Slide } from "../types";
import UploadSlidesSheet from "./UploadSlidesButton";

// UI Libraries
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";



const Course: React.FC = () => {
  const { courseId } = useParams();
  const { courseData } = useContext(CourseContext);
  const [slides, setSlides] = useState<Slide[]>([]); // Corrected setter
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (courseId) {
      fetchSlides(); // Only fetch slides when courseId is available
    }
  }, [courseId]); // Re-run the effect when courseId changes

  const fetchSlides = async () => {
    try {
      const data = await fetchSlidesByCourse(courseId!); // Use the correct courseId
      setSlides(data.slides); // Corrected setter function to update slides
    } catch (error) {
      console.error("Failed to fetch slides", error);
    }
  };

  const onDeleteSlide = async (slide: Slide) => {
    try {
        // @ts-ignore
      const response = await deleteSlide(courseId!, slide.week);
      toast({
        title: "Success!",
        description: `Slides for Week ${slide.week} deleted!`,
        duration: 5000,
      });
      fetchSlides();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Failed to delete the slide. Please try again!",
        duration: 5000,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };

  if (!courseData) {
    return (
      <ContentLayout title="Loading...">
        <p>Loading course details...</p>
      </ContentLayout>
    );
  }
  //console.log(slides);

  return (
    <ContentLayout title={`Course ${courseId}`}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Course {courseId}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="rounded-lg border-none mt-6">
        <CardContent className="p-2">
          <div className="flex justify-start items-start min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)]">
            <div className="flex flex-col relative justify-center min-w-full">
              <TopNavBar />
              <div className="p-4">
                <div className="flex items-center">
                  <h2 className="font-bold text-3xl">
                    {courseData.course_name}
                  </h2>
                  {/* Buttons aligned to the right */}
                  <div className="ml-auto flex space-x-1 ">
                    <EditCourseSheet />
                    {/* Use the DeleteCourseButton component */}
                    <DeleteCourseButton courseId={courseId!} />

                    <UploadSlidesSheet
                      courseId={courseId!}
                      refreshSlides={fetchSlides}
                    />
                  </div>
                </div>
                <Separator />
                <div className="p-2">
                  <div>
                    <h2 className="text-lg">
                      <span className="font-bold">Academic Year:</span>
                      <span className="font-light">
                        {" "}
                        {courseData.course_ay}
                      </span>
                    </h2>
                  </div>
                  <div>
                    <h2 className="text-lg">
                      <span className="font-bold">Semester:</span>
                      <span className="font-light">
                        {" "}
                        {courseData.course_semester}
                      </span>
                    </h2>
                  </div>
                  <div>
                    <h2 className="font-bold text-lg">Description:</h2>
                    <p className="font-light">
                      {courseData.course_description}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <h2 className="font-bold text-lg mr-2">Course Document:</h2>
                    <a
                      href={courseData.course_url}
                      className="text-blue-500 font-light hover:underline"
                    >
                      Course Documentation Link
                    </a>
                  </div>
                  <div className="mt-8">
                    <h1 className="text-3xl font-bold mb-4">
                      Uploaded Slides:
                    </h1>
                    <div className=" rounded-md border mt-2">
                      <div className="max-h-[300px] overflow-auto">
                        {/* Max is 4 rows */}
                        <Table>
                          <TableCaption className="sticky bottom-0 bg-white dark:bg-gray-950">
                            A list of your uploaded slides
                          </TableCaption>
                          <TableHeader className="sticky top-0 bg-white dark:bg-gray-950">
                            <TableRow>
                              <TableHead>Week</TableHead>
                              <TableHead>Slide Name</TableHead>
                              <TableHead>Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {slides.map((slide) => (
                              <TableRow
                                key={`${slide.course_id}-${slide.week}-${slide.file_name}`}
                              >
                                <TableCell className="font-medium">
                                  {slide.week}
                                </TableCell>
                                <TableCell>{slide.file_name}</TableCell>
                                <TableCell>
                                  <AlertDialog
                                    open={isDialogOpen}
                                    onOpenChange={setIsDialogOpen}
                                  >
                                    {/* Trigger Delete Confirmation Dialog */}
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="destructive"
                                        id="delete-slides-button"
                                      >
                                        Delete Slide
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Are you absolutely sure?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This action cannot be undone. This
                                          will permanently delete the slide for
                                          week {slide.week}.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => onDeleteSlide(slide)}
                                        >
                                          Confirm Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Toaster></Toaster>
        </CardContent>
      </Card>
    </ContentLayout>
  );
};

export default Course;
