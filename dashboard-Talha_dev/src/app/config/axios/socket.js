import io from 'socket.io-client';

const SOCKET_URL = 'https://vakeelserver.barrana.io';


export const socketConfig = () => {

        const socket = io(SOCKET_URL,
            {  
                
                rejectUnauthorized: false,
                reconnection: true,   
                     
            });
        socket.on("connect", () => {
            console.log("Connected to the WebSocket server");
        });
        
        socket.on("connect_error", (error) => {
            console.error("WebSocket connection error:", error);
        });
        
        socket.on("disconnect", () => {
            console.log("Disconnected from the WebSocket server");
        });

    return socket;
}