import type { Request, Response } from 'express'
import Note, { INote } from '../models/Note'
import { Types } from 'mongoose'


type NoteParams = {
    noteId: Types.ObjectId
}

export class NoteController {
    static createNote = async (req: Request<{}, {}, INote>, res: Response) => {
        const { content } = req.body

        const note = new Note
        note.content = content
        note.createdBy = req.user?._id
        note.task = req.task._id
        note.author = req.user?.name

        req.task.notes.push(note._id)

        try {
            await Promise.allSettled([req.task.save(), note.save()])
            res.send('Nota creada correctamente')
        } catch (error) {
            return res.status(500).json({ message: 'Error al crear la nota' })
        }
    }

    static getTaskNotes = async (req: Request, res: Response) => {
        try {
            const notes = await Note.find({ task: req.task._id })
            res.json(notes)
        } catch (error) {
            return res.status(500).json({ message: 'Error en notas' })
        }
    }

    static deleteNote = async (req: Request<any>, res: Response) => {
        const { noteId } = req.params
        const note = await Note.findById(noteId)

        if (!note) {
            const error = new Error('Nota no encontrada')
            return res.status(404).json({ error: error.message })
        }

        if (note.createdBy.toString() !== req.user?._id.toString()) {
            const error = new Error('No tienes permiso para eliminar esta nota')
            return res.status(401).json({ error: error.message })
        }

        req.task.notes = req.task.notes.filter(note => note.toString() !== noteId.toString())

        try {
            await Promise.allSettled([req.task.save(), note.deleteOne()])
            res.send('Nota Eliminada')
        } catch (error) {
            return res.status(500).json({ error: 'Error al eliminar la Nota' })
        }

    }

    /*    static async deleteNote(req: Request, res: Response) {
            const { noteId } = req.params;
            const note = await Note.findById(noteId);
    
            if (!note) {
                return res.status(404).json({ error: 'Nota no encontrada' });
            }
    
            if (note.createdBy.toString() !== req.user?._id.toString()) {
                return res.status(401).json({ error: 'No tienes permiso para eliminar esta nota' });
            }
    
            req.task.notes = req.task.notes.filter((note) => note.toString() !== noteId.toString());
    
            try {
                await Promise.allSettled([req.task.save(), note.deleteOne()]);
                res.send({ message: 'Nota Eliminada' });
            } catch (error) {
                return res.status(500).json({ error: 'Error al eliminar la Nota' });
            }
        }*/




}