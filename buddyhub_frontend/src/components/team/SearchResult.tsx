import { useMutation, useQueryClient } from "@tanstack/react-query"
import { TeamMember } from "@/types/index"
import { addUserToProject } from "@/api/TeamAPI"
import { toast } from "react-toastify"
import { useNavigate, useParams } from "react-router-dom"

type SearchResultProps = {
    user: TeamMember
    reset: () => void
}


export default function SearchResult({ user, reset }: SearchResultProps) {

    const navigate = useNavigate()
    const params = useParams()
    const projectId = params.projectId!  

    const queryClient = useQueryClient()    

    const { mutate } = useMutation({
        mutationFn: addUserToProject,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            reset()
            navigate(location.pathname, { replace: true })
            queryClient.invalidateQueries({queryKey: ['project-team', projectId]})
        }
    })

    const handleAddUserToProject = () => {
        const data = { projectId, id: user._id }
        mutate(data)
    }
    
    return (
        <>
            <p className="mt-10 text-center font-bold">Resultado:</p>
            <div className="flex justify-between items-center">
                <p>{user.name}</p>
                <button
                    className="hover:text-pink-600 px-10 py-3 text-pink-500 text-xl font-bold cursor-pointer transition-colors"
                    onClick={handleAddUserToProject}
                >
                    Agregar al equipo
                </button>
            </div>
        </>
    )
}
