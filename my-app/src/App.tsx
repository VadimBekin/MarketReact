import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import './styleApp.css';
import lupa from './assets/lupa.png';
import cartIcon from './assets/cart.png';
import Badge from './Badge/Badge';
import { useState, useEffect, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { useDebounce } from "./Hooks/useDebounce";


export default function App() {
    const cartCount = Badge();


    const [searchInput, setSearchInput] = useState('');
    const debouncedSearch = useDebounce(searchInput, 500);
    const navigate = useNavigate();
    const location = useLocation();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchParam = params.get('q');
        if (searchParam) {
            setSearchInput(searchParam);
        }
    }, [location.search]);

    useEffect(() => {
        if (location.pathname === '/catalog' || location.pathname === '/') {
            const params = new URLSearchParams();
            if (debouncedSearch.trim()) {
                params.set('q', debouncedSearch.trim());
            }

            const newSearch = params.toString();
            const currentSearch = location.search.slice(1);

            if (newSearch !== currentSearch) {
                navigate(`${location.pathname}${newSearch ? '?' + newSearch : ''}`, { replace: true });
            }
        }
    }, [debouncedSearch, location.pathname, navigate, location.search]);


    useEffect(() => {
        const handleClearSearchInput = () => {
            setSearchInput('');
            if (inputRef.current) {
                inputRef.current.value = '';
                inputRef.current.focus();
            }
            if (window.location.pathname.includes('/MarketReact')) {
                const url = new URL(window.location.href);
                url.searchParams.delete('q');
                window.history.replaceState({}, '', url);
            }
        };
        window.addEventListener('clearSearchInput', handleClearSearchInput);
        return () => {
            window.removeEventListener('clearSearchInput', handleClearSearchInput);
        };
    }, []);


    const handleSearch = () => {
        if (!searchInput.trim()) {
            if (location.pathname === '/catalog' || location.pathname === '/') {
                navigate(location.pathname, { replace: true });
            }
            return;
        }

        if (location.pathname !== '/catalog' && location.pathname !== '/') {
            const params = new URLSearchParams();
            params.set('q', searchInput.trim());
            navigate(`/catalog?${params.toString()}`);
        }
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleCatalogClick = () => {
        window.dispatchEvent(new Event('clearSearchInput'));
        setTimeout(() => {
            window.dispatchEvent(new Event('clearSearchInput'));
        }, 50);
        navigate('/catalog', { replace: true });
    }

    return (
        <div className='app'>
            <div className='container'>
                <nav className='navbar'>
                    <div className='navbar-catalog'>
                        <NavLink to='catalog' onClick={handleCatalogClick}>
                            Каталог
                        </NavLink>
                    </div>
                    <div className='navbar-input'>
                        <input ref={inputRef}
                               type='text'
                               value={searchInput}
                               onChange={(e) => setSearchInput(e.target.value)}
                               onKeyPress={handleKeyPress}
                               placeholder='Поиск по товарам...'
                        />
                        <button className='lupa'
                                onClick={handleSearch}>
                            <img src={lupa} alt='Search' />
                        </button>
                    </div>
                    <div className='navbar-cart'>
                        <NavLink to='cart'>
                            <div>
                                <img src={cartIcon}
                                     alt='Cart'
                                style={{
                                    cursor: 'pointer',
                                    width: '16px',
                                    height: '16px',
                                }}/>
                            </div>
                            {cartCount > 0 && (
                                    <span className='badge'>{cartCount > 9 ? '9+' : cartCount}</span>
                            )}
                            Корзина
                        </NavLink>
                    </div>
                </nav>

            </div>
            <Outlet/>
        </div>
    )
}


