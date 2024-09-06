interface IStudent {
  studentId: string;
  name?: string;
  email: string;
  password: string;
  personal_email?: string;
  register_number?: string;
  contact_number?: string;
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
  linkedin_profile: string;
  leetcode_profile: string;
  portfolio_url: string;
  git_hub_url: string;
  about_me: string;
  area_of_interest: string[];
  education: {
    tenth: {
      institution: string;
      year_of_completion: number;
      percentage: number;
      grade: string;
    };
    twelth: {
      institution: string;
      year_of_completion: number;
      percentage: number;
      grade: string;
    };
    college: {
      degree: string;
      institution: string;
      year_of_completion: number;
      cgpa: number;
    };
  };
  experience: {
    company: string;
    role: string;
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
    verification_status: 'verified' | 'rejected';
    verification_type: 'certificate' | 'AI_test';
    certificate_url?: string;
    test_result?: 'passed' | 'failed';
  }[];
  optin_drives: string[];
  optout_drives: string[];
  placementStatus: boolean;
  placedCompany?: string;
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
    year: number;
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



interface IPlacementDrive {
  collegeId: string;
  companyId: string;
  companyName: string;
  driveDate: Date;
  requirements: string[];
  rolesAndSalary: {
    role: string;
    salary: number;
  }[];
  numberOfRounds: number;
  companyLocation: string;
  roundDetails: {
    roundNumber: number;
    description: string;
    venue: string;
  }[];
  eligibleBatchYears: number[];
  optedStudents: string[];
  optedOutStudents: string[];
  placedStudents: string[];
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

export { IStudent, ICollege, IResume, IPlacementDrive, IJwtToken, IVerificationToken };
