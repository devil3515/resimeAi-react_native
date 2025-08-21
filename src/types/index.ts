// User related types
export interface User {
  id: string;
  email: string;
  fullName: string;
  profileImageUrl?: string;
  createdAt: number;
  lastLoginAt: number;
}

// Resume related types
export interface Resume {
  id: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadDate: number;
  parsedData?: ParsedResumeData;
  analysisResult?: ResumeAnalysis;
  optimizationStatus: OptimizationStatus;
  templateId?: string;
  isFavorite: boolean;
}

export interface ParsedResumeData {
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: string[];
  summary?: string;
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  achievements: string[];
}

export interface ResumeAnalysis {
  overallScore: number;
  sections: Record<string, SectionScore>;
  suggestions: string[];
  keywords: string[];
  missingSkills: string[];
}

export interface SectionScore {
  score: number;
  feedback: string;
  suggestions: string[];
}

export enum OptimizationStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

// Job matching types
export interface JobMatch {
  id: string;
  resumeId: string;
  jobTitle: string;
  company: string;
  jobDescription: string;
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
  createdAt: number;
}

export interface JobDescription {
  title: string;
  company: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  experience: string;
  location?: string;
  salary?: string;
}

// Template types
export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  previewImageUrl: string;
  isPremium: boolean;
  tags: string[];
}

export enum TemplateCategory {
  PROFESSIONAL = 'PROFESSIONAL',
  CREATIVE = 'CREATIVE',
  EXECUTIVE = 'EXECUTIVE',
  MODERN = 'MODERN',
  MINIMAL = 'MINIMAL',
  CORPORATE = 'CORPORATE',
  STARTUP = 'STARTUP',
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Navigation types
export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Resume: undefined;
  JobMatching: undefined;
  Templates: undefined;
  Profile: undefined;
};

export type ResumeStackParamList = {
  ResumeList: undefined;
  ResumeDetail: { resumeId: string };
  ResumeUpload: undefined;
  ResumeEdit: { resumeId: string };
  ResumeAnalysis: { resumeId: string };
};

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ResumeUploadForm {
  file: any;
  templateId?: string;
}

// Store types
export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error?: string;
}

export interface ResumeState {
  resumes: Resume[];
  currentResume: Resume | null;
  templates: ResumeTemplate[];
  isLoading: boolean;
  error: string | null;
}

export interface JobMatchingState {
  jobMatches: JobMatch[];
  currentJob: JobDescription | null;
  isLoading: boolean;
  error: string | null;
}
