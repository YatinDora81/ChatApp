import { createContext, useState } from "react";

export const SocketContext = createContext<{ socket: null | WebSocket, setSocket: any }>({ socket: null, setSocket: () => { } })

const SocketProviderContext = ({ children }: { children: any }) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    return (
        <SocketContext.Provider value={{ socket, setSocket }} >{children}</SocketContext.Provider>
    )
}

export default SocketProviderContext