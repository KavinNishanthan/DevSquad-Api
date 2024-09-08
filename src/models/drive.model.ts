// Importing packages
import { Schema, model } from 'mongoose';

// Importing interfaces
import { IDrive } from '../interfaces/model.interfaces';

const driveSchema = new Schema<IDrive>({
  collegeId: {
    type: String,
    required: true
  },
  companyId: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  driveDate: {
    type: Date,
    required: true
  },
  requirements: {
    type: [String],
    required: true
  },
  rolesAndSalary: [
    {
      role: {
        type: String,
        required: true
      },
      salary: {
        type: Number,
        required: true
      }
    }
  ],
  numberOfRounds: {
    type: Number,
    required: true
  },
  companyLocation: {
    type: String,
    required: true
  },
  roundDetails: [
    {
      roundNumber: {
        type: Number,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      venue: {
        type: String,
        required: true
      }
    }
  ],
  eligibleDepartments: {
    type: [String],
    required: true
  },
  eligibleBatch: {
    type: [Number],
    required: true
  },
  optedStudents: {
    type: [String],
    default: []
  },
  optedOutStudents: {
    type: [String],
    default: []
  },
  placedStudents: {
    type: [String],
    default: []
  },
  eligibilityCriteria: {
    minTenthMarks: {
      type: Number,
      default: null
    },
    minTwelfthMarks: {
      type: Number,
      default: null
    },
    minCGPA: {
      type: Number,
      default: null
    },
    noHistoryOfArrears: {
      type: Boolean,
      default: null
    },
    maxArrears: {
      type: Number,
      required: true
    }
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

export default model<IDrive>('Drive', driveSchema);
