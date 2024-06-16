//import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ProjectForm from './ProjectForm'
import { Project, ProjectFormData } from '@/types/index'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProject } from '@/api/ProjectAPI'
import { toast } from 'react-toastify'

type EditProjectFormProps = {   
    data: ProjectFormData
    projectId: Project['_id']
}

export default function EditProjectForm({data, projectId} : EditProjectFormProps) {

    const navigate = useNavigate()
    
    const {register, handleSubmit, formState: {errors}} = useForm({defaultValues: {     
        projectName: data.projectName,
        teamName: data.teamName,
        description: data.description                
    }})

    const queryClient = useQueryClient()

    const {mutate} = useMutation({
        mutationFn: updateProject,
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['projects']})
            queryClient.invalidateQueries({queryKey: ['editProjects', projectId]})
            toast.success(data)
            navigate('/')
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const handleForm = (formData: ProjectFormData) => { 
        const data = {
            formData,
            projectId
        }
        mutate(data)
    }

    return (
        <>
            <div className="max-w-exl mx-auto">

                <h1 className="text-5xl font-black text-center"> Editar Proyecto </h1>
                <p className="text-2xl font-light text-gray-500 mt-2 text-center">Formulario para editar el Proyecto</p>

                <nav className="my-5">
                    <Link
                        className="bg-indigo-400 hover:bg-indigo-500 px-10 py-3 text-white text-xl
                        font-bold cursor-pointer transition-colors"
                        to='/'
                    > Volver al Menu </Link>
                </nav>

                <form
                    className="mt-10 bg-white shadow-lg p-10 rounded-lg"
                    onSubmit={handleSubmit(handleForm)}
                    noValidate
                >
                    <ProjectForm 
                        register={register}
                        errors={errors}
                    />

                    <input
                        type="submit"
                        value="Guardar cambios" //amber-400 not bad
                        className="bg-pink-500 hover:bg-pink-600 w-full p-3 text-white 
                        uppercase font-bold cursor-pointer transition-color"
                    ></input>
                    
                </form>

            </div>
        </>
    )
}
