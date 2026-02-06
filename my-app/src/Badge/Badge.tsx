import { useState, useEffect } from 'react';

export default function Badge() {
    const [count, setCount] = useState<number>(0);

    useEffect(() => {
        const updateCount = () => {
            try {
                const cart = JSON.parse(localStorage.getItem('cart') || '[]');
                const total = cart.reduce((sum: number, item: any) =>
                    sum + (item.quantity || 1), 0);
                setCount(total);
            } catch (error) {
                setCount(0);
            }
        };

        updateCount();
        const handleCartUpdate = () => updateCount();
        window.addEventListener('cartUpdated', handleCartUpdate);

        return () => window.removeEventListener('cartUpdated', handleCartUpdate);
    }, []);

    return count;
}