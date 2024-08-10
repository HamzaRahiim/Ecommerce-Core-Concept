"use client";
import { Input } from "./ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
const Nav = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const handleSearch = (searchTerm: string) => {
    router.push(`/search?q=${searchTerm}`);
  };
  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      handleSearch(search);
    }
  };
  return (
    <>
      <li className="">
        <Input
          className="rounded-xl"
          placeholder="Search Product.."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </li>
    </>
  );
};
export default Nav;
