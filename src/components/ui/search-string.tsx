"use client";

import { AiFillCloseCircle } from "react-icons/ai";
import { useState } from "react";
import { BsSearch } from "react-icons/bs";
import { motion } from "framer-motion";

type HandleSearchType = (
  page?: number,
  tags?: string[],
  searchString?: string
) => void;

export default function SearchStringForm({
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
        <span>по словам</span>
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
  const [searchString, setSearchString] = useState<string>("");

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
          <input 
            className="input"
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
            placeholder="введите слово или строку для поиска..."
            autoFocus
          />
        <div>
          <AiFillCloseCircle
            size={30}
            onClick={() => {
              setSearchString("");
              handleClose();
            }}
          />
        </div>
      </div>
      <button
        onClick={() => {
          if (searchString.trim().length === 0) return;
          handleSearch(1, undefined, searchString);
        }}
        className="w-full bg-accent_1 text-white p-2 rounded-b-full disabled:bg-zinc-400 disabled:cursor-not-allowed hover:shadow-xl/20 hover:shadow-accent_1 active:scale-99 cursor-pointer"
      >
        Поиск
      </button>
    </motion.div>
  );
};
