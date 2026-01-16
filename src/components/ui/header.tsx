"use client";

import { font_logo } from "@/lib/fonts";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GiHamburgerMenu } from "react-icons/gi";
import { UserCookie } from "@/lib/types";
import UserLinks from "./user-links";

const links = [
  { name: "Статьи", href: "/posts" },
  { name: "Авторы", href: "/authors" },
  { name: "О сайте", href: "/about" },
];

export default function Header({ user }: { user: UserCookie | null }) {
  const pathName = usePathname();
  
  return (
    <div className="fixed z-50 py-1 flex justify-between items-center px-offsetX w-screen bg-light border-b border-b-zinc-300">
      <div className="flex lg:hidden justify-between items-center w-full text-dark">
        <Link
          href={"/"}
          className={`${font_logo.className} ${
            pathName === "/"
              ? "border-accent_1 text-accent_1"
              : "border-zinc-500 text-zinc-500"
          } border-4 w-10 h-10 flex justify-center items-center text-3xl rounded-full hover:opacity-80`}
        >
          Q
        </Link>
        <GiHamburgerMenu className="" size={30} />
      </div>

      <div className="hidden lg:flex gap-10 items-center">
        <Link
          href={"/"}
          className={`${font_logo.className} ${
            pathName === "/"
              ? "border-accent_1 text-accent_1"
              : "border-zinc-500 text-zinc-500"
          } border-4 w-10 h-10 flex justify-center items-center text-3xl rounded-full hover:opacity-80`}
        >
          Q
        </Link>
        {links.map((link) => {
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`${
                link.href === pathName ? "text-accent_2" : "text-dark"
              }  text-lg font-medium hover:opacity-75`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>
      <div className="hidden lg:flex gap-10 items-center">
        {user && <UserLinks user={user} />}
        {!user && (
          <Link
            href={"/auth/login"}
            className={`${
              "/auth/login" === pathName ? "text-accent_2" : "text-dark"
            }  text-lg font-medium hover:opacity-75`}
          >
            Вход / Регистрация
          </Link>
        )}
      </div>
    </div>
  );
}
