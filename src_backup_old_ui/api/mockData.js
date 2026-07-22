// Mock data — stands in for Agent 2 / Agent 3 / Agent 4 output until backend is wired up (Phase 7).

export const mockStudentProfile = {
  name: "Aditi Sharma",
  resumeScore: 78,
  primaryDomain: "Full Stack",
  secondaryDomains: ["DevOps"],
  skills: ["React", "Node.js", "MongoDB", "Express", "Docker", "Git"],
  projects: ["E-commerce platform", "Real-time chat app"],
  certifications: ["AWS Cloud Practitioner"],
};

export const mockJobs = [
  {
    id: "job-1",
    title: "Frontend Developer (Fresher)",
    company: "Razorpay",
    domain: "Full Stack",
    location: "Bengaluru",
    type: "Full-time",
    stipendOrCtc: "₹8–10 LPA",
    matchScore: 91,
    matchedSkills: ["React", "Node.js", "MongoDB"],
    missingSkills: ["Redux", "TypeScript"],
    description:
      "We're looking for a fresher frontend developer comfortable with React and REST APIs to join our product team. You'll work closely with design and backend teams to ship customer-facing features.",
  },
  {
    id: "job-2",
    title: "DevOps Intern",
    company: "Zoho",
    domain: "DevOps",
    location: "Chennai",
    type: "Internship",
    stipendOrCtc: "₹25,000/mo",
    matchScore: 74,
    matchedSkills: ["Docker", "Git"],
    missingSkills: ["Kubernetes", "AWS", "CI/CD"],
    description:
      "Join our infrastructure team to help automate deployments and monitor production systems. Good opportunity to learn cloud-native tooling hands-on.",
  },
  {
    id: "job-3",
    title: "Backend Developer (Fresher)",
    company: "Freshworks",
    domain: "Full Stack",
    location: "Remote",
    type: "Full-time",
    stipendOrCtc: "₹7–9 LPA",
    matchScore: 68,
    matchedSkills: ["Node.js", "Express"],
    missingSkills: ["PostgreSQL", "GraphQL"],
    description:
      "Build and maintain backend services powering our SaaS product. You'll work with Node.js, Express, and PostgreSQL in a fast-paced startup environment.",
  },
];

export const mockCandidates = [
  {
    id: "cand-1",
    name: "Rohan Mehta",
    domain: "Full Stack",
    resumeScore: 85,
    matchScore: 93,
    matchedSkills: ["React", "Node.js", "MongoDB"],
    missingSkills: ["TypeScript"],
    education: "B.Tech CSE, VIT Chennai",
    experience: "2 internships, 3 personal projects",
    skills: ["React", "Node.js", "MongoDB", "Express", "Git", "Tailwind"],
  },
  {
    id: "cand-2",
    name: "Sneha Iyer",
    domain: "Full Stack",
    resumeScore: 72,
    matchScore: 81,
    matchedSkills: ["React", "MongoDB"],
    missingSkills: ["Node.js", "Redux"],
    education: "B.E IT, Anna University",
    experience: "1 internship, 2 personal projects",
    skills: ["React", "MongoDB", "HTML/CSS", "JavaScript"],
  },
  {
    id: "cand-3",
    name: "Karthik Raja",
    domain: "Full Stack",
    resumeScore: 65,
    matchScore: 70,
    matchedSkills: ["Node.js"],
    missingSkills: ["React", "MongoDB", "Express"],
    education: "B.Tech IT, SRM University",
    experience: "1 personal project",
    skills: ["Node.js", "JavaScript", "MySQL"],
  },
];
