import { useState, useEffect } from 'react';
import s from './s.module.css';


interface FilterProps {
    products: any[];
    onFilterChange: (category: string) => void;
    onSortChange: (sortOption: string) => void;
    selectedCategory: string;
}

export default function Filter({ products, onFilterChange, onSortChange, selectedCategory }: FilterProps) {
    const [categories, setCategories] = useState<string[]>([]);
    const [sortOption, setSortOption] = useState<string>('default');


    useEffect(() => {
        if (products.length > 0) {
            const unicCategories = Array.from(new Set
            (products.map(product => product.category)));
            setCategories(['Все категории', ...unicCategories]);
        }
    }, [products]);

    const handleAllCategory = (category: string) => {
        onFilterChange(category === 'Все категории' ? '' : category);
    }

    const handleSort = (option: string) => {
        setSortOption(option);
        onSortChange(option)
    }

    return (
        <div className={s.filterContainer}>
            <div className={s.filtrSortContainer}>
                <div className={s.filterSection}>
                    <h3 className={s.filterTitle}>Категории</h3>
                    <div className={s.categoriesList}>
                        {categories.map((category) => (
                            <button
                                key={category}
                                className={`${s.categoryButton} 
                                ${selectedCategory === 
                                (category === 'Все категории' ? '' : category) ? s.active : ''}`}
                                onClick={() => handleAllCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
                <div className={s.filterSection}>
                    <h3 className={s.filterTitle}>Сортировка</h3>
                    <select
                        className={s.sortSelect}
                        value={sortOption}
                        onChange={(e) =>
                            handleSort(e.target.value)}
                    >
                        <option value="default">По умолчанию</option>
                        <option value="price-asc">Цена: по возрастанию</option>
                        <option value="price-desc">Цена: по убыванию</option>
                        <option value="name-asc">Название: А-Я</option>
                        <option value="name-desc">Название: Я-А</option>
                        <option value="rating-desc">По рейтингу</option>
                    </select>
                </div>
            </div>


            <div className={s.filterInfo}>
                {selectedCategory && (
                    <p className={s.activeFilter}>
                        Активный фильтр: <span>{selectedCategory}</span>
                        <button
                            className={s.clearFilter}
                            onClick={() =>
                                handleAllCategory('Все категории')}
                        >
                            × Сбросить
                        </button>
                    </p>
                )}
            </div>
        </div>
    )

}