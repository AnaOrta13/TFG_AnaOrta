import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { Bars3Icon } from '@heroicons/react/20/solid'
import { Link } from 'react-router-dom'
import { User } from '../types'
import { useQueryClient } from '@tanstack/react-query'

type MenuProps = {
  name: User['name']
}

export default function Menu( {name}: MenuProps ) {

  const queryClient = useQueryClient()
  const logout = () => {
    localStorage.removeItem('AUTH_TOKEN')
    queryClient.invalidateQueries({queryKey: ['user']})
  }

  return (
    <Popover className="relative">
      <Popover.Button className="relative inline-flex items-center gap-x-2 text-sm font-semibold leading-6 p-2 rounded-lg bg-indigo-400 text-white overflow-hidden hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
  <Bars3Icon className='w-6 h-6' />
  <span>Menú</span>
  <span className="absolute inset-0 bg-white opacity-0 transition duration-500 ease-out transform scale-150 hover:scale-100 hover:opacity-10"></span>
</Popover.Button>


      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute left-1/2 z-10 mt-5 flex w-screen lg:max-w-min -translate-x-1/2 lg:-translate-x-48">
          <div className="w-full lg:w-56 shrink rounded-xl bg-white p-4 text-sm font-semibold leading-6 text-gray-900 shadow-lg ring-1 ring-gray-900/5">
            <p className='text-center font-bold'>Hola {name}</p>
            <Link
              to='/profile'
              className='block p-2 hover:text-indigo-800 hover:font-bold'
            >Mi Perfil</Link>
            <Link
              to='/'
              className='block p-2 hover:text-indigo-800 hover:font-bold'
            >Mis Proyectos</Link>
            <button
              className='block p-2 hover:text-indigo-800 hover:font-bold'
              type='button'
              onClick={logout}
            >
              Cerrar sesión
            </button>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}