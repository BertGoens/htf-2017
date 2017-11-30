'use strict'

const config = require('./config')

const express = require('express')
const app = express()
const cannon = require('./challenge3')

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
      console.log(botAction)

      socket.emit('cannon.action', botAction)

      if (botAction === 'cannon.fire') {
        cannon.fireCannon()
      } else if (botAction === 'cannon.raise') {
        const currentPos = cannon.getCurrentPosition()
        let sendPosition = 90
        if (currentPos <= 75) {
          sendPosition = currentPos + 15
        }
        cannon.setCannon(currentPos + 15)
      } else if (botAction === 'cannon.lower') {
        const currentPos = cannon.getCurrentPosition()
        let sendPosition = 0
        if (currentPos >= 15) {
          sendPosition = currentPos - 15
        }
        cannon.setCannon(sendPosition)
      }

      const aiText = response.result.fulfillment.speech

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
