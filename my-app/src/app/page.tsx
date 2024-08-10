import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    // navbar
    <main className="">
      {/* Navbar component */}
      <Navbar />
      <h1>I am Home Page</h1>
      <Button>
        <Link href={"/order"}>Checking Auth</Link>
      </Button>
    </main>
  );
}
