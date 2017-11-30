const cognitive = require('cognitive-services')
const config = require('./config')
const fs = require('fs');

const face = new cognitive.face({
  apiKey: config.ms.key,
  endpoint: config.ms.endpoint,
})

// Create a person group
// for every group

if (process.argv.length <= 2) {
   console.log("Usage: " + __filename + " path/to/directory");
   process.exit(-1);
}

var path = process.argv[2];

fs.readdir(path, function(err, items) {
   console.log(items);

   for (var i=0; i<items.length; i++) {
       console.log(items[i]);
   }
});

function createGroup({ location }) {
    const groupId = 'minister' + index

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
        console.log(response)
      })
      .catch(err => {
        console.error(err)
      })
  }
}

function populateGroup() {}

createGroup()
