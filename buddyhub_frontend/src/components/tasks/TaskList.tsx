import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { Project, TaskProject, TaskStatus } from '@/types/index'
import TaskCard from './TaskCard'
import { statusTranslations } from '@/locales/es'
import DropTask from './DropTask'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTaskStatus } from '@/api/TaskAPI'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
statusTranslations

type TaskListProps = {
    tasks: TaskProject[]
    canEdit: boolean
}

type GroupedTasks = {
    [key: string]: TaskProject[]
}

const initialStatusGroups: GroupedTasks = {
    PENDING: [],
    IN_PROGRESS: [],
    TO_BE_REVIEWED: [],
    COMPLETED: []
}

const statusStyles : { [key: string] : string} = {
    PENDING: 'border-t-zinc-500',
    IN_PROGRESS: 'border-t-indigo-500',
    TO_BE_REVIEWED: 'border-t-pink-500',
    COMPLETED: 'border-t-lime-500'
}

export default function TaskList({ tasks, canEdit }: TaskListProps) {

    const params = useParams()
    const projectId = params.projectId!
    const queryClient = useQueryClient()    
    const {mutate} = useMutation({
        mutationFn: updateTaskStatus,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({queryKey: ['project', projectId]})
        }
    })
    
    const groupedTasks = tasks.reduce((acc, task) => {
        let currentGroup = acc[task.status] ? [...acc[task.status]] : [];
        currentGroup = [...currentGroup, task]
        return { ...acc, [task.status]: currentGroup };
    }, initialStatusGroups);

    const handleDragEnd = (e: DragEndEvent) => {
        const { active, over } = e
        if(over && over.id){
            const taskId = active.id.toString()
            const status = over.id as TaskStatus
            mutate({projectId, taskId, status})

            queryClient.setQueryData(['project', projectId], (prevData: Project) => {
                const updatedTasks = prevData.tasks.map((task) => {
                    if(taskId === task._id ){
                        return {...task, status}
                    }
                    return task
                })

                return {
                    ...prevData,
                    tasks: updatedTasks
                }
            })
        }
    }

    return (
        <>
            <h2 className="text-5xl font-black my-10">Tareas</h2>

            <div className='flex gap-5 overflow-x-scroll 2xl:overflow-auto pb-32'>
                
                <DndContext onDragEnd={handleDragEnd}>
                    {Object.entries(groupedTasks).map(([status, tasks]) => (
                        <div key={status} className='min-w-[300px] 2xl:min-w-0 2xl:w-1/5 text-center' >
                            <h3 
                                className={`capitalize text-xl font-light border border-slate-300 bg-white p-3 
                                border-t-8 ${statusStyles[status]}`}
                            >{statusTranslations[status]}</h3>

                            <DropTask status={status}/>

                            <ul className='mt-5 space-y-5'>
                                {tasks.length === 0 ? (
                                    <li className="text-gray-500 text-center pt-3">No Hay tareas</li>
                                ) : (
                                    tasks.map(task => <TaskCard key={task._id} task={task} canEdit={canEdit} />)
                                )}
                            </ul>
                            
                        </div> 
                    ))}
                </DndContext>
            </div>
        </>
    )
}
