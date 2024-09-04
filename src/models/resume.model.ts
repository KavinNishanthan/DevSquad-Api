// Importing packages
import { Schema, model } from 'mongoose';

// Importing interfaces
import { IResume } from '../interfaces/model.interfaces';

const schema = new Schema<IResume>({
  studentId: {
    type: String,
    required: true
  },
  linkedin_profile: {
    type: String,
    required: true
  },
  leetcode_profile: {
    type: String,
    required: true
  },
  portfolio_url: {
    type: String,
    required: true
  },
  git_hub_url: {
    type: String,
    required: true
  },
  about_me: {
    type: String,
    required: true
  },
  education: {
    tenth: {
      institution: {
        type: String,
        required: true
      },
      year_of_completion: {
        type: Number,
        required: true
      },
      percentage: {
        type: Number,
        required: true
      },
      grade: {
        type: String,
        required: true
      }
    },
    twelth: {
      institution: {
        type: String,
        required: true
      },
      year_of_completion: {
        type: Number,
        required: true
      },
      percentage: {
        type: Number,
        required: true
      },
      grade: {
        type: String,
        required: true
      }
    },
    college: {
      degree: {
        type: String,
        required: true
      },
      institution: {
        type: String,
        required: true
      },
      year_of_completion: {
        type: Number,
        required: true
      },
      cgpa: {
        type: Number,
        required: true
      }
    }
  },
  experience: [
    {
      company: {
        type: String,
        required: false
      },
      role: {
        type: String,
        required: false
      },
      duration: {
        type: String,
        required: false
      }
    }
  ],
  projects: [
    {
      title: {
        type: String,
        required: false
      },
      description: {
        type: String,
        required: false
      },
      technologies: [
        {
          type: String,
          required: false
        }
      ],
      project_url: {
        type: String,
        required: false
      },
      git_hub_url: {
        type: String,
        required: false
      }
    }
  ],
  skills: [
    {
      skill_name: {
        type: String,
        required: false
      },
      verification_status: {
        type: String,
        enum: ['verified', 'rejected'],
        required: false
      },
      verification_type: {
        type: String,
        enum: ['certificate', 'AI_test'],
        required: false
      },
      certificate_url: {
        type: String
      },
      test_result: {
        type: String,
        enum: ['passed', 'failed']
      }
    }
  ],
  optin_drives: [
    {
      type: String,
      required: false
    }
  ],
  optout_drives: [
    {
      type: String,
      required: false
    }
  ],
  placementStatus: {
    type: Boolean,
    required: false,
    default: false
  },
  placedCompany: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Resume = model<IResume>('Resume', schema);

export default Resume;
