import s from './s.module.css';
import { useEffect, useState } from "react";
import type { Product }  from '../Product';
import {NavLink} from "react-router-dom";

export default function Cart() {
    const [cartItems, setCartItems] = useState<Product[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem("cart");
            if (saved) {
                try {
                    return JSON.parse(saved).map((item: any) => ({
                        ...item,
                        quantity: item.quantity || 1
                    }));
                } catch { return []; }
            }
        }
        return [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const updateQuantity = (id: number, newQuantity: number) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, newQuantity) } // Не меньше 1
                    : item
            )
        );
    };
    const handleDal = (id: number) => {
        setCartItems(i => i.filter(i => i.id !== id));
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const updatedCart = cart.filter((item: any) => item.id !== id);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        window.dispatchEvent(new Event('cartUpdated'));
    }

    const totalQuantity = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 0)), 0);

    if (cartItems.length === 0) {
        return (
            <div className={s.container}>
                <div className={s.emptyCart}>
                    <div className={s.emptyCartIcon}>🛒</div>
                    <h2 className={s.emptyCartTitle}>Ваша корзина пуста</h2>
                    <NavLink to="/catalog" className={s.continueShoppingBtn}>
                        Перейти в каталог
                    </NavLink>
                </div>
            </div>
        );
    }

    return (
        <div className={s.container}>
            <div className={s.allContainer}>
                <h3 className={s.cartTitle}>Корзина покупок</h3>

                {cartItems.map((item) => (
                    <div key={item.id} className={s.product}>
                        <div className={s.imgProduct}>
                            <img
                                src={item.image}
                                alt={item.title}
                                className={s.productImage}
                            />
                        </div>
                        <div className={s.nameProduct}>
                            {item.title}
                        </div>
                        <div className={s.quantityProduct}>
                            <button
                                className={s.quantityBtn}
                                onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                            >
                                -
                            </button>
                            <span>{item.quantity || 1}</span>
                            <button
                                className={s.quantityBtn}
                                onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                            >
                                +
                            </button>
                        </div>
                        <div className={s.sumProduct}>
                            <div>
                                ${(item.price * (item.quantity || 1)).toFixed(2)}
                            </div>
                            <div>
                                <button
                                onClick={() => handleDal(item.id)}
                                >Удалить</button>
                            </div>

                        </div>
                    </div>
                ))}

                <div className={s.infoAllProduct}>
                    <div>
                        {/*затычка*/}
                        <button>Оформить заказ</button>
                    </div>
                    <div className={s.allQuantityProduct}>
                        Общее количество товара - {totalQuantity} шт.
                    </div>
                    <div className={s.allSumProduct}>
                        ${subtotal.toFixed(2)}
                    </div>

                </div>

            </div>
        </div>
    );
}