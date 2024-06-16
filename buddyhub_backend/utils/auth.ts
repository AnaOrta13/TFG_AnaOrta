import bcrypt from 'bcrypt'

export const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10) // Genera un salt para el hash
    return password = await bcrypt.hash(password, salt)
}

export const comparePassword = async (enteredPassword: string, storeHash: string) => {
    return await bcrypt.compare(enteredPassword, storeHash)
}