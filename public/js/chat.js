const socket = io()

const form = document.querySelector('#message-form')
//const input = document.querySelector('input')
form.addEventListener('submit', (e)=>{
    e.preventDefault() // prevents default refresh page action
    //const message = input.value
    const message = e.target.elements.message.value
    socket.emit('sendMessage',message)
})

socket.on('message', (message)=>{
    console.log(message)
})

document.querySelector('#send-location').addEventListener('click', (e)=>{
    
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser')
    }

    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    })
})