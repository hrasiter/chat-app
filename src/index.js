const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage, generateLocationMessage} = require('./utils/messages')
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')

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

    socket.on('join', (/*{username, room}*/options, callback)=>{
        
        const {error, user} = addUser({id: socket.id, ...options})

        if(error){
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage('Admin','Welcome!'));
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    })

    socket.on('sendMessage', (message, callback)=>{
        const filter = new Filter()

        if(filter.isProfane(message)){
            return callback('Profanity is not allowed!')
        }

        const user = getUser(socket.id)

        if(user){
            io.to(user.room).emit('message', generateMessage(user.username, message))
        }

        callback()
    })

    socket.on('sendLocation', (position, callback)=>{
        const user = getUser(socket.id)
        if(user)
            io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${position.latitude},${position.longitude}`))
        callback()
    })

    socket.on('disconnect', ()=>{
        const user = removeUser(socket.id)

        if(user){
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
        
    })
})


server.listen(port, ()=>{
    console.log('Listening on port ' + port)
})