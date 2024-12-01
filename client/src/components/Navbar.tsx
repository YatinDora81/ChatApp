import { useSelector } from "react-redux"
import { ModeToggle } from "./mode-toggle"
import type { RootState } from "@/redux/Store"
import { Avatar, AvatarFallback } from "@/components/ui/avatar";


const Navbar = () => {

    const username = useSelector((store: RootState) => store.user.username)

    return (
        <div className=" h-full border-b-4 flex justify-between items-center w-[85%] mx-auto">

            <div className=" text-3xl uppercase font-semibold">Chat App</div>

            <div className=" flex justify-center items-center gap-4">
                <ModeToggle />
                {username && <div className=" relative parentdiv">
                    <div className=" hidden childdiv absolute -bottom-5 -right-10 w-24">{username}</div><Avatar >
                        <AvatarFallback>{username.split(" ").map((word) => word.charAt(0).toUpperCase()).join("")}</AvatarFallback>
                    </Avatar></div>}
                
            </div>
        </div>
    )
}

export default Navbar