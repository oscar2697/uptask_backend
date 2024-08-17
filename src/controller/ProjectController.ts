import type { Request, Response } from 'express'
import Project from '../models/Project'

export class ProjectController {
    static createProject = async (req: Request, res: Response) => {
        const project = new Project(req.body)

        //Asign a manager
        project.manager = req.user.id

        try {
            await project.save()
            res.send('Project Created Successfully!')
        } catch (error) {
            console.log(error)
        }
    }

    static getAllProjects = async (req: Request, res: Response) => {
        try {
            const projects = await Project.find({
                $or: [
                    {manager: {$in: req.user.id}},
                    {team: {$in: req.user.id}}
                ]
            })

            res.json(projects)
        } catch (error) {
            console.log(error)
        }
    }

    static getAProjectById = async (req: Request, res: Response) => {
        const {id} = req.params

        try {
            const project = await Project.findById(id).populate('task')

            if(!project) {
                const error = new Error('Project Not Found')
                return res.status(404).json({error: error.message})
            }

            if(project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id)) {
                const error = new Error('You are not allowed to perform this action')
                return res.status(404).json({error: error.message})
            }
            res.json(project)
        } catch (error) {
            console.log(error)
        }
    }

    static updateAProject = async (req: Request, res: Response) => {

        try {
            req.project.clientName = req.body.clientName
            req.project.projectName = req.body.projectName
            req.project.description = req.body.description

            await req.project.save()
            res.send('Updated Project')
        } catch (error) {
            console.log(error)
        }
    }

    static deleteAProject = async (req: Request, res: Response) => {
        try {
            await req.project.deleteOne()
            res.send('Project Deleted')
        } catch (error) {
            console.log(error)
        }
    }
}