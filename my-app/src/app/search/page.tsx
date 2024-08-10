"use client";
import Display from "@/components/Display";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useAppDispatch } from "../store/hooks";
import { fetchSearchResults } from "@/app/store/features/searchSlice";
import Navbar from "@/components/Navbar";

const Search = () => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("q");

  useEffect(() => {
    if (searchTerm) {
      dispatch(fetchSearchResults(searchTerm));
    }
  }, [searchTerm, dispatch]);
  return (
    <section>
      <Navbar />
      <h1>You result will display here</h1>
      <Display />
    </section>
  );
};
export default Search;
