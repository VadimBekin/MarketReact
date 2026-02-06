import s from './s.module.css';


interface SkeletonProps {
    count?: number;
}

export default function Skeleton({ count = 12 }: SkeletonProps) {
    return (
        <div className={s.skeletonGrid}>
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className={s.skeletonCard}>
                    <div className={s.skeletonRatingContainer}>
                        <div className={s.skeletonRating}></div>
                        <div className={s.skeletonReviews}></div>
                    </div>

                    <div className={s.skeletonImageContainer}></div>

                    <div className={s.skeletonTitle}></div>

                    <div className={s.skeletonPriceSection}>
                        <div className={s.skeletonPrice}></div>
                        <div className={s.skeletonStock}></div>
                    </div>

                    <div className={s.skeletonDescription}>
                        <div className={s.skeletonLine}></div>
                        <div className={s.skeletonLine}></div>
                        <div className={s.skeletonLine}></div>
                    </div>

                    <div className={s.skeletonCategory}>
                        <div className={s.skeletonCategoryText}></div>
                        <div className={s.skeletonButton}></div>
                    </div>
                </div>
            ))}
        </div>
    );
}