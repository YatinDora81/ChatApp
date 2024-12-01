import { Outlet, useNavigate } from "react-router-dom"
import Navbar from "./components/Navbar"
import { useContext, useEffect } from "react"
import { SocketContext } from "./components/socketProvider"
import { useDispatch } from "react-redux"
import { addChat, changePeopleCount, createRoom, joinRoom, setError } from "./redux/UserSlice"
import toast from "react-hot-toast"

const App = () => {

  const { socket: socketContext, setSocket } = useContext(SocketContext)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {

    async function call() {
      const socket = new WebSocket(import.meta.env.VITE_WS_URL)
      // console.log(socket);
      
      socket.onmessage = (e) => {
        let obj
        try {
          obj = JSON.parse(e.data)
          // console.log(obj);

        } catch (error) {
          console.log("Error at parsing the obj ", error);
          return
        }

        if (obj && obj.type && obj.type === "create") {
          if (obj.success) {
            dispatch(setError(null))
            dispatch(createRoom(obj.data.roomId))
          }
          else {
            dispatch(setError(obj.message))
            toast(obj.message , {
              style: {
                  borderRadius: '10px',
                  background: '#333',
                  color: '#fff',
              },
          })
          }
        }

        else if (obj && obj.type && obj.type === "join") {
          if (obj.success) {
            dispatch(setError(null))
            dispatch(joinRoom({ chats: obj.data.chats, roomId: obj.data.roomId, username: obj.data.username, peopleCount: obj.data.peopleCount }))
            navigate("/chats")
          }
          else {
            dispatch(setError(obj.message))
            toast(obj.message)
          }
        }

        else if( obj && obj.type && obj.type === "chat" ){
          if(obj.success){
            dispatch(setError(null))
            dispatch(addChat({message : obj.data.chat.message , sender : obj.data.chat.sender }))
          }
          else{
            dispatch(setError(obj.message))
            toast(obj.message)
          }
        }

        else if( obj && obj.type && obj.type === "notification" ){
        //   success : true,
        // type : "notification",
        // data : {
        //     peopleCount
        // },
        // message

          if(obj.success){
            dispatch(changePeopleCount(obj.data.peopleCount));
            toast(obj.message , {})
          }

        }

      }

      setSocket(socket)
    }
    call()


    return () => {
      socketContext?.close()
      setSocket(null);
    }

  }, [])

  return (
    <div className=" w-screen min-h-screen ">

      <div className=" h-[12vh] "><Navbar /></div>

      <Outlet />

    </div>
  )
}

export default App