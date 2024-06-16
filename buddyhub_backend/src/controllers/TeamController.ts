import type { Request, Response } from 'express';
import Auth from '../models/Auth';
import Project from '../models/Project';

export class TeamMemberController {
    static findMemberByEmail = async (req: Request, res: Response) => {
        const { email } = req.body;

        const user = await Auth.findOne({ email }).select('id email name')

        if (!user) {
            const error = new Error('Usuario no encontrado')
            return res.status(404).json({ error: error.message })
        }

        res.json(user);   
    }

    static getProjectTeam = async (req: Request, res: Response) => {
        const project = await Project.findById(req.project.id).populate({
            path: 'team',
            select: 'id email name'
        })

        res.json(project?.team)
    }

    static addMemberById = async (req: Request, res: Response) => {
        const { id } = req.body;
        console.log(id)
        const { email } = req.body;

        const user = await Auth.findById(id).select('id')

        if (!user) {
            const error = new Error('Usuario no encontrado')
            return res.status(404).json({ error: error.message })
        }

        if(req.project.team.some(team => team.toString() === user.id.toString())) {
            const error = new Error('Usuario ya pertenece al equipo')
            return res.status(409).json({ error: error.message })
        }

        req.project.team.push(user.id)
        await req.project.save()

        res.send('Usuario añadido al equipo');
    
    }

    static removeMemberById = async (req: Request, res: Response) => {
        const { userId } = req.params

        if(!req.project.team.some(team => team.toString() === userId)) {
            const error = new Error('El usuario no existe en el equipo')
            return res.status(409).json({ error: error.message })
        }

        req.project.team = req.project.team.filter(teamMember => teamMember.toString() !== userId.toString())

        await req.project.save()

        res.send('Usuario eliminado del equipo');

    }
}