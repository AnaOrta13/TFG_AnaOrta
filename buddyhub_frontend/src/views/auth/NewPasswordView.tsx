import NewPasswordForm from "@/components/auth/NewPasswordForm"
import NewPasswordToken from "@/components/auth/NewPasswordToken"
import { ConfirmToken } from "@/types/index"
import { useState } from "react"

export default function NewPasswordView() {

    const [token, setToken] = useState<ConfirmToken['token']>('') 
    const [isValidToken, setIsValidToken] = useState(false)
    return (
        <>
            <h1 className="text-5xl font-black text-white text-center">Restablecer Contraseña</h1>
            <p className="text-2xl font-light text-white text-center mt-5">
                Introduce el código que has recibido {''}
                <span className=" text-indigo-400 font-bold"> por correo</span>
            </p>

            {!isValidToken ? 
                <NewPasswordToken token={token} setToken={setToken} setIsValidToken={setIsValidToken}/> : 
                <NewPasswordForm token={token}/>
            }

        </>
    )
}
