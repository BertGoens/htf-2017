const cognitive = require('cognitive-services')
const config = require('./config')
const glob = require('glob')
const { join } = require('path')
const { lstatSync, readdirSync, writeFile } = require('fs')

let pretenders

const faceDir = join(__dirname, 'pretenders')
// options is optional

const isDirectory = source => lstatSync(source).isDirectory()
const getDirectories = source =>
  readdirSync(source)
    .map(name => join(source, name))
    .filter(isDirectory)
pretenders = getDirectories(faceDir)

var result = {}
for (let i = 0; i < pretenders.length; i++) {
  const folderPath = pretenders[i]
  const name = folderPath.substr(folderPath.lastIndexOf('/') + 1)
  result[name] = {}
  result[name].path = folderPath
}

for (let i = 0; i < pretenders.length; i++) {
  const element = pretenders[i]
  const name = element.substr(element.lastIndexOf('/') + 1)

  result[name].files = glob.sync(element + '/**/*.*')
}

writeFile(__dirname + '/test.json', JSON.stringify(result), function(err) {
  if (err) {
    return console.log(err)
  }
})

const face = new cognitive.face({
  apiKey: config.ms.key,
  endpoint: config.ms.endpoint,
})

// Create a person group
// for every group

function createGroup({ group }) {
  const groupId = group

  const parameters = {
    personGroupId: groupId,
  }
  const headers = {
    'Content-type': 'application/json',
  }
  const body = {
    name: 'minister imposters: ' + groupId,
  }

  face
    .createAPersonGroup({
      parameters,
      headers,
      body,
    })
    .then(response => {
      console.log('created groupid ' + groupId)

      // create a person
      headers = {
        'Content-type': 'application/json',
      }
      body = {
        name: 'johndoe',
      }
      parameters = {
        personGroupId: personGroupId,
      }

      return face.createAPerson({
        parameters,
        headers,
        body,
      })
    })
    .catch(err => {
      console.error(err)
    })
}

//function populateGroup() {}

createGroup(result['minister1'])
