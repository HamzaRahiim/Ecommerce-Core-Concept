"use client";
import Link from "next/link";
import Nav from "./Nav";
import NavLink from "./NavLink";
import { LuAlignLeft } from "react-icons/lu";
import { useAppSelector } from "@/app/store/hooks";
import { useAppDispatch } from "@/app/store/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/app/store/features/authSlice";

// navbar
const Navbar = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const dispatch = useAppDispatch(); // Initialize the dispatch hook

  const handleLogout = () => {
    dispatch(logout()); // Dispatch the logout action
  };
  return (
    <header className="flex flex-col items-center bg-purple-700">
      {/* div 1  */}
      <div className="h-10 flex items-center">
        <h1>Fastest</h1>
      </div>
      {/* div 2  */}
      <div className="flex justify-around w-screen bg-slate-300 h-12 items-center">
        {/* div 21 */}
        <div>
          <ul>
            {/* I want display this icon only in small devices  */}
            <li className="hidden">
              <LuAlignLeft />
            </li>
            <li>Logo</li>
          </ul>
        </div>
        {/* div 22 */}
        {/* I want to display this only on devices above from medium screen  */}
        <div className="">
          <NavLink />
        </div>
        {/* div 23 */}
        <div>
          <ul className="flex space-x-4">
            {/* this nav component is also wanted to display on above the medium screen  */}
            <Nav />
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="hover:cursor-pointer">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href={"/user/profile"}>Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href={"/user/settings"}>Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="hover:cursor-pointer text-red-500"
                  >
                    LogOut
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <li>
                <Link href={"/auth/login"}>login</Link>
              </li>
            )}
            <li>Basket</li>
          </ul>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
