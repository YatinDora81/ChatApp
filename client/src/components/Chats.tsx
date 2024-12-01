import { SendHorizonal } from "lucide-react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { FaRegCopy } from "react-icons/fa"
import Chat from "./Chat"
import { IoIosExit } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/Store"
import { useContext, useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import { SocketContext } from "./socketProvider"
import { useNavigate } from "react-router-dom"
import { leaveRoom } from "@/redux/UserSlice"


const Chats = () => {

  const store = useSelector((store: RootState) => store.user)
  const [newMessage, setNewMessage] = useState("")
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const { socket } = useContext(SocketContext)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const addChat = () => {
    if (newMessage.trim().length === 0) {
      toast.error("Please Enter The Message");
      return;
    }

    socket?.send(JSON.stringify({
      type: "chat",
      payload: {
        roomId: store.roomId,
        sender: store.username,
        message: newMessage,
      }
    }))

    setNewMessage("")


  }

  const exitRoom = () => {
    socket?.send(JSON.stringify({
      type: "leaveroom",
      payload: {
        roomId: store.roomId,
        username: store.username
      }
    }))
    dispatch(leaveRoom())
    navigate("/")

  }

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [store.chats])

  useEffect(()=>{
    if(!store.roomId || !store.username){
      navigate("/")
    }
  } , [])

  return (
    <div className="  min-h-[88vh] flex justify-center items-center">

      <div className="  w-[90%] md:w-[40%] md:min-h-[75%] flex flex-col justify-evenly items-center gap-3">

        <div className=" border-[1px] border-gray-30 dark:border-zinc-800 bg-gray-200 dark:bg-zinc-950 rounded-xl w-full md:w-[60vw]  dark:text-white   flex flex-col justify-start items-center gap-7  h-[75vh]">

          <div className=" w-full flex flex-col justify-start items-center gap-2 bg-zinc-800 px-5 py-3 rounded-xl ">
            <div className=" flex justify-between items-center md:text-2xl w-full ">
              <div className="flex justify-center items-center gap-1 text-white "><div>Room Code : <span onClick={() => {
                navigator.clipboard.writeText(store.roomId || "");
                toast.success("Copied Successfully", {
                  style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                  },
                })
              }} className=" cursor-pointer font-bold">{store.roomId}</span> </div><FaRegCopy onClick={() => {
                navigator.clipboard.writeText(store.roomId || "");
                toast.success("Copied Successfully", {
                  style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                  },
                })
              }} className=" cursor-pointer" /></div>
              <div className=" flex justify-center items-center gap-2">
                <div className=" text-xl font-semibold text-white ">Users : {store.peopleCount}</div>

              </div>
            </div>

            <div className=" flex justify-between items-center w-full pr-2">
              <div className=" text-gray-300 text-xs md:text-sm">temporary room that expires after all users exit</div>
              <div onClick={exitRoom} className=" hover:text-red-700 cursor-pointer transition-all duration-75 text-red-600 flex flex-col justify-center items-center">
                <IoIosExit className=" text-2xl"></IoIosExit>
                <div className=" text-sm">Exit</div>
              </div>
            </div>
          </div>

          <div ref={chatContainerRef} className=" h-[80%] w-full flex flex-col overflow-y-auto px-4 py-4 scroll-smooth">
            <Chat left={true} message={"Hello..."} sender={"Y&&6^hu A^%$%#RTY"}></Chat>
            {
              store.chats.map((c, i) => <Chat key={i} left={c.sender !== store.username} message={c.message} sender={c.sender}></Chat>)
            }
            {/* <Chat left={true} message={"Hello JI"} sender={"Yatin dora"}></Chat>
            <Chat left={false} message={"Hello JI"} sender={"Yatin dora"}></Chat>
            <Chat left={true} message={"Hello JI"} sender={"Yatin dora"}></Chat>
            <Chat left={false} message={"Hello JI Kya haal hao brothercnfeownoew vuerg tryer ery   eru er"} sender={"Yatin dora"}></Chat><Chat left={true} message={"Hello JI"} sender={"Yatin dora"}></Chat>
            <Chat left={false} message={"Hello JI"} sender={"Yatin dora"}></Chat><Chat left={true} message={"Hello JI"} sender={"Yatin dora"}></Chat>
            <Chat left={false} message={"Hello JI"} sender={"Yatin dora"}></Chat>
             */}

          </div>

          <div className=" flex justify-center items-center w-full gap-2 p-2">
            <Input value={newMessage} onKeyDown={(e) => {
              if (e.key === "Enter") {
                addChat()
              }
            }} onChange={(e) => setNewMessage(e.target.value)} type="text" placeholder="Enter Message...."></Input>
            <Button onClick={addChat} variant="default"><SendHorizonal className="" /></Button>
          </div>


        </div>
      </div>
    </div>
  )
}

export default Chats