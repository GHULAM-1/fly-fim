import React from "react";
import { Compass, LayoutGrid, User } from "lucide-react";

const Tabs = () => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center py-2 px-4 bg-white z-50 border-t">
      <div className="flex flex-col items-center gap-1">
        <Compass size={20} strokeWidth={1} />
        <span className="text-[10px]">Explore</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <LayoutGrid size={20} strokeWidth={1} />
        <span className="text-[10px]">Categories</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <User size={20} strokeWidth={1} />
        <span className="text-[10px]">Account</span>
      </div>
    </div>
  );
};

export default Tabs;
