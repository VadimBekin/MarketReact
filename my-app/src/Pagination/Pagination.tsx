import type { FC } from 'react';
import s from './s.module.css';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const handlePageClick = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };
    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 3) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage === 1) {
                pages.push(1, 2, 3);
            } else if (currentPage === totalPages) {
                pages.push(totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(currentPage - 1, currentPage, currentPage + 1);
            }
        }
        return pages;
    };
    if (totalPages <= 1) return null;
    const pageNumbers = getPageNumbers();

    return (
        <div className={s.pagination}>
            <div className={s.pageNumbers}>
                {pageNumbers.map((page) => (
                    <button
                        key={page}
                        className={`${s.pageButton} ${currentPage === page ? s.active : ''}`}
                        onClick={() => handlePageClick(page)}
                        aria-label={`Страница ${page}`}
                        aria-current={currentPage === page ? 'page' : undefined}
                    >
                        {page}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Pagination;