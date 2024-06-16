import { Link, Outlet, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Logo from '@/components/Logo'
import Menu from '@/components/Menu'
import { useAuth } from '@/hooks/useAuth'

export default function MainLayout() {

    const { data, isError, isLoading } = useAuth()

    if(isLoading) return 'Cargando...'
    if(isError) {
        return <Navigate to='/auth/login' />
    }

    if(data) return (

        <>
            <header className='bg-gray-900 py-5'>
                <div className=' max-w-screen-2xl mx-auto flex flex-col lg:flex-row justify-between items-center'>
                    <div className='w-64 mx-auto'>
                        <Link to={'/'}>
                            <Logo />
                        </Link>
                    </div>

                    <Menu
                        name={data.name}                    
                    />
                </div>
            </header>

            <section className=' max-w-screen-2xl mx-auto mt-10 p-5'>
                <Outlet />
            </section>

            <footer className='py-5'>
                <p className='text-center'>
                    Trabajo de Fin de Grado - Ana Orta Borrero
                </p>

            </footer>

            <ToastContainer
                pauseOnHover={false}
                pauseOnFocusLoss={false}

                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                rtl={false}
                draggable
                theme="light"
            />

        </>

    )
}