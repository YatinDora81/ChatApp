import { createSlice } from "@reduxjs/toolkit";

export interface Room {
    username : string | null,
    roomId : string | null,
    chats : Chat[],
    error : string | null,
    peopleCount : number
}

export interface Chat {
    message : string,
    sender : string
}

const startState = ()=>{
    const savedState = localStorage.getItem("roomState");
    if (savedState) {
        try {
            return JSON.parse(savedState) as Room;
        } catch (error) {
            console.error("Error parsing localStorage state:", error);
        }
    }

    return {
        username : null,
        peopleCount : 0,
        roomId : null,
        chats : [],
        error : null
    } as Room
}

const updateState = (state : any)=>{
    localStorage.setItem("roomState" , JSON.stringify(state));
}

const UserSlice = createSlice({
    name : "user",
    initialState  : startState(),
    reducers : {
        leaveRoom : (state )=>{
            state.username = null
            state.roomId = null
            state.chats = []
            state.peopleCount = 0
            state.error = null

            updateState(state)
            
        },
        joinRoom : (state ,action)=>{
            state.chats = action.payload.chats
            state.roomId = action.payload.roomId
            state.username = action.payload.username
            state.peopleCount = action.payload.peopleCount

            updateState(state)
        },
        addChat : (state ,action)=>{
            state.chats.push( action.payload );

            updateState(state)
        },
        createRoom : (state , action)=>{
            state.roomId = action.payload

            updateState(state)
        },
        removeRoom : (state)=>{
            state.roomId = null

            updateState(state)
        },
        setError : (state , action)=>{
            state.error = action.payload

            updateState(state)
        },
        removeError : (state)=>{
            state.error = null;

            updateState(state)
        },
        changePeopleCount : (state, action)=>{
            state.peopleCount = action.payload

            updateState(state)
        }
    }
})

export const { leaveRoom , joinRoom ,addChat , createRoom , removeRoom , setError , removeError , changePeopleCount  } = UserSlice.actions
export default UserSlice.reducer