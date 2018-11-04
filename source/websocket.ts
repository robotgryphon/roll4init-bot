import { Server } from "ws";

export default class WebSocketServer {
    protected Server: Server;

    constructor() {
        // Start the server
        this.Server = new Server({ port: parseInt(process.env.WS_PORT) || 8081 });
    }

    start() {
        // When a connection is established
        this.Server.on("connection", function(socket) {
            console.log("Opened connection ");

            // Send data back to the client
            var json = JSON.stringify({ message: "Gotcha" });
            socket.send(json);

            // When data is received
            socket.on("message", function(message) {
                console.log("Received: " + message);
            });

            // The connection was closed
            socket.on("close", function() {
                console.log("Closed Connection ");
            });
        });

        // Every three seconds broadcast "{ message: 'Hello hello!' }" to all connected clients
        // var broadcast = () => {
        // 	var json = JSON.stringify({
        // 		message: "Hello hello!"
        // 	});

        // 	// wss.clients is an array of all connected clients
        // 	this.Server.clients.forEach(function each(client) {
        // 		client.send(json);
        // 		console.log("Sent: " + json);
        // 	});
        // };

        // setInterval(broadcast, 3000);
    }

    stop() {
        this.Server.close();
    }
}
