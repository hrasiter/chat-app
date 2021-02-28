const socket = io()

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')


//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
$messageForm.addEventListener('submit', (e)=>{
    e.preventDefault() // prevents default refresh page action
   
    $messageFormButton.setAttribute('disabled', 'disabled')
    //const message = input.value
    const message = e.target.elements.message.value
    socket.emit('sendMessage',message, (error)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=''
        $messageFormInput.focus()
        if(error){
            return console.log(error)
        }
    })
})

$sendLocationButton.addEventListener('click', (e)=>{
    $sendLocationButton.setAttribute('disabled', 'disabled')
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser')
    }

    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, ()=>{
            $sendLocationButton.removeAttribute('disabled')          
        })
    })
})

socket.on('message', (message)=>{
    const  html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm:ss a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (locationurl)=>{
    const html = Mustache.render(locationTemplate, {
        url: locationurl.url,
        createdAt: moment(locationurl.createdAt).format('h:mm:ss a')
    })
    $messages.insertAdjacentHTML('beforeend', html)

})