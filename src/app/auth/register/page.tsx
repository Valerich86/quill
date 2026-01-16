import { BsFillArrowRightSquareFill } from "react-icons/bs"; 
import type { Metadata } from "next";
import { Suspense } from "react";
import RegisterForm from "@/components/forms/register";
import Link from "next/link";
import { font_accent } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Регистрация",
};

export default function RegisterPage() {
  return (
    <div className="content flex flex-col justify-center items-center gap-10">
      <h1 className={`${font_accent.className} text-center text-light text-2xl`}>Регистрация</h1>
      <Suspense>
        <RegisterForm />
      </Suspense>
      <Link
        href={"/auth/login"}
        className="flex gap-2 items-center underline hover:opacity-75"
      >
        Я уже зарегистрирован <BsFillArrowRightSquareFill />
      </Link>
    </div>
  );
}
