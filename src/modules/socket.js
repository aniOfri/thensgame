import {createContext} from 'react';
import io from 'socket.io-client';

const path = "http://localhost:3000"
export const socket = io.connect(path, {transports: ['websocket']});
export const SocketContext = createContext(socket);

export const useSocket = () => {
  const socket = useContext(SocketContext);

  return socket;
};