import { BsFillArrowRightSquareFill } from "react-icons/bs"; 
import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "@/components/forms/login";
import Link from "next/link";
import { font_accent } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Вход",
};

export default function RegisterPage() {
  return (
    <div className="content flex flex-col justify-center items-center gap-10">
      <h1 className={`${font_accent.className} text-center text-light text-2xl`}>Вход</h1>
      <Suspense>
        <LoginForm />
      </Suspense>
      <Link
        href={"/auth/register"}
        className="flex gap-2 items-center underline hover:opacity-75"
      >
        Я новый пользователь <BsFillArrowRightSquareFill />
      </Link>
    </div>
  );
}
