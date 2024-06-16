import mongoose, { Schema, Document, Types } from "mongoose";
import Note from "./Note";

const taskStatus = {
    PENDING: 'PENDING',
    IN_PROGRESS: 'IN_PROGRESS',
    TO_BE_REVIEWED: 'TO_BE_REVIEWED',
    COMPLETED: 'COMPLETED'
} as const 

export type TaskStatus = typeof taskStatus[keyof typeof taskStatus]

export interface ITask extends Document {
    taskName: string
    description: string
    // dueDate: Date
    status: TaskStatus
    project: Types.ObjectId
    completedBy: {
        user: Types.ObjectId
        status: TaskStatus
    }[]
    notes: Types.ObjectId[]
}

export const TaskSchema: Schema = new Schema({
    taskName: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    status: { type: String, required: false, enum: Object.values(taskStatus), default: taskStatus.PENDING },
    project: { type: Types.ObjectId, ref: 'Project' },
    completedBy: [
        {
            user: {
                type: Types.ObjectId,
                ref: 'Auth',
                default: null
            },
            status: {
                type: String,
                enum: Object.values(taskStatus),
                default: taskStatus.PENDING
            }
        }
    ],
    notes: [
        {
            type: Types.ObjectId,
            ref: 'Note',
            default: []
        }
    ]
}, { timestamps: true })

// Middleware

TaskSchema.pre('deleteOne', { document: true}, async function () {
    const taskId = this._id
    if(!taskId) return
    await Note.deleteMany({ task: taskId }) 
})



const Task = mongoose.model<ITask>('Task', TaskSchema)
export default Task