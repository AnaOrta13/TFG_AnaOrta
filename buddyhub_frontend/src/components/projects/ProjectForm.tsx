import { UseFormRegister, FieldErrors } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import { ProjectFormData } from "types";

type ProjectFormProps = {
    register: UseFormRegister<ProjectFormData>
    errors: FieldErrors<ProjectFormData>
}

export default function ProjectForm({errors, register} : ProjectFormProps ){
    return (
        <>
            <div className="mb-5 space-y-3">
                <label htmlFor="projectName" className="text-sm uppercase font-bold">
                    Nombre del Proyecto
                    <span className="text-red-500"> *</span>
                </label>
                <input
                    id="projectName"
                    className="w-full p-3 border border-gray-200"
                    type="text"
                    placeholder="Nombre del Proyecto"
                    {...register("projectName", {
                        required: "El Titulo del Proyecto es obligatorio",
                    })}
                />

                {errors.projectName && (
                    <ErrorMessage>{errors.projectName.message}</ErrorMessage>
                )}
            </div>

            <div className="mb-5 space-y-3">
                <label htmlFor="teamName" className="text-sm uppercase font-bold">
                    Nombre del equipo
                    <span className="text-red-500"> *</span>
                </label>
                <input
                    id="teamName"
                    className="w-full p-3  border border-gray-200"
                    type="text"
                    placeholder="Nombre del Equipo"
                    {...register("teamName", {
                        required: "El Nombre del Equipo es obligatorio",
                    })}
                />

                {errors.teamName && (
                    <ErrorMessage>{errors.teamName.message}</ErrorMessage>
                )}
            </div>

            <div className="mb-5 space-y-3">
                <label htmlFor="description" className="text-sm uppercase font-bold">
                    Descripción
                    <span className="text-red-500"> *</span>
                </label>
                <textarea
                    id="description"
                    className="w-full p-3  border border-gray-200"
                    placeholder="Descripción del Proyecto"
                    {...register("description", {
                        required: "Una descripción del proyecto es obligatoria"
                    })}
                />

                {errors.description && (
                    <ErrorMessage>{errors.description.message}</ErrorMessage>
                )}
            </div>
        </>
    )
}