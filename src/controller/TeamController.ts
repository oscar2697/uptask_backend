import type { Request, Response } from "express"
import Auth from "../models/Auth"
import Project from "../models/Project"

export class teamMemberController {
    static findMemberByEmail = async (req: Request, res: Response) => {
        const { email } = req.body

        //Find User
        const user = await Auth.findOne({ email }).select('id email name')

        if (!user) {
            const error = new Error('User not found')
            return res.status(404).json({ error: error.message })
        }
        res.json(user)
    }

    static getProjectTeam = async (req: Request, res: Response) => {
        const project =  await Project.findById(req.project.id).populate({
            path: 'team',
            select: 'id name email'
        })
        
        res.json(project.team)
    }

    static addMemberById = async (req: Request, res: Response) => {
        const {id} = req.body

        const user = await Auth.findById(id).select('id')

        if (!user) {
            const error = new Error('User not found')
            return res.status(404).json({ error: error.message })
        }

        if(req.project.team.some(team => team.toString() === user.id.toString())) {
            const error = new Error('User already on the project')
            return res.status(409).json({ error: error.message })
        }

        req.project.team.push(user.id)
        await req.project.save()

        res.send('The user has been added successfully')
    }

    static removeMemberById = async (req: Request, res: Response) => {
        const {id} = req.body

        if(!req.project.team.some(team => team.toString() === id)) {
            const error = new Error('User not found')
            return res.status(409).json({ error: error.message })
        }


        req.project.team = req.project.team.filter(teamMember => teamMember.toString() !== id)

        await req.project.save()

        res.send('User have been remove')
    }
}