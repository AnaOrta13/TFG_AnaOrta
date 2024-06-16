import { transporter } from '../config/nodemailer'

interface IEmail{
    email: string
    name: string
    token: string
}

export class AuthEmail {
    static sendConfirmationEmail = async ( auth : IEmail)  => {
        const info = await transporter.sendMail({
            from: 'BuddyHub <admin@buddyhub.com>',
            to: auth.email,
            subject: 'BuddyHub - Verificación de cuenta',
            text: 'BuddyHub - Verificación de cuenta',
            html: `<p>¡Hola ${auth.name}!</p>
                <p>Has creado tu cuenta en BuddyHub, ya asi está todo listo!</p>
                <p>Para confirmar tu cuenta, haz click en el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar cuenta</a>
                <p>E ingresa el siguiente código: <b>${auth.token} </b></p>
                <p>Este token expirará en 30 minutos</p>
            `
        })

        console.log('Mensaje enviado', info.messageId)

    }

    static sendPasswordResetToken = async ( auth : IEmail)  => {
        const info = await transporter.sendMail({
            from: 'BuddyHub <admin@buddyhub.com>',
            to: auth.email,
            subject: 'BuddyHub - Restablece tu contraseña',
            text: 'BuddyHub - Restablece tu contraseña',
            html: `<p>¡Hola ${auth.name}!</p>
                <p>Has solicitado restablecer tu contraseña</p>
                <p>Para restablecer tu contraseña, haz click en el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/auth/new-password">Restablecer Contraseña</a>
                <p>E ingresa el siguiente código: <b>${auth.token} </b></p>
                <p>Este token expirará en 30 minutos</p>
            `
        })

        console.log('Mensaje enviado', info.messageId)

    }

}