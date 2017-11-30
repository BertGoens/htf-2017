let Particle = require('particle-api-js')
let particle = new Particle()
let token
let fnPr
let testInt = 60
particle
  .login({ username: 'aagje.reynders@craftworkz.be', password: 'htf123' })
  .then(
    function(data) {
      token = data.body.access_token
    },
    function(err) {
      console.log('Could not log in.', err)
    }
  )

function fireCannon() {
  var fnPr = particle.callFunction({
    deviceId: '270023000847343337373738',
    name: 'shoot',
    auth: token,
  })

  fnPr.then(
    function(data) {
      console.log('Function called succesfully:', data)
    },
    function(err) {
      console.log('An error occurred:', err)
    }
  )
}

function getCurrentPosition() {
  particle
    .getVariable({
      deviceId: '270023000847343337373738',
      name: 'pos',
      auth: token,
    })
    .then(
      function(data) {
        return data.body.result
        // console.log('Device variable retrieved successfully:', data.body.result)
      },
      function(err) {
        throw err
        // console.log('An error occurred while getting attrs:', err)
      }
    )
}

function setCannon(position) {
  particle
    .getVariable({
      deviceId: '270023000847343337373738',
      name: 'pos',
      auth: token,
    })
    .then(
      function(data) {
        currentPos = data.body.result
        if (position > currentPos) {
          for (currentPos; currentPos < position; currentPos += 5) {
            if (currentPos > position) {
              currentPos = position
            }
            setTimeout(function() {
              fnPr = particle.callFunction({
                deviceId: '270023000847343337373738',
                name: 'setPosition',
                argument: '' + currentPos,
                auth: token,
              })
              fnPr.then(
                function(data) {
                  console.log('Function called succesfully:', data)
                },
                function(err) {
                  console.log('An error occurred:', err)
                }
              )
            }, 1000)
          }
          setTimeout(function() {
            fnPr = particle.callFunction({
              deviceId: '270023000847343337373738',
              name: 'setPosition',
              argument: '' + position,
              auth: token,
            })
            fnPr.then(
              function(data) {
                console.log('Function called succesfully:', data)
              },
              function(err) {
                console.log('An error occurred:', err)
              }
            )
          }, 1000)
        } else if (position < currentPos) {
          for (currentPos; currentPos > position; currentPos -= 5) {
            if (currentPos < position) {
              currentPos = position
            }
            setTimeout(function() {
              fnPr = particle.callFunction({
                deviceId: '270023000847343337373738',
                name: 'setPosition',
                argument: '' + currentPos,
                auth: token,
              })
              fnPr.then(
                function(data) {
                  console.log('Function called succesfully:', data)
                },
                function(err) {
                  console.log('An error occurred:', err)
                }
              )
            }, 1000)
          }
          setTimeout(function() {
            fnPr = particle.callFunction({
              deviceId: '270023000847343337373738',
              name: 'setPosition',
              argument: '' + position,
              auth: token,
            })
            fnPr.then(
              function(data) {
                console.log('Function called succesfully:', data)
              },
              function(err) {
                console.log('An error occurred:', err)
              }
            )
          }, 1000)
        } else if (position === currentPos) {
          console.log('The cannon is already at this position.')
        }
      },
      function(err) {
        console.log('An error occurred while getting attrs:', err)
      }
    )
}

module.exports = {
  getCurrentPosition: getCurrentPosition,
  setCannon: setCannon,
  fireCannon: fireCannon,
}
