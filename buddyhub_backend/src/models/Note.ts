import mongoose, {Schema, Document, Types } from 'mongoose';

export interface INote extends Document {
    content: string
    createdBy: Types.ObjectId
    author?: string
    task: Types.ObjectId
}

const NoteSchema: Schema = new Schema({
    content: { type: String, required: true },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    author: { type: String, required: true},
    task: { type: Types.ObjectId, ref: 'Task', required: true }
}, { timestamps: true })

const Note = mongoose.model<INote>('Note', NoteSchema)
export default Note