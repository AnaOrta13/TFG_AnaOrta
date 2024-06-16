import { Link } from "react-router-dom";


export default function NotFound() {
  return (
    <>
        <h1 className="text-4xl font-bold text-center text-white font-black">Página no encontrada</h1>
        <p className="mt-10 text-xl text-center text-white">
            Tal vez quieras volver a {' '}
            <Link 
                className="text-indigo-500 text-xl font-bold"
                to={`/`} 
            >Proyectos</Link>
        </p>
    </>
  )
}
