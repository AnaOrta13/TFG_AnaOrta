import colors from 'colors'
import server from './server'

require('dotenv').config();

const port = process.env.PORT || 4444;

server.listen(port, () => {
    console.log( colors.cyan.bold(`REST API working on port ${port}`))
    console.log(process.env.DATABASE_URL)
})