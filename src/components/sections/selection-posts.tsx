"use client";

import { AiFillCaretRight } from "react-icons/ai";
import { AiFillCaretLeft } from "react-icons/ai";
import Image from "next/image";
import Loading from "@/app/loading";
import { font_accent } from "@/lib/fonts";
import { useState, useEffect } from "react";
import Link from "next/link";

interface SelectionPostsProps {
  criteria: string;
  headline: string;
  limit: number;
}

type Post = {
  id: string;
  slug: string;
  title: string;
  image_url: string;
};

export default function SelectionPosts({
  criteria,
  headline,
  limit,
}: SelectionPostsProps) {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchPosts();
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev < limit - 1 ? prev + 1 : 0));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const moveBunner = (direction: string) => {
    direction === "right"
      ? setCurrentIndex((prev) => prev + 1)
      : setCurrentIndex((prev) => prev - 1);
  };

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const url = new URL("/api/posts/selection", window.location.origin);
      url.searchParams.set("criteria", criteria);
      url.searchParams.set("limit", limit.toString());
      const response = await fetch(url);
      const posts = await response.json();
      setPosts(posts);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!posts || isLoading) {
    return <Loading />;
  }

  const PostItem = ({ post }: { post: Post }) => {
    return (
      <Link
        className="w-full h-full relative"
        href={`/posts/${post.slug}?id=${post.id}`}
      >
        <h1
          className={`
            ${font_accent.className} w-[75%] leading-relaxed
            text-xl md:text-4xl text-light [text-shadow:3px_3px_3px_black]
            absolute top-[10%] left-5`}
        >
          {post?.title}
        </h1>
        <Image
          src={post.image_url}
          alt={post.image_url}
          width={300}
          height={300}
          className="object-cover object-center w-full h-full"
        />
      </Link>
    );
  };

  return (
    <section className="w-screen h-screen px-3 md:px-offsetX">
      <h1 className={`text-3xl font-extrabold text-light text-center`}>
        {headline}
      </h1>
      <div className="w-full overflow-hidden rounded-xl border border-accent_1 mt-10 relative">
        <div
          className={`h-[70vh] flex transition duration-500 ease-in-out`}
          style={{
            transform: `translateX(-${(currentIndex * 100) / limit}%)`,
            width: `${100 * limit}%`,
          }}
        >
          {posts.map((item) => (
            <PostItem post={item} key={item.id} />
          ))}
        </div>

        <button
          className={`${
            currentIndex === 0 ? "opacity-0 pointer-events-none" : "opacity-100"
          } rounded bg-dark absolute top-1/2 -translate-y-[50%] left-3 text-light`}
          onClick={() => moveBunner("left")}
        >
          <AiFillCaretLeft size={30} />
        </button>
        <button
          className={`${
            currentIndex === limit - 1
              ? "opacity-0 pointer-events-none"
              : "opacity-100"
          } rounded bg-dark absolute top-1/2 -translate-y-[50%] right-3 text-light`}
          onClick={() => moveBunner("right")}
        >
          <AiFillCaretRight size={30} />
        </button>
      </div>
    </section>
  );
}
