import { Interface } from "readline";

interface IStudent {
  studentId: string;
  name?: string;
  email: string;
  password: string;
  personal_email?: string;
  register_number?: string;
  contact_number?: string;
  department?: string;
  collegeId: string;
  batchId: string;
  profilePictureUrl?: string;
  profilePictureKey?: string;
  isActive: boolean;
  isUpdated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface IResume {
  studentId: string;
  collegeId: string;
  linkedin_profile: string;
  leetcode_profile: string;
  portfolio_url: string;
  git_hub_url: string;
  about_me: string;
  department?: string;
  batchId: string;
  area_of_interest: string[];
  education: {
    tenth: {
      institution: string;
      year_of_completion: number;
      percentage: number;
    };
    twelth: {
      institution: string;
      year_of_completion: number;
      percentage: number;
    };
    college: {
      degree: string;
      institution: string;
      year_of_completion: number;
      cgpa: number;
      history_of_arrears: number;
      no_of_current_arrear: number;
    };
  };
  experience: {
    company: string;
    role: string;
    technologies: string[];
    duration: string;
  }[];
  projects: {
    title: string;
    description: string;
    technologies: string[];
    project_url: string;
    git_hub_url: string;
  }[];
  skills: {
    skill_name: string;
    test_result: 'pending' | 'passed' | 'failed';
    level: 'default' | 'beginner' | 'intermediate' | 'expert';
  }[];
  optin_drives: string[];
  optout_drives: string[];
  placementStatus: boolean;
  placedCompany?: string;
  isPlacementwilling: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ICollege {
  collegeId: string;
  collegeName: string;
  location: string;
  email: string;
  password: string;
  contact: number;
  isActive: boolean;
  batches: {
    batchId: string;
    totalNoOfStudents: number;
    students: string[];
    subscription: {
      startDate: Date;
      endDate: Date;
      paymentStatus: 'pending' | 'paid';
    };
  }[];
  createdAt: Date;
  updatedAt: Date;
}

interface IDrive {
  collegeId: string;
  companyId: string;
  companyName: string;
  driveDate: Date;
  // requirements: string[];
  jobType:string,
  rolesAndSalary: {
    role: string;
    salary: number;
  }[];
  // numberOfRounds: number;
  companyLocation: string;
  roundDetails: {
    roundNumber: number;
    description: string;
    venue: string;
  }[];
  eligibleDepartments: string[];
  eligibleBatch: number[];
  eligibilityCriteria: {
    minTenthMarks?: number;
    minTwelfthMarks?: number;
    minCGPA?: number;
    noHistoryOfArrears?: number;
    maxArrears: number;
  };
  techStackEligibility?: {
    isTechStackRequired?: boolean;
    requiredSkills?: string[];
  };
  optedStudents: string[];
  optedOutStudents: string[];
  placedStudents: string[];
  eligibleStudentsId: string[];
  isOpen: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface IJwtToken {
  jwtTokenId: string;
  token: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IVerificationToken {
  verificationTokenId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IQuestions{
  difficulty:string;
  questions:string;
  options:string[];
  answers:string;
}

interface IaddSkill{
  skill_name:string;
}

export { IStudent, ICollege, IResume, IDrive, IJwtToken, IVerificationToken,IQuestions,IaddSkill };
