import Popover from "@/components/ui/popover";
import { useAuth0 } from "@auth0/auth0-react";
import { LogOut } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function UserDropdown() {
  const { isLoading, user, logout } = useAuth0();
  const [openPopover, setOpenPopover] = useState(false);

  if (isLoading || !user?.email) return null;

  return (
    <div className="relative inline-block text-left">
      <Popover
        content={
          <div className="w-full rounded-md bg-white p-2 sm:w-56">
            <button
              className="relative flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100"
              onClick={() => logout()}
            >
              <LogOut className="h-4 w-4" />
              <p className="text-sm">Logout</p>
            </button>
          </div>
        }
        align="end"
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
      >
        <button
          onClick={() => setOpenPopover(!openPopover)}
          className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-gray-300 transition-all duration-75 focus:outline-none active:scale-95 sm:h-9 sm:w-9"
        >
          <Image
            alt={user?.email}
            src={
              user?.picture ||
              `https://avatars.dicebear.com/api/micah/${user?.email}.svg`
            }
            width={40}
            height={40}
          />
        </button>
      </Popover>
    </div>
  );
}
