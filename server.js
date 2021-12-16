const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
// const ByteLength = require('@serialport/parser-byte-length')
const Readline = require('@serialport/parser-readline')
const SerialPort = require('serialport')
let port = 'COM2'

if (process.platform !== "win32"){
    port = '/dev/tty0/'
}

const _serialPort = new SerialPort(port, {
  baudRate: 9600,
  autoOpen: false
})

_serialPort.on("open", function () {
    console.log("Port Open");
});

_serialPort.on("data", function (data) {
    console.log('data received: ' + parseFloat(data)); // apenas debug
    io.emit('serialData', {
        balanca: parseFloat(data),
        produto: 80.00
    })
})

let _socket = null

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile('/public/index.html')
})

io.on('connection', function (socket) {
    _socket = socket;
    console.log('a user connected');
    _serialPort.open();
    _socket.on('disconnect', function () {
        _serialPort.close(function (err) {
            if (err) console.log("Error at disconnect event: " + err);
            console.log('port closed');
        });
    });    
});


http.listen(3000, function () {
    console.log('listening on *:3000');
});