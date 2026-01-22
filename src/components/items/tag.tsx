'use client';
import { useState } from "react";
import { Tag } from "@/lib/types";
export const TagItem = ({ item, onSelect }: { item: Tag, onSelect?: (tag: string) => void }) => {
  const [selected, setSelected] = useState(false);
  const toggleTag = () => {
    setSelected(prev => !prev);
    if (onSelect) onSelect(item.id);
  };
  return (
    <div
      onClick={toggleTag}
      className={`rounded-full text-light px-2 py-1 text-sm cursor-pointer hover:opacity-90 ${
        selected ? "bg-accent_2" : "bg-dark"
      }`}
    >
      {item.name}
    </div>
  );
};