import { createNote } from "@/api/NoteAPI"
import ErrorMessage from "@/components/ErrorMessage"
import { NoteFormData } from "@/types/index"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useLocation, useParams } from "react-router-dom"
import { toast } from "react-toastify"



export default function AddNoteForm() {

    const params = useParams()
    const location = useLocation()

    const queryParams = new URLSearchParams(location.search)

    const projectId = params.projectId!
    const taskId = queryParams.get('viewTask')!

    const initialValues : NoteFormData = {
        content: ''
    }

    const { register, handleSubmit, reset, formState: {errors} } = useForm({ defaultValues: initialValues })

    const queryClient = useQueryClient()    
    
    const { mutate } = useMutation({
        mutationFn: createNote,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({queryKey: ['task', taskId]})
        }
    })

    const handleAddNote = (formData: NoteFormData) => {
        mutate ({projectId, taskId, formData})
        reset()
    }

  return (
    <form
        onSubmit={handleSubmit(handleAddNote)}
        className="space-y-3"
        noValidate
    >
        <div className="flex flex-col gap-2">
            <label className="font-bold" htmlFor="content">Crear Nota</label>
            <input
                id="content"
                type="text"    
                placeholder="Escribe tu nota"
                className="w-full p-3 border-gray-300"
                {...register('content', { required: 'Este campo es necesario' })}
            />
            {errors.content && (<ErrorMessage>{errors.content.message}</ErrorMessage>)}
        </div>

        <input
            type="submit"
            value="Crear Nota"
            className="w-full p-2 bg-pink-500 hover:bg-pink-600 text-white font-bold cursor-pointer"
        />
         
    </form>
  )
}
