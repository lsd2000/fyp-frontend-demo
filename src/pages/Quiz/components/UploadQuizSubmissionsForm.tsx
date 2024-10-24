import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadGradedSubmissions, uploadUngradedSubmissions } from "../services/QuizSubmissionsService"; //api service
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { fetchGradedQuizResults, fetchUngradedQuizResults } from "../services/QuizResultsService";
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@radix-ui/react-toast";

interface UploadGradedQuizSubmissionsFormProps {
    onUpload: () => void;
    quizId: number;
		graded: boolean;
  }
  
  const UploadQuizSubmissionsForm: React.FC<UploadGradedQuizSubmissionsFormProps> = ({ onUpload, quizId, graded }) => { 
    const { courseId } = useParams();
		const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false); // Manage sheet open state
		const [showAlert, setShowAlert] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null); // Reference for file input
    
    const handleButtonClick = async () => {
			let results
			if (graded == true) {
				results = await fetchGradedQuizResults(String(courseId), quizId)
			} else {
				results = await fetchUngradedQuizResults(String(courseId), quizId)
			}
			//console.log(!gradedQuizResultsList)
			if (!results) {
				setIsOpen(true)
			} else {
				setIsOpen(false)
				setShowAlert(true)
			}
		}

		const confirmReupload = () => {
			setShowAlert(false);
			setIsOpen(true);
		};
	
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        try {
          const formData = new FormData();
          formData.append('file', file);
					let response;
					if (graded == true) {
						response = await uploadGradedSubmissions(formData, String(courseId), quizId); 
					} else {
						response = await uploadUngradedSubmissions(formData, String(courseId), quizId)
					}
          if (response.status === 'success') {
            toast({
                title: <span className="text-green-600">Success!</span>,
                description: "Quiz submissions have been uploaded successfully.", 
                action: (<ToastAction onClick={()=>{window.location.reload()}} altText="Reload page">Reload</ToastAction>),
            })
						onUpload();
          } else {
            toast({
							title:  <span className="text-red-600">Failed to upload submissions.</span>,
							description: "Check the format of the excel sheet?"
						})
          }
					setIsOpen(false)
        } catch (error) {
          console.error("Upload Error:", error);
          toast({
						title: <span className="text-red-600">An error occurred.</span>,
						description: `${error}`
					})
					setIsOpen(false)
        }
      }
    };
  
    const handleUploadButtonClick = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click(); // Trigger file input click
      }
    };
  
    return (
			<>
				{/* Alert dialog for re-upload confirmation */}
				<AlertDialog open={showAlert} onOpenChange={setShowAlert}>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Re-upload Submissions</AlertDialogTitle>
							<AlertDialogDescription>
								You already have uploaded submissions before. Reuploading will replace the data you have previously uploaded. Proceed?
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel onClick={() => setShowAlert(false)}>Cancel</AlertDialogCancel>
							<AlertDialogAction onClick={confirmReupload}>Proceed</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
				<Sheet open={isOpen} onOpenChange={setIsOpen}>
					<SheetTrigger asChild>
						<Button onClick={handleButtonClick}>
							Upload Submissions
						</Button>
					</SheetTrigger>
					<SheetContent className="max-w-lg md:max-w-xl lg:max-w-2xl">
						<SheetHeader>
							<SheetTitle>Upload Submissions</SheetTitle>
							<SheetDescription>
								Select an Excel file to upload the quiz submissions.
							</SheetDescription>
						</SheetHeader>
						<div className="grid gap-6 py-6">
							<div className="grid grid-cols-4 items-center gap-4">
								<Input
									id="file_upload"
									type="file"
									className="col-span-3"
									accept=".xls,.xlsx"
									ref={fileInputRef}
									style={{ display: 'none' }} // Hide the input field
									onChange={handleFileChange}
								/>
								<Button onClick={handleUploadButtonClick} disabled={!isOpen} className="col-span-4">
									Upload File
								</Button>
							</div>
						</div>
					</SheetContent>
				</Sheet>
			</>
    );
  };
  
  export default UploadQuizSubmissionsForm;
  