"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { UploadCloud, FileText, AlertCircle } from "lucide-react";
import { uploadCSV } from "../services/studentService"; // Assuming this is the correct path to the service
import { useContext } from "react";
import CourseContext from "../../CourseContext";

const CsvUploader: React.FC = () => {
  const [csvData, setCsvData] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const { courseID, setStudentData } = useContext(CourseContext);

  const isCSV = (file: File) => {
    const validExtensions = [".csv"];
    const validMimeTypes = ["text/csv", "application/vnd.ms-excel"];
    const fileName = file.name.toLowerCase();
    const fileType = file.type.toLowerCase();
    return (
      validExtensions.some((ext) => fileName.endsWith(ext)) ||
      validMimeTypes.includes(fileType)
    );
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (isCSV(file)) {
        parseCSV(file);
        setSelectedFile(file); // Store the selected file
      } else {
        setError("Please check the file is CSV format.");
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  const parseCSV = (file: File) => {
    setIsLoading(true);
    setError(null);

    Papa.parse(file, {
      complete: (result) => {
        setIsLoading(false);
        if (result.errors.length > 0) {
          setError("Error parsing CSV file");
        } else {
          setCsvData(JSON.stringify(result.data, null, 2));
        }
      },
      error: (error) => {
        setIsLoading(false);
        setError("Error parsing CSV file: " + error.message);
      },
    });
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setUploadError("Please select a CSV file to upload.");
      return;
    }

    setIsLoading(true);
    setUploadError(null);
    setUploadSuccess(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      // Replace with the actual courseID or pass it as a prop
      const newStudents = await uploadCSV(courseID, selectedFile);
      setUploadSuccess("CSV file uploaded successfully!");
      setStudentData(prevStudents => [...prevStudents, ...newStudents]);
    } catch (error) {
      setUploadError("Failed to upload CSV file.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto border-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">CSV File Uploader</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? "border-primary bg-primary/10" : "border-muted"
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <div className="text-primary">
              <UploadCloud className="mx-auto h-12 w-12 mb-4" />
              <p className="text-lg font-medium">Drop the CSV file here...</p>
            </div>
          ) : (
            <div className="text-muted-foreground">
              <FileText className="mx-auto h-12 w-12 mb-4" />
              <p className="text-lg font-medium">
                Drag and drop a CSV file here, or click to select a file
              </p>
            </div>
          )}
        </div>
        <div className="flex items-center justify-center">
          <span className="px-2 text-sm text-muted-foreground">or</span>
        </div>
        <div className="text-center">
          <Button
            onClick={() => document.getElementById("fileInput")?.click()}
            disabled={isLoading}
          >
            Select CSV File
          </Button>
          <input
            id="fileInput"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                parseCSV(file);
                setSelectedFile(file); // Store the selected file
              }
            }}
          />
        </div>
        {isLoading && (
          <div className="space-y-2">
            <Progress value={33} className="w-full" />
            <p className="text-center text-sm text-muted-foreground">
              Parsing CSV...
            </p>
          </div>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {csvData && (
          <Textarea
            value={csvData}
            readOnly
            placeholder="CSV data will appear here"
            className="h-64 font-mono"
          />
        )}
      </CardContent>
      <CardFooter className="text-center">
        <div className="flex flex-wrap min-w-full justify-center">
        <Button
          className="min-w-full"
          onClick={handleSubmit}
          disabled={isLoading || !selectedFile}
        >
          {isLoading ? "Uploading..." : "Submit CSV"}
        </Button>
        {uploadSuccess && (
          <p className="text-green-500 mt-4 ">{uploadSuccess}</p>
        )}
        {uploadError && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{uploadError}</AlertDescription>
          </Alert>
        )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default CsvUploader;
