import type { ConfirmToken, NewPasswordForm } from "../../types";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/components/ErrorMessage";
import { updatePasswordWithToken } from "@/api/AuthAPI";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

type NewPasswordFormProps = {
    token: ConfirmToken['token']
}

export default function NewPasswordForm({token}: NewPasswordFormProps) {
    const navigate = useNavigate()
    const initialValues: NewPasswordForm = {
        password: '',
        confirmPassword: '',
    }
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({ defaultValues: initialValues });

    const {mutate} = useMutation({
        mutationFn: updatePasswordWithToken,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            reset()
            navigate('/auth/login')
        }
    })

    const handleNewPassword = (formData: NewPasswordForm) => {
        const data = {
            formData,
            token
        }
        mutate(data)
    }

    const password = watch('password');

    return (
        <>
            <form
                onSubmit={handleSubmit(handleNewPassword)}
                className="space-y-8 p-10 mt-10 bg-gray-900"
                noValidate
            >

                <div className="flex flex-col gap-5">
                    <label
                        className="font-normal text-2xl text-center text-white"
                    >Contraseña
                    <span className="text-red-500"> *</span>
                    </label>

                    <input
                        type="password"
                        placeholder="Contraseña de Registro"
                        className="w-full p-3  border-gray-300 border"
                        {...register("password", {
                            required: "La Contraseña es obligatoria",
                            minLength: {
                                value: 6,
                                message: 'La Contraseña debe ser mínimo de 6 caracteres'
                            }
                        })}
                    />
                    {errors.password && (
                        <ErrorMessage>{errors.password.message}</ErrorMessage>
                    )}
                </div>

                <div className="flex flex-col gap-5">
                    <label
                        className="font-normal text-2xl text-center text-white"
                    >Repetir Contraseña
                    <span className="text-red-500"> *</span>
                    </label>

                    <input
                        id="password_confirmation"
                        type="password"
                        placeholder="Repite Contraseña"
                        className="w-full p-3  border-gray-300 border"
                        {...register("confirmPassword", {
                            required: "Repetir Contraseña es obligatorio",
                            validate: value => value === password || 'Las Contraseñas no son iguales'
                        })}
                    />

                    {errors.confirmPassword && (
                        <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>
                    )}
                </div>

                <input
                    type="submit"
                    value='Establecer Contraseña'
                    className="bg-pink-500 hover:bg-pink-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
                />
            </form>
        </>
    )
}