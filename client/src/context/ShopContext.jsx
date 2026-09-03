import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    // Backend API URL
    // Use VITE_API_URL if available, otherwise use Render backend
    const API_URL =
        import.meta.env.VITE_API_URL || 'https://shopmatetask.onrender.com';

    console.log('API URL:', API_URL);

    useEffect(() => {
        fetchProducts();
    }, []);

    // Fetch products from backend
    const fetchProducts = async (search = '') => {
        try {
            setLoading(true);

            const response = await axios.get(
                `${API_URL}/api/products?search=${encodeURIComponent(search)}`
            );

            console.log('Products from backend:', response.data);

            // Make sure products is always an array
            if (Array.isArray(response.data)) {
                setProducts(response.data);
            } else {
                console.error(
                    'Invalid products response:',
                    response.data
                );
                setProducts([]);
            }

        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    // Add product to cart
    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(
                (item) => item._id === product._id
            );

            if (existingItem) {
                return prevCart.map((item) =>
                    item._id === product._id
                        ? {
                              ...item,
                              quantity: item.quantity + 1
                          }
                        : item
                );
            }

            return [
                ...prevCart,
                {
                    ...product,
                    quantity: 1
                }
            ];
        });
    };

    // Remove product from cart
    const removeFromCart = (productId) => {
        setCart((prevCart) =>
            prevCart.filter(
                (item) => item._id !== productId
            )
        );
    };

    // Update cart quantity
    const updateQuantity = (productId, amount) => {
        setCart((prevCart) =>
            prevCart.map((item) => {
                if (item._id === productId) {
                    const newQuantity =
                        item.quantity + amount;

                    return newQuantity > 0
                        ? {
                              ...item,
                              quantity: newQuantity
                          }
                        : item;
                }

                return item;
            })
        );
    };

    // Clear cart
    const clearCart = () => {
        setCart([]);
    };

    return (
        <ShopContext.Provider
            value={{
                products,
                cart,
                loading,
                fetchProducts,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
            }}
        >
            {children}
        </ShopContext.Provider>
    );
};