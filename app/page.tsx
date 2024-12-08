import Homepage from "@/components/Homepage";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-white overflow-hidden rounded-2xl text-black">
      <Link href="/admin">Go to Admin layout</Link>
      <Homepage />
    </div>
  );
}
