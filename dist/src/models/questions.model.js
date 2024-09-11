"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDynamicModel = void 0;
// Importing packages
const mongoose_1 = require("mongoose");
const questionSchema = new mongoose_1.Schema({
    difficulty: { type: String, required: true },
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    answer: { type: String, required: true }
});
const createDynamicModel = (collectionName) => {
    const lowerCaseCollectionName = collectionName.toLowerCase();
    return (0, mongoose_1.model)(collectionName, questionSchema, lowerCaseCollectionName);
};
exports.createDynamicModel = createDynamicModel;
