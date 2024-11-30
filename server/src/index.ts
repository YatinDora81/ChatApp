import { WebSocketServer , WebSocket } from "ws"
import {config} from "dotenv"
import generateRoomId from "./utils/generateRoomId.js";
import sendResponse from "./utils/sendResponse.js";
import notifyUsers from "./utils/notifyUsers.js";


config();
const PORT : string = process.env.PORT || "8080"

const wss = new WebSocketServer( { port : parseInt(PORT) } , ()=>{
    console.log("WS Connected Successfully on " + PORT);
} )


interface Chats{
    message : string,
    sender : string,
}

export interface User{
    socket : WebSocket,
    username : string,
}

type RoomData = {
    chats : Chats[], 
    user : User[]
}

const map = new Map< string , RoomData >(); // room id , { Chats , user[] } , chats { message,  sender }
const roomMap = new Map< WebSocket , string >(); // socket , roomid

wss.on( "connection" , (socket : WebSocket)=>{

    socket.on("message" , (ev)=>{

        let obj : any
        try {
            const s = ev.toString();
            obj = JSON.parse(s);
        } catch (error) {
            console.log( "Error at parsing the object " + error);
            return;
        }

        if(obj.type === "create"){

            // 1. input looks like 
	        // {
		    //     type : "create",
	        //     payload : {
		    //         username : "yatin"
		    //     }
	        //  }


            // unique room id
            let newRoomId = generateRoomId();
            while( map.has(newRoomId) ){
                newRoomId = generateRoomId();
            }

            const roomData : RoomData = {
                chats : [],
                user :  [ { socket : socket , username : obj.payload.username } ] 
            }
            
            map.set( newRoomId , roomData )
            
            roomMap.set( socket , newRoomId )
            
            const data =  {
                roomId : newRoomId,
                peopleCount : map.get(newRoomId)?.user.length,
                chats : map.get(newRoomId)?.chats || [],
            }

            sendResponse( socket , true , obj.type , data , "Successfully Create Room")
    
        }
        else if(obj.type === "join"){
            // input looks like
            // {
            //     type :  "join",
            //     payload : {
            //         username : "",
            //         roomId : ""
            //     }
            // }

            // check room is vaild
            const roomId = obj.payload.roomId;
            if( !map.has(roomId) ){
                sendResponse( socket , false, obj.type , "No Room Found" , "No Room Found"  );
                return;
            }
            // unique username
            const username = obj.payload.username;
            const allUsers = map.get( roomId )?.user
            const filtered = allUsers?.filter( (u)=> u.username === username );
            if( typeof filtered === "undefined" || filtered?.length>0){
                sendResponse( socket , false, obj.type , "UserName Already Exists , Try Another Name" , "UserName Already Exists , Try Another Name"  );
                return;
            }

            map.get(roomId)?.user.push( { socket : socket , username : username } )
            roomMap.set(socket ,roomId);

            const data =  {
                roomId : roomId,
                peopleCount : map.get(roomId)?.user.length,
                chats : map.get(roomId)?.chats || [],
            }

            sendResponse( socket , true , obj.type , data , "Successfully Joined Room")
            
            const filterUser = map.get(roomId)?.user.filter((u)=>u.socket!==socket) || []
            notifyUsers( filterUser , map.get(roomId)?.user.length || 0 ,username + " Joined room " )
            
        }
        else if(obj.type === "chat"){

            // input looks like
            // {
            //     type : "chat",
            //     payload : {
            //             roomId : "",
            //             sender : "",
            //             message : "",
            //     }
            // }


            const roomId = obj.payload.roomId
            const sender = obj.payload.sender
            const message = obj.payload.message

            if( !map.has(roomId) ){
                sendResponse( socket , false , obj.type , "No Room Found" , "No Room Found"  );
                return;
            }

            // adding chat
            map.get(roomId)?.chats.push( { message : message , sender : sender } )

            // sends all sockets of particular group this result no need of filter any sockets because we are not add in frontend sender will recive its chat from backend this will be error free

            const allUsers = map.get(roomId)?.user
            const data = {
                chat : { sender , message },
            }

            allUsers?.forEach( (u)=> sendResponse( u.socket , true , obj.type , data , "New Chat Is There!!!" ) )

        }
        else{
            // error in sending input type
            console.log("Invalid Type");
            sendResponse( socket , false , obj?.type , "Error in Sending Data", "Error in Sending Data" )
        }

    })

    socket.on("close" , ()=>{

        // get socket and name 
        const roomId = roomMap.get(socket)
        if(!roomId){
            console.log("No Room Id is There");
            return ;
        }
        const roomData = map.get(roomId)
        if(!roomData){
            console.log("No Room Data exists");
            return
        }

        const userIndex = roomData.user.findIndex((u)=>u.socket===socket)
        if(userIndex!==-1){
            const [removedUser] = roomData.user.splice( userIndex , 1 );
            notifyUsers( roomData.user , roomData.user.length , `${removedUser.username} left room` );
        }

        // clean up room is no one exists
        if(roomData.user.length===0){
            map.delete(roomId)
        }

        roomMap.delete(socket);

    })

} )