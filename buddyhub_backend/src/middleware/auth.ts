import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import Auth, { IAuth } from '../models/Auth'

declare global {
    namespace Express {
        interface Request {
            user?: IAuth //añade una propiedad user a la interfaz Request
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {

    const bearer = req.headers.authorization
    if (!bearer) {
        const error = new Error('No autorizado')
        return res.status(401).json({ message: error.message })
    }

    const [, token] = bearer.split(' ')

    try {
        const decoded = jwt.verify(token, 'supersecret')

        if (typeof decoded === 'object' && decoded.id) {
            const user = await Auth.findById(decoded.id).select('_id name email')
            if(user) {
                req.user = user
                next()
            } else {
                return res.status(500).json({ error: 'Token no válido' })
            }
        }


    } catch (error) {
        return res.status(500).json({ error: 'Token no válido' })
    }


}