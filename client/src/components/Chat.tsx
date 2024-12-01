import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Chat = ({ left, message, sender }: { left: boolean, message: string, sender: string }) => {
    return (
        <div className={` flex flex-col ${left ? "items-start" : "items-end "}`}>
            <Avatar className=" h-8 w-8" >
                <AvatarFallback className={` ${left ? "bg-zinc-800 text-white" : " dark:bg-zinc-200 dark:text-black"} `}>{sender.split(" ").map((word) => word.charAt(0).toUpperCase()).join("")}</AvatarFallback>
            </Avatar>

            <div className={` ${left===true ? "ml-5 bg-zinc-700 text-white" : "mr-5 bg-white text-black"} max-w-[60%]  py-2 px-4 rounded-xl inline-block`}>{message}</div>
        </div>
    )
}

export default Chat