"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Importing packages
const mongoose_1 = require("mongoose");
const skillSchema = new mongoose_1.Schema({
    skill_name: { type: String, required: true }
});
exports.default = (0, mongoose_1.model)('skills', skillSchema);
