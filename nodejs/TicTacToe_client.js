var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');
var readline = require("readline");

// Read terminal lines
var line = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Load the protobuf
var proto = grpc.loadPackageDefinition(
    protoLoader.loadSync("../protos/tictactoe.proto", {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    })
);

let username;

// Create gRPC client
let client = new proto.tictactoe.TTT(
    '0.0.0.0:50051',
    grpc.credentials.createInsecure()
);

// Start the stream between server and client
function startGame() {
    let channel = client.addPlayer({user: username});
    channel.on("data", onData);
     line.on("line", function(text) {
         client.play({ user: username, text: text }, res => {});
     });
}

// When server send a message
function onData(message) {
    if (message.user == username) {
        return;
    }
    console.log(message.user + ":" + message.text);
}

// Ask user name then start the game
line.question("What's your name?", answer => {
    username = answer;

    startGame();
});