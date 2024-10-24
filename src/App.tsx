import "./App.css";
import LandingPage from "./pages/LandingPage/LandingPage.tsx";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import Layout from "./pages/Layout.tsx";
import AccountPage from "./pages/Account/Account.tsx";
import Course from './pages/Course/Course.tsx';
import Assignment from "./pages/Lab/Assignment.tsx";
import Students from "./pages/Student/Students.tsx";
import Quizzes from "./pages/Quiz/Quizzes.tsx";
import QuizSubmissions from "./pages/Quiz/QuizSubmissions.tsx";
import QuizGrader from "./pages/Quiz/QuizGrader.tsx";
import ClassParts from "./pages/ClassParticipation/ClassParts.tsx";
import AddClassPart from "./pages/ClassParticipation/AddClassPart.tsx"
import Settings from "./pages/Settings/Settings.tsx";
import { CourseProvider } from "./pages/CourseContext.tsx";
import Individual from "./pages/Student/individual.tsx";
import { StudentProvider } from "./pages/Student/StudentContext.tsx";

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (

    <Router>
      <Routes>
          <Route path="/home" element={<LandingPage />} />
          <Route path="/courses/:courseId" element={<CourseProvider><Layout><Course/></Layout></CourseProvider>}/>
          <Route path="/courses/:courseId/labs" element={<CourseProvider><Layout><Assignment/></Layout></CourseProvider>}/>
          <Route path="/courses/:courseId/students" element={<CourseProvider><Layout><Students/></Layout></CourseProvider>}/>
          <Route path="/courses/:courseId/students/:username" element={<CourseProvider><StudentProvider><Layout><Individual/></Layout></StudentProvider></CourseProvider>}/>
          <Route path="/courses/:courseId/quizzes" element={<CourseProvider><Layout><Quizzes/></Layout></CourseProvider>}/>
          <Route path="/courses/:courseId/quizzes/:quizTitle" element={<CourseProvider><Layout><QuizSubmissions/></Layout></CourseProvider>}/>
          <Route path="/courses/:courseId/quizzes/:quizTitle/:studentID/:studentName" element={<Layout><QuizGrader/></Layout>}/>
          <Route path="/courses/:courseId/classparts" element={<CourseProvider><Layout><ClassParts/></Layout></CourseProvider>}/>
          <Route path="/courses/:courseId/classparts/addclasspart" element={<CourseProvider><Layout><AddClassPart/></Layout></CourseProvider>}/>
          <Route path="/courses/:courseId/settings" element={<CourseProvider><Layout><Settings/></Layout></CourseProvider>}/>
          <Route path="/" element={<Layout><Dashboard/></Layout>}/>
          <Route path="/account" element={<Layout><AccountPage/></Layout>}/>
      </Routes>
    </Router>


  );
}

export default App;
