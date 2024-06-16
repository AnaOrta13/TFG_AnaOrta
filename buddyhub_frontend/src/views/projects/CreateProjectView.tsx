import { Link, useNavigate } from "react-router-dom"
import { useForm} from 'react-hook-form'
import { useMutation } from "@tanstack/react-query"
import { toast } from 'react-toastify'
import ProjectForm from "@/components/projects/ProjectForm"
import { ProjectFormData } from "@/types/index"
import { createProject } from "@/api/ProjectAPI"

function CreateProjectView() {

    const navigate = useNavigate()
    const initialValues : ProjectFormData = {     
        projectName: "",
        teamName: "",
        description: ""                
    }

    const {register, handleSubmit, formState: {errors}} = useForm({defaultValues: 
    initialValues})

    const {mutate} = useMutation({ //React Query
        mutationFn: createProject,
        onSuccess: (data) => {
            toast.success(data)
            navigate('/')
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })   

    const handleForm = (formData : ProjectFormData) => mutate(formData)
    
    return (
        <>
            <div className="max-w-exl mx-auto">

                <h1 className="text-5xl font-black text-center">Crear Proyecto</h1>
                <p className="text-2xl font-light text-gray-500 mt-2 text-center">Creando un proyecto</p>

                <nav className="my-5">
                    <Link
                        className="bg-indigo-400 hover:bg-indigo-600 px-10 py-3 text-white text-xl
                        font-bold cursor-pointer transition-colors"
                        to='/'
                    > Volver a Proyectos </Link>
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
                        value="Crear Proyecto" //amber-400 not bad
                        className="bg-pink-500 hover:bg-pink-600 w-full p-3 text-white 
                        uppercase font-bold cursor-pointer transition-color"
                    ></input>
                    
                </form>

            </div>
        </>
    )
}

export default CreateProjectView