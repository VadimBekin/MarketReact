import s from './style.module.css';
import { useEffect, useState, useMemo } from "react";
import cartIcon from '../assets/cart.png'
import Pagination from '../Pagination/Pagination';
import type { Product } from '../Product';
import Filter from '../Filter/Filter';
import Skeleton from '../Skeleton/Skeleton';
import { useNavigate, useLocation } from "react-router-dom";

export default function Catalog() {
    const [card, setCard] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 12;
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [sortOption, setSortOption] = useState<string>('default');
    const [cartItems, setCartItems] = useState<Set<number>>(new Set());
    const navigate = useNavigate();



    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const query = params.get('q') || '';
        setSearchQuery(query);
        setCurrentPage(1);
    }, [location.search]);



    useEffect(() => {
        const fetchCard = async () => {
            try {
                const response = await fetch('https://fakestoreapi.com/products');
                if (!response.ok) {
                    throw new Error('Error fetch');
                }
                const data: Product[] = await response.json();
                setCard(data);
            } catch (error: unknown) {
                console.error('Ошибка загрузки:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCard();
    }, []);

    useEffect(() => {
        const loadCartState = () => {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const itemIds = cart.map((item: any) => item.id);
            setCartItems(new Set(itemIds));
        };
        loadCartState();
        const handleStorageChange = () => {
            loadCartState();
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const filterAndSort = useMemo(() => {
        let result = [...card];
        if (selectedCategory) {
            result = result.filter(product =>
                product.category.toLowerCase() === selectedCategory.toLowerCase()
            );
        }
        if (searchQuery.trim()) {
            const term = searchQuery.toLowerCase().trim();
            result = result.filter(product =>
                product.title.toLowerCase().includes(term) ||
                product.description.toLowerCase().includes(term) ||
                product.category.toLowerCase().includes(term)
            );
        }
        if (selectedCategory) {
            result = result.filter(product =>
                product.category.toLowerCase() === selectedCategory.toLowerCase()
            );
        }


        switch (sortOption) {
            case 'price-asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                result.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'name-desc':
                result.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case 'rating-desc':
                result.sort((a, b) => b.rating.rate - a.rating.rate);
                break;
            default:
                break;
        }

        return result;
    }, [card, searchQuery, selectedCategory, sortOption]);

    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filterAndSort.slice(startIndex, endIndex);
    };


    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCategory = ( category: string ) => {
        setSelectedCategory(category);
        setCurrentPage(1);
    }

    const handleSort =( option: string ) => {
        setSortOption(option);
        setCurrentPage(1);
    }

    const currentItems = getCurrentPageItems();
    const totalPages = Math.ceil(filterAndSort.length / itemsPerPage);


    const handleAddTocart = (product: Product) => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existItem = cart.findIndex((item: any) => item.id === product.id);
        if (existItem !== -1) {
            cart[existItem].quantity = 1;
        } else {
            cart.push({
                id: product.id,
                title: product.title,
                price: product.price,
                description: product.description,
                category: product.category,
                image: product.image,
                rating: product.rating,
                quantity: 1
            });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        setCartItems(prev => new Set(prev).add(product.id));
        window.dispatchEvent(new Event('cartUpdated'));
    };



    const isInCart = (productId: number) => {
        return cartItems.has(productId);
    };

    const showToast = (message: string) => {
        const toast = document.createElement('div');
        toast.textContent = message;
        const toastStyles = {
            position: 'fixed',
            top: '70px',
            right: '30px',
            background: '#4CAF50',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            zIndex: '9999',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            maxWidth: '300px',
            wordWrap: 'break-word',
            transform: 'translateX(100%)',
            opacity: '0',
            transition: 'all 0.3s ease'
        };
        Object.assign(toast.style, toastStyles);
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
            toast.style.opacity = '1';
        }, 10);
        const hideToast = () => {
            toast.style.transform = 'translateX(100%)';
            toast.style.opacity = '0';

            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        };
        const timeoutId = setTimeout(hideToast, 3000);
        toast.addEventListener('click', () => {
            clearTimeout(timeoutId);
            hideToast();
        });

        return toast;
    };

    const handleToCartAndToast = (product: Product) => {
        if (isInCart(product.id)) {
            navigate('/cart');
        } else {
            handleAddTocart(product);
            showToast('Товар добавлен в корзину!');
        }
    }


    if (loading) {
        return (
            <div className={s.catalog}>
                <div className={s.container}>
                    <h1 className={s.title}>Каталог товаров</h1>
                </div>
                <Skeleton count={itemsPerPage} />
            </div>
        );
    }

    const handleShowAllProducts = () => {
        setSearchQuery('');
        setCurrentPage(1);
        window.dispatchEvent(new Event('clearSearchInput'));
        setTimeout(() => {
            window.dispatchEvent(new Event('clearSearchInput'));
        }, 50);
        navigate('/catalog', { replace: true });
    }



    return (
        <div className={s.catalog}>
            <div className={s.container}>
                <h1 className={s.title}>Каталог товаров</h1>
                {searchQuery && (
                    <div className={s.searchInfo}>
                        <p>
                            Результаты поиска по запросу: <strong>"{searchQuery}"</strong>
                            <span style={{ marginLeft: '15px', color: '#666' }}>
                                Найдено товаров: {filterAndSort.length}
                            </span>
                        </p>
                    </div>
                )}
            </div>
            {!loading && card.length > 0 && (
                <Filter products={card}
                        onFilterChange={handleCategory}
                        onSortChange={handleSort}
                        selectedCategory={selectedCategory}/>
            )}
            {card.length === 0 && !loading ? (
                <div className={s.noProducts}>
                    <p>Товары не найдены</p>
                    <button onClick={() => window.location.reload()}>Показать все</button>
                </div>
            ) : (
                <>
                    <div className={s.productsGrid}>
                        {currentItems.map((product: Product) => (
                            <div key={product.id} className={s.productCard}>
                                <div className={s.ratingContainer}>
                                    <div className={s.rating}>
                                        {'★'.repeat(Math.round(product.rating.rate || 0))}
                                        {'☆'.repeat(5 - Math.round(product.rating.rate || 0))}
                                        <span className={s.ratingText}>({product.rating.rate || 0})</span>
                                    </div>
                                    <span className={s.reviews}>{product.rating.count || 0} отзывов</span>
                                </div>
                                <div className={s.imageContainer}>
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className={s.productImage}
                                        loading="lazy"
                                    />
                                </div>
                                <h3 className={s.productTitle}>{product.title}</h3>
                                <div className={s.priceSection}>
                                    <span className={s.price}>{product.price} $</span>
                                    <a>● В наличии</a>
                                </div>
                                <div>
                                    <p className={s.description}>
                                        {product.description.length > 90
                                            ? `${product.description.substring(0, 90)}...`
                                            : product.description}
                                    </p>
                                </div>
                                <div className={s.category}>
                                    <span>{product.category}</span>
                                    <button onClick={() => handleToCartAndToast(product)}
                                            className={isInCart(product.id) ? s.inCart : ''}
                                    >
                                        <img src={cartIcon}
                                             className={s.cartIcon}
                                             alt="Корзина"
                                        />
                                        {isInCart(product.id) ? 'Корзина ' : 'Добавить в корзину'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {!loading && filterAndSort.length === 0 && (
                        <div className={s.noProducts}>
                            {searchQuery ? (
                                <div>
                                    <p>По запросу "{searchQuery}" ничего не найдено</p>
                                    <button onClick={handleShowAllProducts}>
                                        Показать все товары
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <p>Товары не найдены</p>
                                    <button onClick={handleShowAllProducts}>Показать все</button>
                                </div>
                            )}
                        </div>
                    )}

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
        </div>
    );
}