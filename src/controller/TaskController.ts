import type { Request, Response } from 'express'
import Task from '../models/Task'

export class taskController {
    static createTask = async (req: Request, res: Response) => {
        

        try {
            const task = new Task(req.body)
            task.project = req.project.id
            req.project.task.push(task.id)
            await task.save()
            await req.project.save()
            res.send('Task created succesfully')
        } catch (error) {
            console.log(error)
        }
    }
}