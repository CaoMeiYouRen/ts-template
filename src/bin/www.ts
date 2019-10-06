import * as debug from 'debug'
import * as http from 'http'
import * as https from 'https'
import path = require('path')
import fs = require('fs')
import { Server } from '../app'

const options = {
    // key: fs.readFileSync(path.join(__dirname, '../config/ssl/api.cmyr.ltd.key'), 'utf8'),
    // cert: fs.readFileSync(path.join(__dirname, '../config/ssl/api.cmyr.ltd.pem'), 'utf8'),
}

const iDebugger = debug('express:server')

/**
 * Get port from environment and store in Express.
 */
const httpPort = normalizePort(process.env.PORT || 5100)
const app = new Server().app
app.set('port', httpPort)
const httpServer = http.createServer(app)
const httpsServer = https.createServer(options, app)
// listen on provided ports
if (process.env.NODE_ENV === 'dev') {
    httpServer.on('error', onError)
    httpServer.on('listening', onListening)
    httpServer.listen(httpPort)
} else {
    //生产环境启用https
    httpsServer.on('error', onError)
    httpsServer.on('listening', onListening)
    httpsServer.listen(httpPort)
}




/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val): number {
    const port = parseInt(val, 10)

    if (isNaN(port)) {
        // named pipe
        return val
    }

    if (port >= 0) {
        // port number
        return port
    }

    throw new Error('cannot resolve port.')
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error: any): void {
    if (error.syscall !== 'listen') {
        throw error
    }
    const bind = typeof httpPort === 'string'
        ? `Pipe ${httpPort}`
        : `Port ${httpPort}`

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`)
            process.exit(1)
            break
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`)
            process.exit(1)
            break
        default:
            throw error
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening(): void {
    if (process.env.NODE_ENV === 'dev') {
        console.log(`运行端口为  http://127.0.0.1:${httpPort}`)
        console.log(`接口文档http://127.0.0.1:${httpPort}/robot/v2.0/docs/`)
    } else {
        console.log(`运行端口为  https://127.0.0.1:${httpPort}`)
    }
}
process.on('uncaughtException', (err) => {
    console.error(err)
})
