var express = require('express');
var app = express();
const cors = require('cors');
app.use(cors());
const port = process.env.PORT || 3000;
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});


client.initialize();


var bodyParser = require('body-parser');
var XMLHttpRequest = require('xhr2');
// Create application/x-www-form-urlencoded parser  
var urlencodedParser = bodyParser.urlencoded({ extended: false })
// app.use(express.static('public'));



app.get('/index.html', function (req, res) {
    res.sendFile(__dirname + "/" + "index.html");
})

app.get('/', function (req, res) {
    const data = null;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            console.log("Curl Response: " + this.responseText);
        }
    });

    xhr.open("GET", "http://127.0.0.1:8000/Curl");
    xhr.send(data);
})
const myChats = ["Free Courses Learnejo", "Free Courses 2 : Learnejo"];
app.post('/process_post', urlencodedParser, function (req, res) {

    // client.sendMessage(req.body.first_name + "@c.us", req.body.last_name);
    client.getChats().then((chats) => {
        myChats.forEach((chatName) => {
            const myChat = chats.find((chat) => chat.name === chatName);
            if (myChat) {
                // const attachmentPdf = MessageMedia.fromFilePath("./sample.pdf");
                client.sendMessage(myChat.id._serialized, req.body.courses);

            }
            else {
                console.log(`Chat ${chatName}} not found`);
            }
        });
    });
    res.end('Send.')
    // res.end(JSON.stringify(response));
})
var server = app.listen(port, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})  