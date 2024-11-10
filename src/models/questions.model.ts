// Importing packages
import { Schema, model } from 'mongoose';

// Importing interfaces
import { IQuestions } from '../interfaces/model.interfaces';

const questionSchema = new Schema({
  difficulty: { type: String, required: true },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  answer: { type: String, required: true }
});

export const createDynamicModel = (collectionName: string) => {
  
  const lowerCaseCollectionName = collectionName.toLowerCase();

  return model<IQuestions>(collectionName, questionSchema, lowerCaseCollectionName);
};
