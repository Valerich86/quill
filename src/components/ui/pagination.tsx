"use client";

import { AiFillCaretLeft } from "react-icons/ai"; 
import { AiFillCaretRight } from "react-icons/ai"; 

type PaginationData = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

interface PaginationProps {
  pagination: PaginationData;
  isLoading: boolean;
  handlePageChange: (newPage: number) => void;
}

export default function Pagination({
  pagination,
  isLoading,
  handlePageChange,
}: PaginationProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <button
        onClick={() => handlePageChange(pagination.page - 1)}
        disabled={!pagination.hasPrev || isLoading}
        className={
          `disabled:opacity-0 px-1 bg-dark border border-light 
          rounded-l-full text-light disabled:cursor-not-allowed`
        }
      >
        <AiFillCaretLeft size={30}/>
      </button>
      {/* Номера страниц */}
      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
        (pageNum) => (
          <button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            className={`px-3 py-1 rounded text-white border ${
              pageNum === pagination.page
                ? "bg-accent_2 scale-120"
                : "bg-dark hover:bg-gray-700"
            }`}
          >
            {pageNum}
          </button>
        )
      )}
      
      <button
        onClick={() => handlePageChange(pagination.page + 1)}
        disabled={!pagination.hasNext || isLoading}
        className={
          `disabled:opacity-0 px-1 bg-dark border border-light 
          rounded-r-full text-light disabled:cursor-not-allowed`
        }
      >
        <AiFillCaretRight size={30}/>
      </button>
    </div>
  );
}
