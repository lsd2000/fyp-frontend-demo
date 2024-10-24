import React, { useContext } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Link, useParams, useNavigate } from "react-router-dom";
import TopNavBar from "@/components/top-navbar";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CourseContext from "../CourseContext";
import { createClassPart, CreateClassPart } from "./services/classPartService";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define schema for validation
const formSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }).max(50),
  week: z.string().min(2, { message: "Week is required" }).max(50),
  score: z.string().min(1, { message: "Score is required" }),
  comments: z.string().min(1, { message: "Comments are required" }).max(10000),
});

const AddClassPart: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const { studentData } = useContext(CourseContext); // Get studentData from CourseContext

  // React Hook Form setup with zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      week: "",
      score: "",
      comments: "",
    },
  });

  // On form submit handler
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const classPartData: CreateClassPart = {
      student_id: values.name,
      course_id: String(courseId),
      week: values.week,
      score: parseInt(values.score),
      comments: values.comments,
    };

    try {
      await createClassPart(classPartData);
      navigate(`/courses/${courseId}/classparts/`);
    } catch (error) {
      console.error("Error creating class part:", error);
    }
    navigate(`/courses/${courseId}/classparts/`);
  };

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

      <Card className="rounded-lg border-none mt-6 ">
        <CardContent className="p-2 ">
          <div className="flex justify-start items-start min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] ">
            <div className="flex flex-col relative justify-center">
              <TopNavBar />
              <div className="m-6">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-8"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a name" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                {studentData.map((student) => (
                                  <SelectItem
                                    key={student.username}
                                    value={student.username}
                                  >
                                    {student.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="week"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Week</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a week" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                {[...Array(13)].map((_, i) => (
                                  <SelectItem key={i} value={`Week ${i + 1}`}>
                                    Week {i + 1}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="score"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Score</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter the class participation score here"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="comments"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Comments</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Type your comments here"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit">Save</Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </ContentLayout>
  );
};

export default AddClassPart;
