import React, { useState } from "react";
import { useParams } from "react-router-dom";

import { PlusCircleIcon } from "lucide-react";
import { createGradedQuiz, createUngradedQuiz } from "../services/QuizService";// API function

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@radix-ui/react-toast";


interface AddQuizFormProps {
  onQuizAdded: () => void;
	graded: boolean
}

const AddQuizForm: React.FC<AddQuizFormProps> = ({ onQuizAdded, graded }) => {
  const { courseId } = useParams();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    course_id: String(courseId),
    quiz_name: "",
    weightage: 0,
  });

  const [isOpen, setIsOpen] = useState(false); // Manage sheet open state

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check for empty fields
    for (const [_key,value] of Object.entries(formData)) {
      if (value === "") {
        toast({
            title: <span className="text-red-600">A problem occurred.</span>,
            description: "Please fill in all the fields!", 
        })      
			}
    }

    try {
			let response;
			if (graded == true) {
				response = await createGradedQuiz(formData); // Call API to create course
			} else {
				response = await createUngradedQuiz(formData);
			}
			
      if (response.response === "Quiz added successfully.") {
				toast({
					title: <span className="text-green-600">Success!</span>,
					description: "Quiz created successfully.", 
					action: (<ToastAction onClick={()=>{window.location.reload()}} altText="Reload page">Reload</ToastAction>),
				})
        onQuizAdded();
        setFormData({
          course_id: String(courseId),
          quiz_name: "",
          weightage: 0
        });
      }
    } catch (error) {
      console.log(error)
			toast({
				title: <span className="text-red-600">A problem occurred.</span>,
				description: "Error in creating quiz. Please try again.", 
				action: (<ToastAction onClick={()=>{window.location.reload()}} altText="Reload page">Reload</ToastAction>),
			})
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
			{graded ? (
				<Button onClick={() => setIsOpen(true)}>
					<PlusCircleIcon className="mr-2 h-4 w-4" />
					Add Graded Quiz
				</Button>
			) : (
				<Button onClick={() => setIsOpen(true)}>
					<PlusCircleIcon className="mr-2 h-4 w-4" />
					Add Ungraded Quiz
				</Button>
			)}
      </SheetTrigger>
      <SheetContent className="max-w-lg md:max-w-xl lg:max-w-2xl">
        <SheetHeader>
					{
						graded? (
							<SheetTitle>Add New Graded Quiz</SheetTitle>
						) : (
							<SheetTitle>Add New Ungraded Quiz</SheetTitle>
					)}
          <SheetDescription>
            Fill out the form below to add a new quiz.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-6">
            {/* Course Code */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="course_id" className="text-right">
                Course Id
              </Label>
              <Input
                id="course_id"
                className="col-span-3"
                value={String(courseId)}
                readOnly
              />
            </div>

            {/* Quiz Name */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quiz_name" className="text-right">
                Quiz Name
              </Label>
              <Input
                id="quiz_name"
                className="col-span-3"
                value={formData.quiz_name}
                onChange={handleInputChange}
              />
            </div>

            {/* Weightage */}
						{graded && (<div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="course_ay" className="text-right">
                {`Weightage`}
              </Label>
              <div className="col-span-3 relative flex items-center">
                <Input
                  id="weightage"
                  type="number"
                  className="pr-10" // Add padding to the right to make space for the percent sign
                  value={formData.weightage}
                  onChange={handleInputChange}
                  min="1"
                  max="100"
                />
                <span className="absolute right-3 text-gray-500">%</span>
              </div>
            </div>)
						}
            
          </div>
          <SheetFooter>
            <Button type="submit">Add Quiz</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default AddQuizForm;
