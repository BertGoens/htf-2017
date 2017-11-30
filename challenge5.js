'use strict'

const config = require('./config')

const express = require('express')
const app = express()

app.use(express.static(__dirname + '/views')) // html
app.use(express.static(__dirname + '/public')) // js, css, images

const server = app.listen(5000, '127.0.0.1', () => {
  console.log(
    'Express server listening on http://%s:%d in %s mode',
    server.address().address,
    server.address().port,
    app.settings.env
  )
})

const io = require('socket.io')(server)
io.on('connection', function(socket) {
  console.log('a user connected')
})

const apiai = require('apiai')(config.api.token)

// Web UI
app.get('/', (req, res) => {
  res.sendFile('index.html')
})

io.on('connection', function(socket) {
  socket.on('chat message', text => {
    console.log('Message: ' + text)

    if (!text) {
      return
    }

    // Get a reply from API.ai
    const apiaiReq = apiai.textRequest(text, {
      sessionId: config.api.sessionId,
    })

    apiaiReq.on('response', response => {
      const botAction = response.result.action
      let aiText = response.result.fulfillment.speech

      console.log('Bot reply: ' + aiText)
      socket.emit('bot reply', aiText)
    })

    apiaiReq.on('error', error => {
      console.log(error)
      socket.emit('error')
    })

    apiaiReq.end()
  })
})
