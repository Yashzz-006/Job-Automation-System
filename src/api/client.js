import axios from "axios";
import { mockJobs, mockCandidates, mockStudentProfile } from "./mockData";

// Phase 7: flip this to false once Member 1/2's endpoints are live,
// and set VITE_API_BASE_URL in a .env file.
export const USE_MOCK = true;

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
});

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// ---- Student side ----

export async function getMatches() {
  if (USE_MOCK) {
    await delay(500);
    return [...mockJobs].sort((a, b) => b.matchScore - a.matchScore);
  }
  const res = await api.get("/matches/");
  return res.data;
}

export async function getJobDetail(jobId) {
  if (USE_MOCK) {
    await delay(300);
    return mockJobs.find((j) => j.id === jobId);
  }
  const res = await api.get(`/jobs/${jobId}/`);
  return res.data;
}

export async function uploadResume(file) {
  if (USE_MOCK) {
    await delay(1500);
    return mockStudentProfile;
  }
  const formData = new FormData();
  formData.append("resume", file);
  const res = await api.post("/resume/upload/", formData);
  return res.data;
}

export async function getStudentProfile() {
  if (USE_MOCK) {
    await delay(300);
    return mockStudentProfile;
  }
  const res = await api.get("/student/profile/");
  return res.data;
}

// ---- Recruiter side ----

export async function getCandidatesForJob(jobId) {
  if (USE_MOCK) {
    await delay(500);
    return [...mockCandidates].sort((a, b) => b.matchScore - a.matchScore);
  }
  const res = await api.get(`/jobs/${jobId}/candidates/`);
  return res.data;
}

export async function getCandidateDetail(candidateId) {
  if (USE_MOCK) {
    await delay(300);
    return mockCandidates.find((c) => c.id === candidateId);
  }
  const res = await api.get(`/candidates/${candidateId}/`);
  return res.data;
}

export async function postJob(jobData) {
  if (USE_MOCK) {
    await delay(800);
    return { id: `job-${Date.now()}`, matchScore: null, ...jobData };
  }
  const res = await api.post("/jobs/", jobData);
  return res.data;
}

export async function getRecruiterJobs() {
  if (USE_MOCK) {
    await delay(400);
    return mockJobs;
  }
  const res = await api.get("/recruiter/jobs/");
  return res.data;
}

// ---- Auth ----

export async function login({ email, role }) {
  if (USE_MOCK) {
    await delay(400);
    return { token: "mock-jwt-token", user: { name: email.split("@")[0], email, role } };
  }
  const res = await api.post("/auth/login/", { email, role });
  return res.data;
}

export async function register({ name, email, role }) {
  if (USE_MOCK) {
    await delay(400);
    return { token: "mock-jwt-token", user: { name, email, role } };
  }
  const res = await api.post("/auth/register/", { name, email, role });
  return res.data;
}
