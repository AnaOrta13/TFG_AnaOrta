import type { Request, Response } from 'express'
import Project from '../models/Project'
import Task from '../models/Task'

export class TaskController {
    static createTask = async (req: Request, res: Response) => {

        try {
            const task = new Task(req.body)
            task.project = req.project._id
            req.project.tasks.push(task._id)
            await Promise.allSettled([task.save(), req.project.save()])
            res.send('Tarea creada correctamente');
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    static getProjectTasks = async (req: Request, res: Response) => {
        try {
            const tasks = await Task.find({ project: req.project._id }).populate('project')
            res.json(tasks)
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    static getTaskById = async (req: Request, res: Response) => {
        try {
            const task = await Task.findById(req.task.id)
                .populate({ path: 'completedBy.user', select: 'id name email'})
                .populate({path: 'notes'})
                //.populate({path: 'notes', populate: {path: 'createdBy', select: 'id name email'}})
                
            res.json(task)
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    static updateTask = async (req: Request, res: Response) => {
        try {
            if (req.task.project.toString() !== req.project._id.toString()) {
                return res.status(404).json({ message: 'Tarea no encontrada' })
            }
            req.task.taskName = req.body.taskName
            req.task.description = req.body.description
            await req.task.save()
            res.json(req.task)
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    static deleteTask = async (req: Request, res: Response) => {
        try {
            req.project.tasks = req.project.tasks.filter(task => task.toString() !== req.task._id.toString())
            await Promise.allSettled([req.task.deleteOne(), req.project.save()])
            res.json({ message: 'Tarea Eliminada' })
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' })
        }

    }

    static updateTaskStatus = async (req: Request, res: Response) => {
        try {
            const { status } = req.body
            req.task.status = status

            const data = {
                user: req.user?.id,
                status
            }
            req.task.completedBy.push(data)

            await req.task.save() 

            res.send('Estado de la tarea actualizado correctamente') 
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }

}