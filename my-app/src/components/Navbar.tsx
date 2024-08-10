"use client";
import Link from "next/link";
import Nav from "./Nav";
import NavLink from "./NavLink";
import { LuAlignLeft } from "react-icons/lu";
import { useAppSelector } from "@/app/store/hooks";
// navbar
const Navbar = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
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
              <h1>UserProfile</h1>
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
