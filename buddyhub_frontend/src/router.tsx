import { BrowserRouter, Routes, Route} from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import DashboardView from '@/views/DashboardView'
import CreateProjectView from './views/projects/CreateProjectView'
import EditProjectView from './views/projects/EditProjectView'
import ProjectDetailsView from './views/projects/ProjectDetailsView'
import AuthLayout from './layouts/AuthLayout'
import LoginView from './views/auth/LoginView'
import RegisterView from './views/auth/RegisterView'
import ConfirmAccountView from './views/auth/ConfirmAccountView'
import RequestNewCodeView from './views/auth/RequestNewCodeView'
import ForgotPasswordView from './views/auth/ForgotPasswordView'
import NewPasswordView from './views/auth/NewPasswordView'
import ProjectTeamView from './views/projects/ProjectTeamView'
import ProfileView from './views/profile/ProfileView'
import ChangePasswordView from './views/profile/ChangePasswordView'
import ProfileLayout from './layouts/ProfileLayout'
import NotFound from './views/404/NotFound'

function Router() {

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path='/' element={<DashboardView/>} index/>
                    <Route path='/projects/createProject' element={<CreateProjectView/>} />
                    <Route path='/projects/:projectId' element={<ProjectDetailsView/>} />
                    <Route path='/projects/:projectId/editProject' element={<EditProjectView/>} />
                    <Route path='/projects/:projectId/team' element={<ProjectTeamView/>} />
                    <Route element={<ProfileLayout />}>
                        <Route path='/profile' element={<ProfileView/>} />
                        <Route path='/profile/password' element={<ChangePasswordView/>} />
                    </Route>
                </Route>

                <Route element={<AuthLayout />}>
                    <Route path='/auth/login' element={<LoginView />} />
                    <Route path='/auth/register' element={<RegisterView />} />
                    <Route path='/auth/confirm-account' element={<ConfirmAccountView />} />
                    <Route path='/auth/request-code' element={<RequestNewCodeView />} />
                    <Route path='/auth/forgot-password' element={<ForgotPasswordView />} />
                    <Route path='/auth/new-password' element={<NewPasswordView />} />
                </Route>

                <Route element={<AuthLayout />}>
                    <Route path='/404' element={<NotFound />} />
                </Route> 


            </Routes>
        </BrowserRouter>
    )

}

export default Router