"use client";

import { usePathname } from "next/navigation";
import { RiLogoutBoxLine } from "react-icons/ri";
import { UserCookie } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { font_accent } from "@/lib/fonts";
import { useRouter } from "next/navigation";

export default function UserLinks({ user }: { user: UserCookie }) {
  const pathName = usePathname();
  const router = useRouter();

  const signOut = async () => {
    console.log("sign out");
    try {
      const response = await fetch("api/auth/logout");
      window.location.replace("/");
      router.replace("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center gap-10">
      <Link
        href={"/posts/create"}
        className={`${
          "/posts/create" === pathName ? "text-accent_2" : "text-dark"
        }  text-lg font-medium hover:opacity-75`}
      >
        Новая статья
      </Link>
      <Link href={"/profile"}>
        <div
          className={`${
            pathName === "/profile" ? "border-accent_1" : "border-zinc-500"
          } text-dark bg-accent_2 border w-10 h-10 flex justify-center items-center rounded-full hover:opacity-95`}
        >
          {user.avatar !== null && (
            <Image
              src={user.avatar}
              alt=""
              width={200}
              height={200}
              priority
              className="rounded-full h-full w-full object-cover object-[0px]"
            />
          )}
          {user.avatar === null && (
            <span className={`${font_accent.className}`}>{user.name.substring(0, 2)}</span>
          )}
        </div>
      </Link>
      <div
        className="text-3xl hover:opacity-75 cursor-pointer"
        onClick={signOut}
      >
        <RiLogoutBoxLine />
      </div>
    </div>
  );
}
