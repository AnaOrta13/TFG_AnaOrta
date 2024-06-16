import mongoose from 'mongoose'
import colors from 'colors'
import { exit } from 'node:process';

/*function fixingError(DATABASE_URL: string | undefined) {
    if(typeof DATABASE_URL === 'string') console.log(DATABASE_URL.toUpperCase())
        else console.log("Argument is undefined")
}*/


export const connectDB = async () => {
    try {        
        const {connection} = await mongoose.connect(process.env.DATABASE_URL || '')      
        console.log(connection)        
        const url = `${connection.host}:${connection.port}`        
        console.log(colors.cyan.bold(`MongoDB conectada en: ${url}`))
    } catch (error) {
        console.log(console.log(colors.red.bold('Error al conenctar a la base de datos')))
        exit(1)
    }
} 