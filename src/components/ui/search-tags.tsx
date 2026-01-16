"use client";

import { AiFillCloseCircle } from "react-icons/ai";
import { useState } from "react";
import { BsSearch } from "react-icons/bs";
import { motion } from "framer-motion";
import Tags from "../lists/tags";

type HandleSearchType = (
  page?: number,
  tags?: string[],
  searchString?: string
) => void;

export default function SearchTagsForm({
  handleSearch,
}: {
  handleSearch: HandleSearchType;
}) {
  const [modalOpened, setModalOpened] = useState(false);

  const handleClose = () => {
    setModalOpened(false);
  };

  return (
    <>
      <button
        className={`text-light bg-dark hover:opacity-90 cursor-pointer flex px-3 py-1 gap-5 items-center border border-light rounded`}
        onClick={() => setModalOpened(true)}
      >
        <BsSearch />
        <span>по тегам</span>
      </button>
      {modalOpened && (
        <SearchModal handleClose={handleClose} handleSearch={handleSearch} />
      )}
    </>
  );
}

interface SearchModalProps {
  handleClose: () => void;
  handleSearch: HandleSearchType;
}

const SearchModal = ({ handleClose, handleSearch }: SearchModalProps) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const changeSelectedList = (tag: string) => {
    setSelectedTags(
      (prev) =>
        prev.includes(tag)
          ? prev.filter((t) => t !== tag) 
          : [...prev, tag] 
    );
  };

  return (
    <motion.div
      initial={{ y: "-100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
      }}
      className="w-full px-3 md:px-offsetX absolute left-0 top-13 z-10"
    >
      <div className="w-full bg-light p-5 shadow-xl/20 shadow-dark flex justify-between md:gap-50">
        <div>
          <Tags onSelect={(tag) => changeSelectedList(tag)} />
        </div>
        <div>
          <AiFillCloseCircle
            size={30}
            onClick={() => {
              setSelectedTags([]);
              handleClose();
            }}
          />
        </div>
      </div>
      <button
        onClick={() => handleSearch(1, selectedTags)}
        className="w-full bg-accent_1 text-white p-2 rounded-b-full disabled:bg-zinc-400 disabled:cursor-not-allowed hover:shadow-xl/20 hover:shadow-accent_1 active:scale-99 cursor-pointer"
      >
        Поиск
      </button>
    </motion.div>
  );
};
