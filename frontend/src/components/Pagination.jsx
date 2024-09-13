import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const [pageSize, setPageSize] = useState(6); // Default page size
  const dispatch = useDispatch();

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    dispatch(setSearchedQuery({ ...searchedQuery, pageSize: Number(e.target.value) }));
  };

  const getPaginationRange = () => {
    const range = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
        range.push(i);
      } else if (range[range.length - 1] !== '...') {
        range.push('...');
      }
    }
    return range;
  };

  return (
    <div className="flex flex-col items-center mt-4 mb-4">
      {/* <div className="flex items-center gap-2 mb-2">
        <label htmlFor="pageSize" className="mr-2">Items per page:</label>
        <select
          id="pageSize"
          value={pageSize}
          onChange={handlePageSizeChange}
          className="border rounded-md px-2 py-1"
        >
          <option value={6}>6</option>
          <option value={12}>12</option>
          <option value={24}>24</option>
          <option value={48}>48</option>
        </select>
      </div> */}
      <div className="flex gap-2 font-semibold">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md bg-black text-white disabled:bg-gray-300"
        >
          First
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1  rounded-md bg-black text-white disabled:bg-gray-300"
        >
          Prev
        </button>
        {getPaginationRange().map((item, index) =>
          item === '...' ? (
            <span key={index} className="px-3 py-1 rounded-md bg-gray-200">
              ...
            </span>
          ) : (
            <button
              key={index}
              onClick={() => onPageChange(item)}
              className={`px-3 py-1  rounded-full ${
                currentPage === item ? 'bg-black text-white' : 'bg-gray-200'
              }`}
            >
              {item}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1  rounded-md bg-black text-white disabled:bg-gray-300"
        >
          Next
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="px-3 py-1  rounded-md bg-black text-white disabled:bg-gray-300"
        >
          Last
        </button>
      </div>
    </div>
  );
};

export default Pagination;
