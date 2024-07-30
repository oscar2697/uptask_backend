import mongoose, { Schema, Document } from "mongoose";

export type ProjectType = Document & {
    projectName: string //TypeScript
    clientName: string
    description: string
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
    desciption: {
        type: String, 
        required: true,
        trim: true,
    },
}) 

const Project = mongoose.model<ProjectType>('Project', ProjectSchema)
export default Project