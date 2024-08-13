import type { Request, Response } from 'express'
import Task from '../models/Task'

export class taskController {
    static createTask = async (req: Request, res: Response) => {
        try {
            const task = new Task(req.body)
            task.project = req.project.id
            req.project.task.push(task.id)
            await Promise.allSettled([task.save(), req.project.save()])
            res.send('Task created succesfully')
        } catch (error) {
            res.status(500).json({error: 'Something went wrong'})
        }
    }

    static getProjectTasks = async (req: Request, res: Response) => {
        try {
            const tasks = await Task.find({project: req.project.id}).populate('project')
            res.json(tasks)
        } catch (error) {
            res.status(500).json({error: 'Something went wrong'})
        }
    }

    static getTaskById = async (req: Request, res: Response) => {
        try {
            const task = await Task.findById(req.task.id)
                                    .populate({path: 'completedBy.user', select: 'id name email'})
                                    .populate({path: 'notes', populate: {path: 'createdBy', select: 'id name email'}})
            res.json(task)
        } catch (error) {
            res.status(500).json({error: 'Something went wrong'})
        }
    }

    static updateTask = async (req: Request, res: Response) => {
        try {
            req.task.name = req.body.name
            req.task.description = req.body.description

            await req.task.save()

            res.send('Task Updated Successfully')
        } catch (error) {
            res.status(500).json({error: 'Something went wrong'})
        }
    }

    static deleteTask = async (req: Request, res: Response) => {
        try {
            req.project.task = req.project.task.filter((task) => task.toString() !== req.task.id.toString())

            await Promise.allSettled([req.task.deleteOne(), req.project.save()])

            res.send('Task Deleted Successfully')
        } catch (error) {
            res.status(500).json({error: 'Something went wrong'})
        }
    }

    static updateStatus = async (req: Request, res: Response) => {
        try {
            const {status} = req.body
            req.task.status = status

            const data = {
                user: req.user.id,
                status
            }

            req.task.completedBy.push(data)

            await req.task.save()
            res.send('Task Status Updated Successfully')
        } catch (error) {
            res.status(500).json({error: 'Something went wrong'})
        }
    }
}