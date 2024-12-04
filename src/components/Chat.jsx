import pp from "../assets/gua.jpeg";
import { IoSendSharp } from "react-icons/io5";
import { BsChatRightFill } from "react-icons/bs";

const Chat = () => {
  return (
    <div className="w-full h-full border-l flex flex-col">
      <div className="w-full p-4 px-5 border-b">
        <div className="flex items-center gap-5">
          <img src={pp} alt="" className="rounded-full size-12" />
          <div className="flex flex-col">
            <h4 className="text-sm font-semibold">John Doe</h4>
            <h3 className="status text-xs text-slate-600">Online</h3>
          </div>
        </div>
      </div>
      <div className="w-full h-full overflow-y-auto space-y-4 bg-sky-50 p-5">
        <div className="other relative ml-0 max-w-md p-3 px-5 pr-16 rounded-md w-fit h-fit bg-[#e4eef3]">
          <BsChatRightFill className="absolute rotate-90 bottom-0 -left-1 text-[#e4eef3]"/>
          <p className="text-sm z-10 break-words text-start">anj</p>
          <p className="absolute bottom-1 right-2 text-[10px] font-medium">04:78 PM</p>
        </div>

        <div className="sender relative ml-auto max-w-md p-3 px-5 pr-16 rounded-md w-fit h-fit bg-sky-200">
          <BsChatRightFill className="absolute -rotate-90 top-0 -right-1 text-sky-200"/>
          <p className="text-sm z-10 break-words text-end">Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum optio dolor totam accusantium, illo similique unde odio nobis quod modi.</p>
          <p className="absolute bottom-1 right-2 text-[10px] font-medium">04:78 PM</p>
        </div>
      </div>
      <div className="text w-full h-24 pb-1 border-t-2 flex justify-around items-center">
        <input
          type="text"
          placeholder="Type a message"
          className="p-3 outline-none w-10/12 rounded-md"
        />
        <IoSendSharp className="text-2xl text-slate-600 cursor-pointer" />
      </div>
    </div>
  );
};

export default Chat;
