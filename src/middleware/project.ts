import { NextFunction, Request, Response } from "express";
import Project, { IProject } from '../models/Project'

declare global {
    namespace Express {
        interface Request {
            project: IProject
        }
    }
}

export async function validationProjectExists(req: Request, res: Response, next: NextFunction) {
    try {
        const {projectId} = req.params
        const project = await Project.findById(projectId)

        if(!project) {
            const error = new Error('Project Not Found')
            return res.status(404).json({error: error.message})
        }
        
        req.project = project
        next()
    } catch (error) {
        res.status(500).json({error: 'Something went wrong'})
    }
}