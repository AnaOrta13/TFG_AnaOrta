import Logo from '@/components/Logo'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

export default function AuthLayout() {
    return (
        <>
            <div className='bg-gray-900 min-h-screen'>
                <div className='py-10 lg:py-20 mx-auto w-[505px]  '>

                    <div className='w-64 mx-auto'>
                        <Logo />
                    </div>


                    <div className='mt-10'>
                        <Outlet />
                    </div>
                </div>
            </div>

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
