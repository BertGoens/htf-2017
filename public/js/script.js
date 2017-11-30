'use strict'

const socket = io()

const $mic = document.querySelector('#record')
const $outputConfidence = document.querySelector('#output-confidence')
const $outputYou = document.querySelector('.output-you')
const $outputBot = document.querySelector('#output-reply')
const $ouputStatus = document.querySelector('#ouput-status')
const $muteBot = document.querySelector('#output-mute')

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition
const recognition = new SpeechRecognition()

recognition.lang = 'en-US'
recognition.interimResults = false
recognition.maxAlternatives = 1

let listeningStatus = 'stopped'
$mic.addEventListener('click', () => {

  if(listeningStatus === "stopped") {
    listeningStatus = "started"
    recognition.start()
    $mic.style.backgroundColor = 'red'
  } else {
    listeningStatus = "stopped"
    recognition.stop()
    $mic.style.backgroundColor = 'green'
  }
  
})

recognition.addEventListener('speechstart', () => {
  notify('Speech has been detected.')
  // $mic.style.backgroundColor = 'green'
})

recognition.addEventListener('result', e => {
  notify('Speech-result has been formulated.')

  let last = e.results.length - 1
  let text = e.results[last][0].transcript

  $outputYou.textContent = text
  $outputConfidence.textContent = e.results[0][0].confidence

  socket.emit('chat message', text)
})

recognition.addEventListener('speechend', () => {
  notify('Speech has stopped recording.')
  recognition.stop()
  // $mic.style.backgroundColor = ''
})

recognition.addEventListener('error', e => {
  $outputBot.textContent = 'Error: ' + e.error
})

function synthVoice(text) {
  const synth = window.speechSynthesis
  const utterance = new SpeechSynthesisUtterance()
  utterance.text = text
  synth.speak(utterance)
}

socket.on('bot reply', function(replyText) {
  if (!$muteBot.checked) {
    synthVoice(replyText)
  }
  if (replyText == '') replyText = '(No answer...)'
  $outputBot.textContent = replyText
})

socket.on('error', error => {
  notify('error')
})

document.addEventListener('DOMContentLoaded', function(event) {
  const $sendButton = document.querySelector('#send-text')
  const $yourTextInput = document.querySelector('#input-text')

  $sendButton.addEventListener('click', sendTextToChatbot)

  $yourTextInput.onkeypress = function(e) {
    if (e.keyCode == 13) {
      sendTextToChatbot()
    }
  }

  function sendTextToChatbot() {
    const text = $yourTextInput.value
    socket.emit('chat message', text)
  }
})

const notify = message => {
  console.log(message)
  $ouputStatus.textContent = message
}
