import { useState, useRef } from "react"; // Import useRef
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { uploadSlides } from "./CourseService"; // Adjust the import path accordingly

const UploadSlidesSheet: React.FC<{ courseId: string; refreshSlides: () => void }> = ({ courseId, refreshSlides }) => {
  const [week, setWeek] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  
  // Create a ref for the file input
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (week && file) {
      try {
        // Call the uploadSlides function
        const response = await uploadSlides(courseId, parseInt(week), file);
        toast({
          title: "Success!",
          description: `Slides for Week ${week} uploaded successfully. File name: ${response.slide_details.file_name}`,
          duration: 5000,
        });
        // Clear the input and states after successful upload
        setWeek("");
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Clear the file input
        }
        refreshSlides();
      } catch (error) {
        console.error("Upload failed", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to upload slides. Please try again.",
          duration: 5000,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    } else {
      console.log("Please select a week and a file");
    }
  };

  return (
    <>
      <Toaster />
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button className="mb-2">
            <Upload className="mr-2 h-4 w-4" /> Upload Slides
          </Button>
        </SheetTrigger>
        <SheetContent className="max-w-lg md:max-w-xl lg:max-w-2xl">
          <SheetHeader>
            <SheetTitle>Upload Slides</SheetTitle>
            <SheetDescription>
              Choose a week and upload your PDF slides.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-6 py-6">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="week" className="text-right">
                Week
              </Label>
              <Select onValueChange={setWeek} value={week}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a week" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12].map((weekNum) => (
                    <SelectItem key={weekNum} value={weekNum.toString()}>
                      Week {weekNum}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="file" className="text-right">
                PDF File
              </Label>
              <Input
                id="file"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                ref={fileInputRef} // Attach the ref to the input
                className="col-span-3"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={handleUpload} disabled={!week || !file}>
              Upload
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default UploadSlidesSheet;
