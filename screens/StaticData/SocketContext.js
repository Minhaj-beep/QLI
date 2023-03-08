import React from 'react';
import io from 'socket.io-client';
        
const SOCKET_ADDR = 'wss://api.dev.qlearning.academy/ticket';
        
export const socket = io(SOCKET_ADDR);
        
// export const SocketContext = React.createContext();
