import type { Request, Response } from 'express'
import Project from '../models/Project'

export class ProjectController {
    static createProject = async (req: Request, res: Response) => {
        const project = new Project(req.body)

        try {
            await project.save()
            res.send('Project Created Successfully!')
        } catch (error) {
            console.log(error)
        }
    }

    static getAllProjects = async (req: Request, res: Response) => {
        try {
            const projects = await Project.find({})
            res.json(projects)
        } catch (error) {
            console.log(error)
        }
    }

    static getAProjectById = async (req: Request, res: Response) => {
        console.log(req.params)
        try {
            const projects = await Project.find({})
            res.json(projects)
        } catch (error) {
            console.log(error)
        }
    }
}