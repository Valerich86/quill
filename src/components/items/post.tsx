"use client";

import { useState, useEffect } from "react";
import { Post, Photo, Tag, Comment, ParsedLine } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { font_accent, font_default } from "@/lib/fonts";
import Loading from "@/app/loading";
import { TagItem } from "./tag";
import CreateCommentForm from "../forms/create-comment";
import Comments from "../lists/comments";
import ViewsCounter from "../ui/views-counter";

interface PostItemProps {
  postId: string;
  isPreview?: boolean;
  currentUserId?: string;
}

export default function PostItem({
  postId,
  isPreview = false,
  currentUserId,
}: PostItemProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [images, setImages] = useState<Photo[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [parsedContent, setParsedContent] = useState<ParsedLine[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [refetch]);

  const fetchPost = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/posts/${postId}`);
      const { post, images, tags, comments } = await response.json();
      setPost(post);
      setImages(images);
      setTags(tags);
      if (comments) setComments(comments);
      setParsedContent(JSON.parse(post.content));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const reloadPage = () => {
    setRefetch((prev) => !prev);
  };

  if (!post || images.length === 0 || tags.length === 0 || isLoading) {
    return <Loading />;
  }

  return (
    <>
      <ViewsCounter
        postAuthorId={post.user_id}
        postId={postId}
        currentUserId={currentUserId}
      />
      <div className="w-full bg-light rounded-2xl p-5 flex flex-col gap-10">
        <div className="w-full flex flex-col">
          <Link
            href={`/authors/${post.user_id}?current=${currentUserId}`}
            className="underline text-accent_1"
          >
            Автор: <strong className="italic text-xl">{post.author}</strong>
          </Link>
          {post.published_at && (
            <p className="">
              Опубликовано:{" "}
              <strong className="italic text-xl">
                {new Date(post.published_at).toLocaleDateString()}
              </strong>
            </p>
          )}
          {!post.published_at && (
            <p className="">
              Начало создания:{" "}
              <strong className="italic text-xl">
                {new Date(post.created_at).toLocaleDateString()}
              </strong>
            </p>
          )}
          {!isPreview && (
            <p className="">
              Просмотры:{" "}
              <strong className="italic text-xl">{post.views}</strong>
            </p>
          )}
          {!isPreview && (
            <Link
              href={`#comments`}
              className="scroll-smooth underline text-accent_1"
            >
              Комментарии:{" "}
              <strong className="italic text-xl">
                {comments ? comments.length : 0}
              </strong>
            </Link>
          )}
        </div>
        <div className="w-full h-[80vh] rounded-xl relative">
          <h1
            className={`
              ${font_accent.className} w-[70%] leading-relaxed
              text-xl md:text-5xl text-light [text-shadow:3px_3px_3px_black]
              absolute top-[20%] left-3`}
          >
            {post?.title}
          </h1>
          <Image
            src={images[0].url}
            alt={images[0].alt ? images[0].alt : ""}
            width={300}
            height={300}
            priority
            className="object-cover object-center w-full h-full rounded-xl"
          />
        </div>
        <div className="w-full flex flex-wrap gap-3 items-center">
          <p>Теги: </p>
          {tags.map((item) => (
            <TagItem item={item} key={item.id} />
          ))}
        </div>
        <div className="w-full flex flex-wrap gap-3 items-center">
          <p>Ссылка: </p>
          <Link
            href={`/posts/${post.slug}?id=${post.id}`}
            target="blank"
            className="italic underline text-xl text-blue-700"
          >
            {post.slug}
          </Link>
        </div>
        <div className="w-full flex flex-col md:flex-row">
          <div className="prose max-w-none w-full md:w-2/3">
            {parsedContent.map((line, index) => {
              switch (line.type) {
                case "heading":
                  return (
                    <h1
                      key={index}
                      className={"text-2xl md:text-4xl font-semibold my-25"}
                    >
                      {line.content}
                    </h1>
                  );
                case "paragraph":
                  return (
                    <pre
                      key={index}
                      className={`whitespace-pre-wrap ${font_default.className} md:text-xl`}
                    >
                      {line.content}
                    </pre>
                  );
                case "offset":
                  return <br key={index} />;
                default:
                  return null;
              }
            })}
          </div>
          <div className="w-full md:w-1/3 flex flex-col gap-y-10 justify-around">
            {images
              .filter((_, index) => index > 0)
              .map((item) => (
                <div
                  key={item.id}
                  className="h-80 flex flex-col justify-between gap-y-1 items-center"
                >
                  <div className="w-full h-75">
                    <Image
                      src={item.url}
                      alt={item.alt ? item.alt : ""}
                      width={300}
                      height={300}
                      className="object-contain object-bottom w-full h-full"
                    />
                  </div>
                  {item.caption && (
                    <p className="italic text-sm">{item.caption}</p>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
      <div id="comments"></div>
      {!currentUserId && (
        <div className="text-light">
          Чтобы оставить отзыв,{" "}
          <Link href={"/auth/login"} className="text-yellow-50 underline">
            авторизуйтесь
          </Link>
        </div>
      )}
      {currentUserId && (
        <CreateCommentForm
          userId={currentUserId}
          postId={post.id}
          reloadPage={reloadPage}
        />
      )}
      <Comments
        comments={comments}
        postAuthorId={post.user_id}
        currentUserId={currentUserId}
        reloadPage={reloadPage}
      />
    </>
  );
}
