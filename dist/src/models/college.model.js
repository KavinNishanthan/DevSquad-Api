"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Importing packages
const mongoose_1 = require("mongoose");
const batchSchema = new mongoose_1.Schema({
    batchId: {
        type: String,
        required: true
    },
    totalNoOfStudents: {
        type: Number,
        required: true
    },
    students: {
        type: [String],
        default: []
    },
    subscription: {
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid'],
            required: true
        }
    }
});
const collegeSchema = new mongoose_1.Schema({
    collegeId: {
        type: String,
        required: true,
        unique: true
    },
    collegeName: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    contact: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    batches: {
        type: [batchSchema],
        required: false,
        default: []
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
const College = (0, mongoose_1.model)('College', collegeSchema);
exports.default = College;
