"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Importing packages
const mongoose_1 = require("mongoose");
const driveSchema = new mongoose_1.Schema({
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
    // requirements: {
    //   type: [String],
    //   required: true
    // },
    jobType: {
        type: String,
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
    // numberOfRounds: {
    //   type: Number,
    //   required: true
    // },
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
    eligibleStudentsId: {
        type: [String],
        default: []
    },
    eligibilityCriteria: {
        minTenthMarks: {
            type: Number,
            required: true
        },
        minTwelfthMarks: {
            type: Number,
            required: true
        },
        minCGPA: {
            type: Number,
            required: true
        },
        noHistoryOfArrears: {
            type: Number,
            required: true
        },
        maxArrears: {
            type: Number,
            required: true
        }
    },
    techStackEligibility: {
        isTechStackRequired: { type: Boolean, required: true },
        requiredSkills: { type: [String], default: [] }
    },
    isOpen: {
        type: Boolean,
        default: true
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
exports.default = (0, mongoose_1.model)('Drive', driveSchema);
