const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const publicdir = path.join(__dirname, '../public')
//Setup static directory to serve



app.use(express.static(publicdir))

const port = process.env.PORT || 3000

//let count = 0

io.on('connection', (socket)=> {
    console.log('New connection')
    socket.emit('message', 'Welcome!');
    socket.broadcast.emit('message', 'A new user has joined!')
    // socket.emit('countUpdated', count)

    // socket.on('increment', ()=>{
    //     count++
    //     console.log('incremented')
    //     //socket.emit('countUpdated', count)
    //     io.emit('countUpdated', count)
    // })

    socket.on('sendMessage', (message)=>{
        console.log('message received ', message)
        io.emit('message', message)
    })

    socket.on('sendLocation', (position)=>{
        socket.broadcast.emit('message', `https://google.com/maps?q=${position.latitude},${position.longitude}`)
    })

    socket.on('disconnect', ()=>{
        io.emit('message', 'A user has left.')
    })
})


server.listen(port, ()=>{
    console.log('Listening on port ' + port)
})