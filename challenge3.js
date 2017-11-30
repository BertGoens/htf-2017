let Particle = require('particle-api-js');
let particle = new Particle();
let token;
let fnPr;
let testInt = 60;
particle.login({username: 'aagje.reynders@craftworkz.be', password: 'htf123'}).then(
    function(data) {
        token = data.body.access_token;
        /*let devicesPr = particle.listDevices({ auth: token });
        devicesPr.then(
            function(devices){
                console.log('Devices: ', devices);
            },
            function(err) {
                console.log('List devices call failed: ', err);
            }
        );*/

        /*particle.getVariable({ deviceId: '270023000847343337373738', name: 'pos', auth: token }).then(function(data) {
            console.log('Device variable retrieved successfully:', data.body.result);
        }, function(err) {
            console.log('An error occurred while getting attrs:', err);
        });*/

        /*fnPr = particle.callFunction({ deviceId: '270023000847343337373738', name: 'setPosition', argument: ''+testInt, auth: token });

        fnPr.then(
            function(data) {
                console.log('Function called succesfully:', data);
            }, function(err) {
                console.log('An error occurred:', err);
            });*/

        /*for(let i = 0; i <= 180; i+=10){
            var fnPr = particle.callFunction({ deviceId: '270023000847343337373738', name: 'setPosition', argument: "'" + i + "'", auth: token });

            fnPr.then(
                function(data) {
                    console.log('Function called succesfully:', data);
                }, function(err) {
                    console.log('An error occurred:', err);
                });
        }*/

        /*var fnPr = particle.callFunction({ deviceId: '270023000847343337373738', name: 'shoot', auth: token });

        fnPr.then(
            function(data) {
                console.log('Function called succesfully:', data);
            }, function(err) {
                console.log('An error occurred:', err);
            });*/
        getCurrentPosition();
        setCannon(70);

    },
    function (err) {
        console.log('Could not log in.', err);
    }
);

/*setTimeout(function(){ console.log(token) }, 1000);
console.log(token);*/
function setCannon(position){
    if (position < 40 || position > 90){
        console.log('These are not optimal shooting angles, choose something between 40 and 90 degrees.')
    }
    else{
    particle.getVariable({ deviceId: '270023000847343337373738', name: 'pos', auth: token }).then(function(data) {
        currentPos = data.body.result;
        if (position > currentPos){
            for(currentPos; currentPos < position+10 ; currentPos+=5){
                if (currentPos > position) { currentPos = position}

                fnPr = particle.callFunction({ deviceId: '270023000847343337373738', name: 'setPosition', argument: ''+currentPos, auth: token });
                fnPr.then(
                    function(data) {
                        console.log('Function called succesfully:', data);
                    }, function(err) {
                        console.log('An error occurred:', err);
                    });
            }
        }
        else if (position < currentPos){
            for(currentPos; currentPos > position+10 ; currentPos-=5){
                if (currentPos < position) { currentPos = position}

                fnPr = particle.callFunction({ deviceId: '270023000847343337373738', name: 'setPosition', argument: ''+currentPos, auth: token });
                fnPr.then(
                    function(data) {
                        console.log('Function called succesfully:', data);
                    }, function(err) {
                        console.log('An error occurred:', err);
                    });
            }
        }
        else if (position === currentPos){ console.log('The cannon is already at this position.')}

    }, function(err) {
        console.log('An error occurred while getting attrs:', err);
    })}

}

function getCurrentPosition(){
    particle.getVariable({ deviceId: '270023000847343337373738', name: 'pos', auth: token }).then(function(data) {
        console.log('Device variable retrieved successfully:', data.body.result);
    }, function(err) {
        console.log('An error occurred while getting attrs:', err);
    });
}
