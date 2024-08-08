import mongoose, { Schema, Document, PopulatedDoc, Types } from "mongoose";
import { ITask } from "./Task";
import { IAuth } from "./Auth";

export interface IProject extends Document {
    projectName: string //TypeScript
    clientName: string
    description: string
    task: PopulatedDoc<ITask & Document>[]
    manager: PopulatedDoc<IAuth & Document>
}

const ProjectSchema: Schema = new Schema({
    projectName: {
        type: String, //Mongoose
        required: true,
        trim: true,
    },
    clientName: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    task: [
        {
            type: Types.ObjectId,
            ref: 'Task'
        }
    ],
    manager: {
            type: Types.ObjectId,
            ref: 'Auth'
    }
}, { timestamps: true })

const Project = mongoose.model<IProject>('Project', ProjectSchema)
export default Project