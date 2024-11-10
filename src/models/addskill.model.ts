// Importing packages
import { Schema, model } from 'mongoose';

// Importing interfaces
import { IaddSkill } from '../interfaces/model.interfaces';


const skillSchema = new Schema({
    skill_name:  { type: String, required: true }
});

export default model<IaddSkill>('skills',skillSchema);
