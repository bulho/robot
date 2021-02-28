var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var bodyParser = require('body-parser');
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var motorRF = 0;
var motorRR = 0;
var motorLF = 0;
var motorLR = 0;

var relay1 = new Gpio(22, 'out'); //configures GPIO for motor in the right side forward command
var relay2 = new Gpio(27, 'out'); //configures GPIO for motor in the right side reverse command
var relay3 = new Gpio(17, 'out'); //configures GPIO for motor in the left side forward command
var relay4 = new Gpio(4, 'out'); //configures GPIO for motor in the left side reverse command

//==================================================================
//EXPRESS SETTINGS
//==================================================================
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(__dirname + '/client/dist/client'));
app.get('/', function (req, res) { res.sendfile(__dirname + '/index.html'); });

//==================================================================
//MOTOR CONTROL
//==================================================================

function motorControl(direction) {
  console.log('commanding motor: ' + direction);

  switch (direction) {

    case 'forward':
      motorRF = 1;
      motorLF = 1;
      motorRR = 0;
      motorLR = 0;
      break;

    case 'reverse':
      motorRF = 0;
      motorLF = 0;
      motorRR = 1;
      motorLR = 1;
      break;

    case 'forward-right':
      motorRF = 1;
      motorLF = 0;
      motorRR = 0;
      motorLR = 0;
      break;

    case 'forward-left':
      motorRF = 0;
      motorLF = 1;
      motorRR = 0;
      motorLR = 0;
      break;

    case 'reverse-right':
      motorRF = 0;
      motorLF = 0;
      motorRR = 0;
      motorLR = 1;
      break;

    case 'reverse-left':
      motorRF = 0;
      motorLF = 0;
      motorRR = 1;
      motorLR = 0;
      break;

    case 'rotate':
      motorRF = 1;
      motorLF = 0;
      motorRR = 1;
      motorLR = 0;
      break;

    case 'stop':
      motorRF = 0;
      motorLF = 0;
      motorRR = 0;
      motorLR = 0;
      break;

    default:
      motorRF = 0;
      motorLF = 0;
      motorRR = 0;
      motorLR = 0;

  }

  //Updates GPIO outputs here
  relay1.writeSync(motorRF);
  relay2.writeSync(motorLR);
  relay3.writeSync(motorRR);
  relay4.writeSync(motorLF);

}

//==================================================================
//API's
//==================================================================

io.on('connection', function (socket) {
  console.log('client connected');

  socket.on('messageFromClient', function (data) {
    console.log(data);
    motorControl(data.data);

    socket.emit('messageFromRobot', {
      msg: 'Motor status', data: {
        'RF': motorRF,
        'RR': motorRR,
        'LF': motorLF,
        'LR': motorLR
      }
    });

  });

});

//==================================================================
//SERVER
//==================================================================

server.listen(port, function () {
  console.log('server listening on ', port);
});






