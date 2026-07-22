import { Routes, Route } from "react-router-dom";
import Landing from "../pages/landing/Landing";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ProtectedRoute from "../components/shared/ProtectedRoute";

import StudentDashboard from "../pages/student/Dashboard";
import ResumeUpload from "../pages/student/ResumeUpload";
import JobList from "../pages/student/JobList";
import JobDetail from "../pages/student/JobDetail";

import RecruiterDashboard from "../pages/recruiter/Dashboard";
import PostJob from "../pages/recruiter/PostJob";
import CandidateList from "../pages/recruiter/CandidateList";
import CandidateDetail from "../pages/recruiter/CandidateDetail";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Student */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/resume"
        element={
          <ProtectedRoute allowedRole="student">
            <ResumeUpload />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/jobs"
        element={
          <ProtectedRoute allowedRole="student">
            <JobList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/jobs/:jobId"
        element={
          <ProtectedRoute allowedRole="student">
            <JobDetail />
          </ProtectedRoute>
        }
      />

      {/* Recruiter */}
      <Route
        path="/recruiter/dashboard"
        element={
          <ProtectedRoute allowedRole="recruiter">
            <RecruiterDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/post-job"
        element={
          <ProtectedRoute allowedRole="recruiter">
            <PostJob />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/candidates"
        element={
          <ProtectedRoute allowedRole="recruiter">
            <CandidateList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/candidates/:candidateId"
        element={
          <ProtectedRoute allowedRole="recruiter">
            <CandidateDetail />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
