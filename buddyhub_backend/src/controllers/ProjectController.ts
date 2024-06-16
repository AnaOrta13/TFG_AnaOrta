import type { Request, Response } from 'express'
import Project from '../models/Project';
export class ProjectController {

    static createProject = async (req: Request, res: Response) => {

        const project = new Project(req.body)

        project.manager = req.user?.id

        console.log(req.user)

        try {
            await project.save()
            res.send('Project Created');
        } catch (error) {
            console.log(error);
        }
    }

    static getAllProjects = async (req: Request, res: Response) => {
        try {
            const projects = await Project.find({
                $or: [
                    { manager: req.user?.id },
                    { team: { $in: [req.user?.id] } }
                ]
            })
            res.json(projects);
        } catch (error) {
            console.log(error);
        }
    }

    static getProjectById = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            const project = await Project.findById(id).populate('tasks')

            if (!project) {
                const error = new Error('Project not found')
                return res.status(404).json({ error: error.message })
            }

            if (project.manager.toString() !== req.user?.id.toString() && !project.team.includes(req.user?.id)) {
                const error = new Error('Acción no permitida')
                return res.status(404).json({ error: error.message })
            }

            res.json(project);
        } catch (error) {
            console.log(error);
        }
    }

    static updateProject = async (req: Request, res: Response) => {
        try {
            req.project.projectName = req.body.projectName
            req.project.teamName = req.body.teamName
            req.project.description = req.body.description

            await req.project.save()
            res.json('Project Updated')
        } catch (error) {
            console.log(error);
        }
    }

    static deleteProject = async (req: Request, res: Response) => {
        try {
            await req.project.deleteOne()
            res.send('Projecto Eliminado')
        } catch (error) {
            console.log(error);
        }
    }

}