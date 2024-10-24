import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useContext, useState, useEffect, ChangeEvent, MouseEvent } from "react";
import { Link, useParams } from "react-router-dom";
import CourseContext from "../CourseContext";
import { getSubmissions, patchSubmission, postSubmission, Submission, SubmissionData, Student } from "./AssignmentService";
import { MoreHorizontalIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";




const Submissions: React.FC<{ assignmentId: number }> = (props) => {
    const { toast } = useToast()
    const { courseId } = useParams();
    const [submissionData, setSubmissionData] = useState<SubmissionData | null>(null);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null); // Correct type for selectedStudent
    const [sortOrder, setSortOrder] = useState<{ column: string, direction: "asc" | "desc" }>({ column: "name", direction: "asc" });
    const { studentData } = useContext(CourseContext);
    const [isTextSubmission, setIsTextSubmission] = useState(false); // State for toggle
    const [textSubmission, setTextSubmission] = useState<string | null>(null); // text for submission
    const [file, setFile] = useState<File | null>(null);  // file for submission
    const [recoData, setRecoData] = useState<Submission | null>(null)
    const [textReco, setTextReco] = useState<string | null>(null)
    const [fileReco, setFileReco] = useState<string | null>(null)
    const recoPlaceholder = "No recomendation generated, enter a custom recommendation"


    useEffect(() => {
        updateSubmissionData();
    }, [courseId, props.assignmentId]);

    useEffect(() => {
        setTextReco(recoData?.text_reco || null)
        setFileReco(recoData?.file_reco || null)
    }, [recoData])

    function setRecommendation(sub: Submission) {
        setRecoData(sub)
        setTextReco(sub.text_reco)
        setFileReco(sub.file_reco)
        setOpenDrawer(true)
    }

    function clearRecommendation() {
        setRecoData(null)
        setTextReco(null)
        setFileReco(null)
        setOpenDrawer(false)
    }

    function createToast(isError: boolean, title: string, description: string) {
        toast({
            variant: isError ? "destructive" : "default",
            title: title,
            description: description,
            duration: 5000
        })
    }

    const hasSubmitted = (username: string) => {
        return submissionData?.submissions?.some(
            (submission: any) => submission.student_username === username
        );
    };

    const handleUploadClick = (student: Student) => {  // Correctly typed student argument
        setSelectedStudent(student);
        setOpenDialog(true);
    };

    const handleViewSubmission = (student: Student) => {
        setSelectedStudent(student);
        var selectedSubmission: Submission | null = submissionData?.submissions.find(submission => submission.student_username === student.username) || { course_id: courseId || "", assignment_id: props.assignmentId, student_username: student.username, file_path: null, content: null, text_reco: null, file_reco: null }
        setRecommendation(selectedSubmission)

    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleTextChange = (_event: any) => {
        setTextSubmission(_event.target.value)
    };

    const handleRecoChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        event.target.id === "reco1" ? setTextReco(event.target.value) : setFileReco(event.target.value)
    }

    const handleSaveReco = (event: MouseEvent<HTMLButtonElement>) => {
        if (!recoData) {
            setOpenDrawer(false);
            clearRecommendation();
            return;
        }
        // @ts-ignore
        if (event.target.id === "saveText") {
            recoData.text_reco = textReco
        } else {
            recoData.file_reco = fileReco
        }

        patchSubmission(recoData).then((res) => {
            // @ts-ignore
            res.status === 200 ? createToast(false, "Succesful update!", res.data.message) : createToast(true, "Unsuccessful update!", res.data.detail);
            updateSubmissionData();

        }).catch(error => {
            console.error(error);
            createToast(true, "Succesful Submission!", error);
        })
        // clearRecommendation()
    }


    const handleFileUploadOrTextSubmission = () => {
        if (selectedStudent) {
            const response = postSubmission(courseId, props.assignmentId, selectedStudent.username, textSubmission, file)
            response.then((res) => {
                if (res.status === 201) {
                    const data = res.data;
                    createToast(false, "Succesful Submission!", data.message);
                    setRecommendation(data.submission_details);

                } else {
                    // @ts-ignore
                    createToast(true, "Unsuccesful Submission!", res.data.detail);
                }
                updateSubmissionData();
            }).catch(error => {
                console.error(error);
                createToast(true, "Unsuccesful Submission!", error);
            })

            // Reset after upload
            setOpenDialog(false);
            setFile(null);
            setTextSubmission(null);
            setSelectedStudent(null);
        }
    };

    // Update submission data
    const updateSubmissionData = () => {
        getSubmissions(courseId, props.assignmentId)
            .then((response) => {
                setSubmissionData(response.data);
            })
            .catch((error) => console.log(error));
    };

    // Sorting Logic
    const sortStudents = (students: Student[]) => {
        return [...students].sort((a, b) => {
            const column = sortOrder.column;
            const direction = sortOrder.direction === "asc" ? 1 : -1;

            if (column === "name") {
                return a.name.localeCompare(b.name) * direction;
            } else if (column === "status") {
                const aHasSubmitted = hasSubmitted(a.username);
                const bHasSubmitted = hasSubmitted(b.username);
                return (aHasSubmitted === bHasSubmitted ? 0 : aHasSubmitted ? 1 : -1) * direction;
            }
            return 0;
        });
    };

    const toggleSortOrder = (column: string) => {
        setSortOrder((prev) => ({
            column,
            direction: prev.column === column && prev.direction === "asc" ? "desc" : "asc",
        }));
    };

    return (
        <>
            <Link to="" reloadDocument={true} style={{ textDecorationLine: "underline" }} >Back to Labs</Link>
            <Table id="sub_table">
                <TableCaption>List of submissions for assignment {props.assignmentId}</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead onClick={() => toggleSortOrder("name")} className="cursor-pointer">
                            Student Name {sortOrder.column === "name" && (sortOrder.direction === "asc" ? "↑" : "↓")}
                        </TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead onClick={() => toggleSortOrder("status")} className="cursor-pointer">
                            Status {sortOrder.column === "status" && (sortOrder.direction === "asc" ? "↑" : "↓")}
                        </TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortStudents(studentData).map((student: Student) => (
                        <TableRow key={student.username} className="cursor-pointer hover:bg-neutral-400">
                            <TableCell className="font-medium">{student.name}</TableCell>
                            <TableCell>{student.username}</TableCell>
                            <TableCell>
                                <Badge variant={hasSubmitted(student.username) ? "default" : "destructive"}>
                                    {hasSubmitted(student.username) ? "Submitted" : "Not Submitted"}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <MoreHorizontalIcon /> {/* Ellipsis icon */}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => handleUploadClick(student)}>
                                            Upload Submission
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleViewSubmission(student)}>View Recommendation</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Dialog for file upload */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger />
                <DialogContent aria-describedby="" style={{ width: "60%", height: 250 }} onCloseAutoFocus={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle>Upload Submission for {selectedStudent?.name}</DialogTitle>
                    </DialogHeader>

                    {/* Toggle between text and file submission */}
                    <div className="flex items-center space-x-2" style={{ position: "fixed", top: 55, left: 23 }}>
                        <Label htmlFor="submissionType">Text Submission  </Label>
                        <Switch id="submissionType" checked={isTextSubmission} onCheckedChange={setIsTextSubmission} />
                    </div>

                    {isTextSubmission ? (
                        <div className="grid w-full gap-1.5" style={{ position: "relative", top: 25, left: 0 }}>
                            <Label htmlFor="message">Code for Submission</Label>
                            <Textarea placeholder="Enter your code here." id="message" onChange={handleTextChange} style={{ height: "100%" }} />
                        </div>
                    ) : (
                        <div className="grid w-full gap-1.5" style={{ position: "relative", top: 18, left: 0 }}>
                            <Label htmlFor="fileUpload">File Upload</Label>
                            <Input type="file" id="fileUpload" onChange={handleFileChange} />
                            {submissionData?.submission_type ? <h1>Please ensure file is a .{submissionData?.submission_type} file</h1> : <></>}
                        </div>

                    )}

                    <DialogFooter>
                        <Button type="submit" onClick={handleFileUploadOrTextSubmission} style={{ position: "relative", top: 20, left: 0 }} disabled={(isTextSubmission && !textSubmission) || (!isTextSubmission && !file)}>
                            Submit
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Drawer for recommendation */}
            <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
                <DrawerContent>
                    <div className="mx-auto w-full" style={{ width: 1000 }}>

                        {/* Centering Drawer Header */}
                        <DrawerHeader className="flex flex-col items-center text-center">
                            <DrawerTitle>Recommendation for {recoData?.student_username}</DrawerTitle>
                            <DrawerDescription>Modify recommendations as needed!</DrawerDescription>
                        </DrawerHeader>

                        {/* Increased space between header and flex columns */}
                        <div className="flex space-x-5 mt-8">

                            {/* Column 1 */}
                            <div className="flex-1">
                                <Label htmlFor="text-response" className="block mb-2">Recommendation for text submission</Label>
                                <Textarea
                                    placeholder={recoPlaceholder}
                                    value={textReco || undefined}
                                    id="reco1"
                                    onChange={handleRecoChange}
                                    style={{ height: 300, width: "100%" }}
                                    disabled={false}
                                />
                                <Button className="mt-2" id="saveText" style={{ width: "100%" }} disabled={textReco === recoData?.text_reco} onClick={event => handleSaveReco(event)}>Save Text Recommendation</Button>
                            </div>

                            {/* Column 2 */}
                            <div className="flex-1">
                                <Label htmlFor="file-response" className="block mb-2">Recommendation for file submission</Label>
                                <Textarea
                                    placeholder={recoPlaceholder}
                                    value={fileReco || undefined}
                                    id="reco2"
                                    onChange={handleRecoChange}
                                    style={{ height: 300, width: "100%" }}
                                />
                                <Button className="mt-2" id="saveFile" style={{ width: "100%" }} disabled={fileReco === recoData?.file_reco} onClick={event => handleSaveReco(event)}>Save File Recommendation</Button>
                            </div>
                        </div>

                        {/* Footer with Cancel button */}
                        <DrawerFooter>
                            <DrawerClose asChild>
                                <Button variant="outline" style={{ width: "100%" }} onClick={clearRecommendation}>Cancel</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>


        </>
    );
};

export default Submissions;
