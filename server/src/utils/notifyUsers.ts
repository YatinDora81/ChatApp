
import { User } from "../index.js";

export default function notifyUsers( userArr : User[] , peopleCount : number ,message : string ){
    const res = {
        success : true,
        type : "notification",
        data : {
            peopleCount
        },
        message
    }
    userArr.forEach((u)=> u.socket.send( JSON.stringify(res) ) )
}