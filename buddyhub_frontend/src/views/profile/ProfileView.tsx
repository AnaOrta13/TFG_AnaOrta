import { useAuth } from "@/hooks/useAuth"
import ProfileForm from "./ProfileForm"

export default function ProfileView() {
    const { data, isLoading } = useAuth()

    if(isLoading) return <div>Cargando...</div>

    if(data) return <ProfileForm data={data} />


}
