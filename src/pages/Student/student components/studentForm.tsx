"use client";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { StudentData } from "../services/studentService";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const formSchema = z.object({
  //studentID: z.string().min(8).max(8),
  name: z.string().min(5).max(50),
  username: z.string().min(5).max(50),
  email: z.string().min(5).max(50),
});

interface StudentFormProps {
  onSubmit: (data: z.infer<typeof formSchema>) => Promise<boolean>;
  student?: StudentData; // Make student prop optional
}

const StudentForm: React.FC<StudentFormProps> = ({ onSubmit, student }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: student?.name || "",
      username: student?.username || "",
      email: student?.email || "",
    },
  });
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<string | null>(null);

  const handleFormSubmit = async (data: z.infer<typeof formSchema>) => {
    const isSuccess = await onSubmit(data);

    // Clear message state at the start of a submission attempt
    setMessage("");
    setMessageType(null);

    if (isSuccess && !student) {
      setMessage("Student is created.");
      setMessageType("text-green-500");
      form.reset();
    } else if (!isSuccess) {
      setMessage("Please check data field/duplicates");
      setMessageType("text-red-500");
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className=" space-y-4"
      >
        {/*<FormField
          control={form.control}
          name="studentID"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Student ID</FormLabel>
              <FormControl>
                <Input placeholder="Fill in the student's ID" {...field} />
              </FormControl>
              <FormDescription>
                Fill in the student's 8 digit ID.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
          />*/}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Student Name" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormDescription>Fill in student's SMU username</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Student Email" {...field} />
              </FormControl>
              <FormDescription>Fill in student's SMU email</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />{" "}
        <div className="flex justify-between">
          {message && <p className={`${messageType}`}>{message}</p>}
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
};

export default StudentForm;
