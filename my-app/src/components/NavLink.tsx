"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
const links = [
  {
    link: "/",
    label: "Home",
  },
  {
    link: "/about",
    label: "About",
  },
  {
    link: "/contact",
    label: "Contact",
  },
  {
    link: "/shop",
    label: "Shop",
  },
];

const NavLink = () => {
  const [activeLink, setActiveLink] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    setActiveLink(pathname);
  }, [pathname]);
  return (
    <ul className="flex space-x-4">
      {links.map((data) => (
        <div>
          <li>
            <Link
              href={data.link}
              className={clsx("font-medium", {
                "font-bold text-blue-400": activeLink === data.link,
              })}
            >
              {data.label}
            </Link>
          </li>
        </div>
      ))}
    </ul>
  );
};
export default NavLink;
