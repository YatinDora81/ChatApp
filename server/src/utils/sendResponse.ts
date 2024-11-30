import { WebSocket } from "ws";
export default function sendResponse( socket : WebSocket , success : boolean , type : string, data : any , message : string ){
    const res = {
        success,
        type,
        data,
        message
    }
    socket.send( JSON.stringify(res) )
}