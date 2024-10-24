import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Link, useParams } from "react-router-dom";
import TopNavBar from "@/components/top-navbar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Card, CardContent } from "@/components/ui/card";
import { useContext, useEffect, useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { PlusCircleIcon } from "lucide-react";
import { deleteAssignment, fetchAssignments, getAssignmentId, postAssignment } from "./AssignmentService";
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { mockData } from "./MockData";
import CourseContext from "../CourseContext";
import Submissions from "./Submissions";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Assignment: React.FC = () => {
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { assignmentData, setAssignmentData } = useContext(CourseContext);
    const { courseId } = useParams();
    const [fileType, setFileType] = useState<string | null>("empty");
    const [fileData, setFileData] = useState(null);
    const [newAssignmentId, setNewAssignmentId] = useState(getAssignmentId(assignmentData))
    const [selectedAssignmentId, setSelectedAssignmentId] = useState<number>(1)
    const [displayAssignment, setDisplayAssignment] = useState<boolean>(false)
    const [confirmDialog, setConfirmDialog] = useState<boolean>(false)

    useEffect(() => {
        fetchAssignmentData()
    }, [courseId])

    useEffect(() => {
        if (assignmentData) {
            setNewAssignmentId(getAssignmentId(assignmentData))
        }
    }, [assignmentData])

    const handleFileSet = (value: string) => {
        if (value === "any") {
            setFileType(null); // Set to null if "Any" is selected
        } else {
            setFileType(value);
        }
    };

    const handleFileUpload = (event: any) => {
        setFileData(event.target.files[0])
    }

    const handleMockData = () => {
        const someMockData = mockData.assignments.filter(assignment => {
            return assignment.course_id == courseId
        })

        setAssignmentData({ assignment_count: someMockData.length, assignments: someMockData })
        setIsLoading(false)
    }

    const handleAssignmentClick = (event: any, assignment_id: number) => {
        if (event.target.id.startsWith("row")) {
            setDisplayAssignment(true)
            setSelectedAssignmentId(assignment_id)
        }
    }

    const handleDeleteClick = (_event: any) => {
        setConfirmDialog(true)
    }

    const handleDeleteConfirm = async (_event: any, assignmentId: number) => {
        const req_response = await deleteAssignment(courseId, assignmentId)
        if (req_response) fetchAssignmentData();
    }

    const handleSubmit = async (_event: any) => {
        try {
            const response = await postAssignment(courseId, newAssignmentId, fileType, fileData)
            if (response.status != 201) throw new Error(response.data);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with creating the lab assignment.",
                action: <ToastAction altText="Try again">Try again</ToastAction>,
            })
            return;
        }

        toast({
            title: "Lab Assignment Created!",
            description: "This lab assignment will now start accepting submissions",
            duration: 5000
        })
        fetchAssignmentData()

        setFileData(null)
        setFileType("empty")
    }

    const fetchAssignmentData = async () => {
        try {
            const data = await fetchAssignments(courseId)
            setAssignmentData(data)
            setIsLoading(false)
        } catch (error) {
            console.error(error)
            setIsLoading(true)
        }
    }

    function getType(ext: string) {
        switch (ext) {
            case "py":
                return "Python"

            case "java":
                return "Java"

            case "zip":
                return "Zip File"

            case "pdf":
                return "PDF"

            default:
                return "Any"
        }

    }


    if (isLoading) {
        return (
            <ContentLayout title="Loading...">
                <p>Loading assignment details...</p>
                <p>Please ensure that assignment service is started</p>
                <Button onClick={handleMockData}>Use Mock Data</Button>
            </ContentLayout>
        );
    }


    return (
        <ContentLayout title={`Lab`}>

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
                        <BreadcrumbPage>Lab</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card className="rounded-lg border-none mt-6 ">
                <CardContent className="p-2 ">
                    <div className="flex flex-col relative min-w-full">
                        <TopNavBar />
                        <h1 className="Card Title" style={{ marginTop: 20, margin: 10, fontSize: 20 }}>{courseId} {displayAssignment ? "Lab " + selectedAssignmentId : "Labs"}</h1>

                        <div className="" style={{ margin: 10, marginTop: 0 }}>
                            {(displayAssignment) ? <Submissions assignmentId={selectedAssignmentId} /> :
                                <Table>
                                    <TableCaption>List of lab assignments for {courseId}</TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Lab</TableHead>
                                            <TableHead>Submission Type</TableHead>
                                            <TableHead>Submissions</TableHead>
                                            <TableHead>Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {assignmentData?.assignments?.map((assignment: any) => (
                                            <TableRow
                                                key={assignment.assignment_id}
                                                className="cursor-pointer hover:bg-neutral-400"
                                                onClick={(event) => {
                                                    handleAssignmentClick(event, assignment.assignment_id);
                                                }}
                                                id={"row-ass-" + assignment.assignment_id}
                                            >
                                                <TableCell className="font-medium" id="row-id">{assignment.assignment_id}</TableCell>
                                                <TableCell id="row-ext">{getType(assignment.file_ext)}</TableCell>
                                                <TableCell id="row-count">{assignment.submission_count}</TableCell>
                                                <TableCell>
                                                    <AlertDialog open={confirmDialog} onOpenChange={setConfirmDialog}>
                                                        <AlertDialogTrigger asChild>
                                                            <Button id="delete-button" variant="destructive" onClick={(event) => handleDeleteClick(event)}>
                                                                Delete
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This action cannot be undone. This will permanently delete the lab assignment and all of its submissions.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={(event) => handleDeleteConfirm(event, assignment.assignment_id)}>Continue</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>

                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>}

                        </div>
                        {!displayAssignment && <div className="absolute top-10 right-5">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button>
                                        <PlusCircleIcon className="mr-2 h-4 w-4" /> Add Assignment
                                    </Button>
                                </SheetTrigger>
                                <SheetContent className="max-w-lg md:max-w-xl lg:max-w-2xl">
                                    <SheetHeader>
                                        <SheetTitle>Add New Lab Assignment</SheetTitle>
                                        <SheetDescription>
                                            Fill out the form below to add a new assignment.
                                        </SheetDescription>
                                    </SheetHeader>
                                    <div className="grid gap-6 py-6">
                                        <div className="grid grid-cols-4 items-center gap-4" style={{ fontSize: 14 }}>
                                            <Label htmlFor="ID" className="text-right">
                                                ID
                                            </Label>
                                            {newAssignmentId}
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4" style={{ fontSize: 14 }}>
                                            <Label htmlFor="file" className="text-right">
                                                Upload Lab Questions
                                            </Label>
                                            <input type="file" style={{ width: '300%' }} onChange={handleFileUpload} accept=".pdf"></input>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="url" className="text-right">
                                                Submission Type
                                            </Label>
                                            <RadioGroup onValueChange={handleFileSet}>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="any" id="r1" />
                                                    <Label htmlFor="r1">Any</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="pdf" id="r2" />
                                                    <Label htmlFor="r2">PDF</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="java" id="r3" />
                                                    <Label htmlFor="r3">Java</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="py" id="r4" />
                                                    <Label htmlFor="r4">Python</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="zip" id="r5" />
                                                    <Label htmlFor="r5">Zip File</Label>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                    </div>
                                    <SheetFooter>
                                        <SheetClose asChild>
                                            <Button type="submit" onClick={handleSubmit} disabled={fileData == null || fileType === "empty"}>Add Assignment</Button>
                                        </SheetClose>
                                    </SheetFooter>
                                </SheetContent>
                            </Sheet>
                        </div>

                        }</div>

                    <Toaster />
                </CardContent>
            </Card>
        </ContentLayout>


    );
};

export default Assignment;
