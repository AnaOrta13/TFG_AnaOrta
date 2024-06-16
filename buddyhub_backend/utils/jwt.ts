import jwt from 'jsonwebtoken'
import Types from 'mongoose'

type UserPayLoad = {
    id: Types.ObjectId
}

export const generateJWT = (payload: UserPayLoad) => {

    const supersecret = 'supersecret'; 
    const token = jwt.sign(payload, supersecret, { expiresIn: '180d' })

    return token
}