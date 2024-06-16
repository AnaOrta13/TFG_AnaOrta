import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { UserRegistrationForm } from "@/types/index";
import ErrorMessage from "@/components/ErrorMessage";
import { createAccount } from "@/api/AuthAPI";
import { toast } from "react-toastify";

export default function RegisterView() {

  const initialValues: UserRegistrationForm = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  }

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<UserRegistrationForm>({ defaultValues: initialValues });

  const { mutate } = useMutation({
    mutationFn: createAccount,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (data) => {
      toast.success(data)
      reset()
    }
  })


  const password = watch('password');

  const handleRegister = (formData: UserRegistrationForm) => mutate(formData)

  return (
    <>
      <h1 className="text-5xl font-black text-white text-center">Crear Cuenta</h1>
      <p className="text-2xl font-light text-white text-center mt-5">
        Llena el formulario para {''}
        <span className=" text-indigo-400 font-bold"> crear tu cuenta</span>
      </p>

      <form
        onSubmit={handleSubmit(handleRegister)}
        className="space-y-8 p-10 p-10 bg-gray-900 border-indigo-300 "
        noValidate
      >
        <div className="flex flex-col gap-5 ">
          <label
            className="font-normal text-2xl text-white text-center"
            htmlFor="email"
          >Email
          <span className="text-red-500"> *</span>
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            className="w-full p-3  border-gray-300 border"
            {...register("email", {
              required: "El Email de registro es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Email no válido",
              },
            })}
          />
          {errors.email && (
            <ErrorMessage>{errors.email.message}</ErrorMessage>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <label
            className="font-normal text-2xl text-white text-center"
          >Nombre
          <span className="text-red-500"> *</span>
          </label>
          <input
            type="name"
            placeholder="Nombre"
            className="w-full p-3  border-gray-300 border"
            {...register("name", {
              required: "El Nombre de usuario es obligatorio",
            })}
          />
          {errors.name && (
            <ErrorMessage>{errors.name.message}</ErrorMessage>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <label
            className="font-normal text-2xl text-white text-center"
          >Contraseña
          <span className="text-red-500"> *</span>
          </label>

          <input
            type="password"
            placeholder="Contraseña"
            className="w-full p-3  border-gray-300 border"
            {...register("password", {
              required: "La contraseña es obligatoria",
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
            className="font-normal text-2xl text-white text-center"
          >Repetir Contraseña
          <span className="text-red-500"> *</span>
          </label>

          <input
            id="confirmPassword"
            type="password"
            placeholder="Repite la Contraseña"
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
          value='Registrarme'
          className="bg-pink-500 hover:bg-pink-600 w-full p-3  text-white font-black  text-xl cursor-pointer"
        />
      </form>

      <nav className="flex justify-center mt-10">
        <Link
          to="/auth/login"
          className="text-white font-bold text-center mr-5"
        >¿Ya tienes cuenta? Iniciar sesión</Link>

        <Link
          to="/auth/forgot-password"
          className="text-white text-center font-bold"
        >¿Olvidaste tu contraseña? Restablecer</Link>
      </nav>

    </>
  )
}