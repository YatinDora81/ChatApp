import { Button } from "./ui/button"
import { Input } from "@/components/ui/input"
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { FaRegCopy } from "react-icons/fa";
import { SocketContext } from "./socketProvider";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/Store"

const RoomInfo = () => {

    const error = useSelector( (state : RootState )=>state.user.error )
    const newRoomId = useSelector( (state : RootState )=>state.user.roomId )
    const { socket } = useContext(SocketContext)

    const [roomId, setRoomId ] = useState("");
    const [username, setUsername] = useState("")

    const createNewRoom = () => {
        socket?.send(JSON.stringify({
            type: "create",
            payload: {
                username: "yatin"
            }
        }))
 
    }

    const joinRoom = ()=>{
        if(roomId===""){
            toast.error("Please Fill Room Id")
            return;
        }
        if(username===""){
            toast.error("Please Fill Username")
            return;
        }

        socket?.send(JSON.stringify({
            type : "join",
            payload : {
                username : username,
                roomId : roomId
            }
        }))

        setRoomId("")
        setUsername("")

    }


    return (
        <div className="  min-h-[88vh] flex justify-center items-center">

            <div className=" b g-fuchsia-700 w-[90%] md:w-[40%] md:min-h-[75%] flex flex-col justify-evenly items-center gap-3">

                <div className=" border-[1px] border-gray-30 dark:border-zinc-800 bg-gray-200 dark:bg-zinc-950 rounded-xl w-full h-[85%] dark:text-white  px-6 flex flex-col justify-start items-center gap-7 py-10">

                    <div className=" flex flex-col gap-1 justify-center items-center">
                        <div className=" text-xl font-semibold md:text-4xl">Welcome to Real Time Chat App</div>
                        <div className=" text-sm md:text-lg dark:text-gray-300  opacity-80">
                            temporary room that expires after all users exit
                        </div>
                    </div>

                    <Button onClick={createNewRoom} className=" w-[80%] mx-auto text-xl">Create New Room</Button>

                    <div className=" w-[80%] flex flex-col gap-3">
                        <Input value={roomId} onChange={(e)=>setRoomId(e.target.value)} className=" border-2" type="text" placeholder="Enter Room Id ..."></Input>
                        <div className=" flex gap-1">
                            <Input value={username} onChange={(e)=>setUsername(e.target.value)} className=" border-2" type="text" placeholder="Enter Name..."></Input>
                            <Button onClick={joinRoom} className=" bg-purple-700 hover:bg-purple-600 text-white">Join Room</Button>
                        </div>
                        {error && error !== "" && <div className=" text-red-700 text-sm pl-2 -mt-1">*{error}</div>}
                    </div>

                    {newRoomId && newRoomId !== "" && <div className=" bg-zinc-800 w-[80%] h-[12vh] rounded-xl flex justify-center flex-col items-center">
                        <div className=" text-gray-300 text-md">Share this code with your friend</div>
                        <div onClick={() => {
                            navigator.clipboard.writeText(newRoomId); toast.success("Copied Successfully", {
                                style: {
                                    borderRadius: '10px',
                                    background: '#333',
                                    color: '#fff',
                                },
                            })
                        }} className=" flex justify-center items-center gap-2 text-2xl hover:text-blue-100 cursor-pointer text-white ">
                            <div>{newRoomId}</div>
                            <FaRegCopy className=" " />
                        </div>
                    </div>}

                </div>
            </div>
        </div>
    )
}

export default RoomInfo