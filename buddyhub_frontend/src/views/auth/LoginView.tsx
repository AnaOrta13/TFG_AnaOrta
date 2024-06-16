import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { UserLoginForm } from "@/types/index";
import ErrorMessage from "@/components/ErrorMessage";
import { authenticateUser } from "@/api/AuthAPI";
import { toast } from "react-toastify";


export default function LoginView() {

  const initialValues: UserLoginForm = {
    email: '',
    password: '',
  }
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })
  const navigate = useNavigate()

  const { mutate } = useMutation({
    mutationFn: authenticateUser,
    onError: (error) => toast.error(error.message),
    onSuccess: () => {
      navigate('/')
    }
  })

  const handleLogin = (formData: UserLoginForm) => mutate(formData)

  return (
    <>
      <h1 className="text-5xl font-black text-white text-center">Iniciar Sesión</h1>
      <p className="text-2xl font-light text-white text-center mt-5">
        Empieza a planificar tus proyectos {''}
        <span className=" text-indigo-400 font-bold"> iniciando sesión en este formulario</span>
      </p>

      <form
        onSubmit={handleSubmit(handleLogin)}
        className="space-y-8 p-10 mt-10 bg-gray-900 border-indigo-300 "
        noValidate
      >
        <div className="flex flex-col gap-5">
          <label
            className="font-normal text-2xl text-white text-center"
          >Email</label>

          <input
            id="email"
            type="email"
            placeholder="Email"
            className="w-full p-3  border-gray-300 border "
            {...register("email", {
              required: "El Email es obligatorio",
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
            className="font-normal text-2xl  text-white text-center"
          >Contraseña</label>

          <input
            type="password"
            placeholder="Contraseña"
            className="w-full p-3  border-gray-300 border"
            {...register("password", {
              required: "La Contraseña es obligatoria",
            })}
          />
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>

        <input
          type="submit"
          value='Iniciar Sesión'
          className="bg-pink-500 hover:bg-pink-600 w-full p-3  text-white font-black  text-xl cursor-pointer"
        />
      </form>

      <nav className="flex justify-center mt-10">
        <Link
          to="/auth/register"
          className="text-white font-bold text-center mr-5"
        >¿No tienes cuenta? Crear una cuenta</Link>

        <Link
          to="/auth/forgot-password"
          className="text-white font-bold text-center"
        >¿Olvidaste tu contraseña? Restablecer</Link>
      </nav>
    </>
  )
}