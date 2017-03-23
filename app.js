var http = require('http');
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('config.json'));

var buzzerURL = config.arduinoBase + '/arduino/tone/' + config.buzzerPort + '/1000';

var LEDPath = '/arduino/digital/' + config.LEDPort + '/';

var currentState = 0;
var prevState = 0;
setInterval(function() {
    http.get(config.pollURL + '/index.html', function(resp) {
        if (resp.statusCode !== 200) {
            currentState = 0;
            run();
        } else {
            currentState = 1;
            run();
        }
    }).on("error", function(e) {
        currentState = 0;
        run();
    });
}, 2000);

function run() {
    if (currentState != prevState) {
        http.get(buzzerURL);
        http.get(config.arduinoBase + LEDPath + currentState);
        prevState = currentState;
    }
}