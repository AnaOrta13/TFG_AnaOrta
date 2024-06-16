import { z } from 'zod'


//Auth and Users
const authSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  current_password: z.string(),
  password: z.string(),
  confirmPassword: z.string(),
  token: z.string()
})

type Auth = z.infer<typeof authSchema>
export type UserLoginForm = Pick<Auth, 'email' | 'password'>
export type UserRegistrationForm = Pick<Auth, 'name' |'email' | 'password' | 'confirmPassword'>
export type RequestConfirmationCodeForm = Pick<Auth, 'email'>
export type ForgotPasswordForm = Pick<Auth, 'email'>
export type NewPasswordForm = Pick<Auth, 'password' | 'confirmPassword'>
export type UpdateCurrentPasswordForm = Pick<Auth, 'current_password' | 'password' | 'confirmPassword'>
export type ConfirmToken = Pick<Auth, 'token'>
export type CheckPasswordForm = Pick<Auth, 'password'>

//Users
export const userSchema = authSchema.pick({
  name: true,
  email: true
}).extend({
  _id: z.string()
})

export type User = z.infer<typeof authSchema>
export type UserProfileForm = Pick<User, 'name' | 'email'>


//Notes
const noteSchema = z.object({
  _id: z.string(),
  content: z.string(),
  createdBy: userSchema,
  task: z.string(),
  createdAt: z.string(),
  author: z.string()
})

export type Note = z.infer<typeof noteSchema>
export type NoteFormData = Pick<Note, 'content'>


// Tasks
export const taskStatusSchema = z.enum(["PENDING", "IN_PROGRESS", "TO_BE_REVIEWED", "COMPLETED"])
export type TaskStatus = z.infer<typeof taskStatusSchema>

export const taskSchema = z.object({
  _id: z.string(),
  taskName: z.string(),
  description: z.string(),
  project: z.string(),
  status: taskStatusSchema,
  completedBy: z.array(z.object({
    _id: z.string(),
    user: userSchema,
    status: taskStatusSchema
  })),
  notes: z.array(noteSchema.extend({
    createdBy: userSchema
  })
  ),
  createdAt: z.string(),
  updatedAt: z.string()
})

export const taskProjectSchema = taskSchema.pick({
  _id: true,
  taskName: true,
  description: true,
  status: true,
})


export type Task = z.infer<typeof taskSchema>
export type TaskFormData = Pick<Task, 'taskName' | 'description'>
export type  TaskProject = z.infer<typeof taskProjectSchema>


// Projects

export const projectSchema = z.object({
  _id: z.string(),
  projectName: z.string(),
  teamName: z.string(),
  description: z.string(),
  manager: z.string(userSchema.pick({ _id: true})),
  tasks: z.array(taskProjectSchema),
  team: z.array(z.string(userSchema.pick({ _id: true})))
})

export const dashboardProjectSchema = z.array(
  projectSchema.pick({
    _id: true,
    projectName: true,
    teamName: true,
    description: true,
    manager: true
  })
)

export const editProjectSchema = projectSchema.pick({
  projectName: true,
  teamName: true,
  description: true 
})

export type Project = z.infer<typeof projectSchema>
export type ProjectFormData = Pick<Project, 'projectName' | 'teamName' | 'description'>

// Team

const teamMemberSchema = userSchema.pick({
  _id: true,
  name: true,
  email: true
})
export const teamMembersSchema = z.array(teamMemberSchema)
export type TeamMember = z.infer<typeof teamMemberSchema>
export type TeamMemberForm = Pick<TeamMember, 'email'>
