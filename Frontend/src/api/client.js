import axios from "axios";
import { mockJobs, mockCandidates, mockStudentProfile } from "./mockData";

export const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
});

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// --- field transforms: backend snake_case → frontend camelCase ---

function transformJob(job) {
  return {
    ...job,
    id: job.id || job.source_id || job._id,
    matchScore: job.match_score ?? job.matchScore ?? 0,
    stipendOrCtc: job.stipendOrCtc || job.stipend_or_ctc || job.ctc || job.salary || "",
    type: job.type || job.employment_type || job.employmentType || "Full Time",
    jobType: job.jobType || job.job_type || job.type || job.employment_type || "Full Time",
    level: job.level || job.experience_level || "",
    workMode: job.workMode || job.work_mode || "",
    description: job.description || "",
    domain: job.domain || "",
    location: job.location || "Remote",
    requiredSkills: job.required_skills || job.requiredSkills || [],
    matchedSkills: job.matchedSkills || job.matched_skills || [],
    missingSkills: job.missingSkills || job.missing_skills || [],
    logo: job.logo || null,
    postedAt: job.posted_at || job.postedAt || null,
  };
}

function transformProfile(p) {
  return {
    ...p,
    resumeScore: p.resume_score ?? p.resumeScore ?? 65,
    primaryDomain: p.primary_domain || p.primaryDomain || p.domain || "General",
    secondaryDomains: p.secondary_domains || p.secondaryDomains || [],
    skills: p.skills || p.required_skills || [],
    projects: p.projects || [],
    certifications: p.certifications || [],
  };
}

function transformCandidate(c) {
  return {
    ...c,
    id: c.id || c.student_id || c._id,
    matchScore: c.match_score ?? c.matchScore ?? 0,
    resumeScore: c.resume_score ?? c.resumeScore ?? 65,
    domain: c.domain || "",
    matchedSkills: c.matchedSkills || c.matched_skills || [],
    missingSkills: c.missingSkills || c.missing_skills || [],
    skills: c.skills || c.required_skills || [],
    education: c.education || "",
    experience: c.experience || "",
  };
}

// ---- Student side ----

export async function getMatches() {
  if (USE_MOCK) {
    await delay(500);
    return [...mockJobs].sort((a, b) => b.matchScore - a.matchScore);
  }
  const res = await api.get("/matches/");
  const data = res.data;
  if (data.matches) {
    return data.matches.map(transformJob);
  }
  return [];
}

export async function getJobDetail(jobId) {
  if (USE_MOCK) {
    await delay(300);
    return mockJobs.find((j) => j.id === jobId);
  }
  const res = await api.get(`/jobs/${jobId}/`);
  return transformJob(res.data);
}

export async function uploadResume(file) {
  if (USE_MOCK) {
    await delay(1500);
    return mockStudentProfile;
  }
  const formData = new FormData();
  formData.append("resume", file);
  const res = await api.post("/resume/upload/", formData);
  return transformProfile(res.data);
}

export async function getStudentProfile() {
  if (USE_MOCK) {
    await delay(300);
    return mockStudentProfile;
  }
  const res = await api.get("/student/profile/");
  return transformProfile(res.data);
}

// ---- Recruiter side ----

export async function getCandidatesForJob(jobId) {
  if (USE_MOCK) {
    await delay(500);
    return [...mockCandidates].sort((a, b) => b.matchScore - a.matchScore);
  }
  const res = await api.get(`/jobs/${jobId}/candidates/`);
  return (res.data || []).map(transformCandidate);
}

export async function getCandidateDetail(candidateId) {
  if (USE_MOCK) {
    await delay(300);
    return mockCandidates.find((c) => c.id === candidateId);
  }
  const res = await api.get(`/candidates/${candidateId}/`);
  return transformCandidate(res.data);
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
  return (res.data || []).map(transformJob);
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
