import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import React from 'react';

type props = {
  module: any;
  page: number;
  onPageChange: (newPage: number) => void;
  totalPages: number;
};

const Pagination = ({ page, onPageChange, totalPages }: props) => {
  const generatePageNumbers = () => {
    const pageNumbers: any = [];
    const showMaxPages = 5; // Maximum number of pages to show around the current page

    if (totalPages <= showMaxPages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPages = [1, 2, 3];
      const endPages = [totalPages - 2, totalPages - 1, totalPages];
      const surroundingPages = [
        page - 1,
        page,
        page + 1
      ].filter(p => p > 1 && p < totalPages);

      const uniquePages = new Set([
        ...startPages,
        ...surroundingPages,
        ...endPages
      ]);

      uniquePages.forEach(p => pageNumbers.push(p));
      pageNumbers.sort((a: any, b: any) => a - b);
    }

    return pageNumbers;
  };

  const pageNumbers = generatePageNumbers();
  return (
    <div className="pagination">
      {/* <p>
        <span>Showing {module?.length ? `${module?.length}` : 0} items </span>
      </p> */}
      <div className="pages">
        <button
          type="submit"
          className="prevbtn"
          onClick={() => { onPageChange(page - 1); window.scrollTo(0, 0); }}
          disabled={page === 1}
        >
          <ArrowBackIosNewIcon />
        </button>
        <div className="count">
          {/* {Array.from({ length: totalPages }).map((_, index) => (
            <button
              className={page === index + 1 ? "actv" : "inActv"}
              key={index}
              onClick={() => onPageChange(index + 1)}
              disabled={page === index + 1}
            >
              {index + 1}
            </button>
          ))} */}
          {pageNumbers.map((pageNum: any, index: any) => (
            <React.Fragment key={index}>
              {index > 0 && pageNum - pageNumbers[index - 1] > 1 && <span>...</span>}
              <button
                className={page === pageNum ? "actv" : "inActv"}
                onClick={() => {
                  
                  onPageChange(pageNum)
                }}
                disabled={page === pageNum}
              >
                {pageNum}
              </button>
            </React.Fragment>
          ))}
        </div>
        <button
          className="prevbtn"
          onClick={() => {  onPageChange(page + 1);window.scrollTo(0, 0); }}
          disabled={page === totalPages}
        >
          <ArrowForwardIosIcon />
        </button>
      </div>
    </div>
  );
};

export default Pagination;


