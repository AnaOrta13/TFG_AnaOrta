import type { Request, Response } from "express"
import bcrypt from "bcrypt"
import Auth from "../models/Auth"
import Token from "../models/Token"
import { hashPassword } from "../../utils/auth"
import { generateToken } from "../../utils/token"
import { AuthEmail } from "../emails/AuthEmail"
import { generateJWT } from "../../utils/jwt"
import { check } from "express-validator"

export class AuthController {

    static createAccount = async (req: Request, res: Response) => {
        try {
            const { password, email } = req.body

            const userExists = await Auth.findOne({ email })
            if (userExists) {
                const error = new Error('El email ya está registrado')
                return res.status(400).json({ error: error.message })
            }

            //create new user
            const auth = new Auth(req.body)

            //hash password
            auth.password = await hashPassword(password)

            //generate token
            const token = new Token()
            token.token = generateToken()
            token.user = auth._id

            //send email
            AuthEmail.sendConfirmationEmail({
                email: auth.email,
                name: auth.name,
                token: token.token
            })

            await Promise.allSettled([auth.save(), token.save()])

            res.send('Cuenta creada correctamente. Revisa tu email para verificar tu cuenta')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const { token } = req.body

            const tokenExists = await Token.findOne({ token })
            if (!tokenExists) {
                const error = new Error('Token no válido')
                return res.status(401).json({ error: error.message })
            }

            const user = await Auth.findById(tokenExists.user)

            if (!user) {
                const error = new Error('Usuario no encontrado')
                return res.status(404).json({ error: error.message })
            }

            user.confirmed = true

            await Promise.allSettled([user.save(), tokenExists.deleteOne()])
            res.send('Cuenta verificada correctamente')

        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body

            const user = await Auth.findOne({ email })

            if (!user) {
                const error = new Error('Usuario no encontrado')
                return res.status(404).json({ error: error.message })
            }

            if (!user.confirmed) {

                const token = new Token()
                token.user = user._id
                token.token = generateToken()
                await token.save()

                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })

                const error = new Error('Usuario no verificado, hemos enviado un nuevo email de confirmación')
                return res.status(404).json({ error: error.message })
            }

            //compare password
            const matchPassword = await bcrypt.compare(password, user.password)
            if (!matchPassword) {
                const error = new Error('Contraseña incorrecta')
                return res.status(401).json({ error: error.message })
            }

            const token = generateJWT({id: user._id})

            res.send(token)

        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }



    static requestConfirmationCode = async (req: Request, res: Response) => {
        try {
            const { email } = req.body

            const user = await Auth.findOne({ email })
            if (!user) {
                const error = new Error('El email no está registrado')
                return res.status(404).json({ error: error.message })
            }

            if (user.confirmed) {
                const error = new Error('El usuario ya está confirmado')
                return res.status(403).json({ error: error.message })
            }

            //generate token
            const token = new Token()
            token.token = generateToken()
            token.user = user._id

            //send email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])

            res.send('Se ha enviado un nuevo token a tu email...')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static forgotPassword = async (req: Request, res: Response) => {
        try {
            const { email } = req.body

            const user = await Auth.findOne({ email })
            if (!user) {
                const error = new Error('El email no está registrado')
                return res.status(404).json({ error: error.message })
            }

            //generate token
            const token = new Token()
            token.token = generateToken()
            token.user = user._id
            await token.save()

            //send email
            AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token
            })

            res.send('Revisa tu email para instrucciones de restablecimiento de contraseña...')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }


    static validateToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.body

            const tokenExists = await Token.findOne({ token })
            if (!tokenExists) {
                const error = new Error('Token no válido')
                return res.status(401).json({ error: error.message })
            }

            res.send('Token válido, establece tu nueva contraseña')

        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static updatePasswordWithToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.params
            const { password } = req.body

            const tokenExists = await Token.findOne({ token })
            if (!tokenExists) {
                const error = new Error('Token no válido')
                return res.status(404).json({ error: error.message })
            }

            const user = await Auth.findById(tokenExists.user)

            //
            if (!user) {
                const error = new Error('Usuario no encontrado')
                return res.status(404).json({ error: error.message })
            }
 
            user.password = await hashPassword(password)

            await Promise.allSettled([user.save(), tokenExists.deleteOne()])

            res.send('La contraseña se ha actualizado correctamente...')

        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static user = async (req: Request, res: Response) => {
       return res.json(req.user)
    }



    static updateProfile = async (req: Request, res: Response) => {
        const { name, email } = req.body

        const userExists = await Auth.findOne({ email })
        if(userExists && userExists._id.toString() !== req.user?._id.toString() ) {
            const error = new Error('El email ya está registrado' )
            return res.status(400).json({ error: error.message })
        }

        if (!req.user) {
            return res.status(404).json({ error: 'Usuario no encontrado' })
        }

        req.user.name = name
        req.user.email = email

        try {
            await req.user.save()
            res.send('Perfil actualizado correctamente')
        } catch (error) {   
            res.status(500).json({ error: 'Hubo un error' })
        }

    }

    static updateCurrentPassword = async (req: Request, res: Response) => {
        const { current_password, password } = req.body

        const user = await Auth.findById(req.user?._id)

        /**Si no funciona el de abajo, poner este */

        const matchPassword = await bcrypt.compare(current_password, user?.password || '')
        if (!matchPassword) {
            const error = new Error('Contraseña incorrecta')
            return res.status(401).json({ error: error.message })
        }     

        try {
            if (user) {
                user.password = await hashPassword(password)
                await user.save()
                res.send('La contraseña se ha actualizado correctamente')
            } else {
                throw new Error('Usuario no encontrado')
            }
        } catch (error) {   
            res.status(500).send('Hubo un error')
        } 

        // el original 
 /*       const matchPassword = await checkPassword(current_password, user?.password)
   
        if(!matchPassword) {
            const error = new Error('La contraseña actual es incorrecta')
            return res.status(401).json({ error: error.message })
        } 

        try {
            user.password = await hashPassword(password)
            await user?.save()
            res.send('La contraseña se ha actualizado correctamente')
        } catch (error) {   
            res.status(500).send('Hubo un error')
        } 
*/      


    }

    static checkPassword = async (req: Request, res: Response) => {
        const { password } = req.body
        const user = await Auth.findById(req.user?._id)

        const matchPassword = await bcrypt.compare(password, user?.password || '')
        if (!matchPassword) {
            const error = new Error('Contraseña incorrecta')
            return res.status(401).json({ error: error.message })
        }     

        res.send('Contraseña correcta')
    }

}



