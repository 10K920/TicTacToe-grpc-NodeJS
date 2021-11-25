var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');

const server = new grpc.Server();

let proto = grpc.loadPackageDefinition(
    protoLoader.loadSync("../protos/tictactoe.proto", {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    })
);

let users = [];

// Receive message from client joining
function addPlayer(call, callback) {
    users.push(call);
    if (users.length < 2) {
        notifyChat({user: "Server ", text: "waiting for another player"});
    }
    else if (users.length == 2) {
        notifyChat({user: "Server ", text: "game will begin"});
    }
    else {
        users.pop();
        call.write({user: "Server ", text: "Game in play. Try again later."});
    }
}

function play(call, callback) {
    notifyChat(call.request);
}

function notifyChat(message) {
    users.forEach(user => {
        user.write(message);
    })
}

server.addService(proto.tictactoe.TTT.service, {addPlayer: addPlayer, play: play });

server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());

server.start();
