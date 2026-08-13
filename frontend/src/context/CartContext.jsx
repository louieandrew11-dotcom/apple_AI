import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('apple_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    localStorage.setItem('apple_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, selectedColor, selectedStorage) => {
    const defaultColor = (product.colors && product.colors.length > 0) ? product.colors[0] : { name: 'Standard Titanium', hex: '#343434', image: product.image };
    const defaultStorage = (product.storageOptions && product.storageOptions.length > 0) ? product.storageOptions[0] : { size: '128GB', price: product.price || 0 };

    const colorObj = selectedColor || defaultColor;
    const storageObj = selectedStorage || defaultStorage;

    const itemPrice = storageObj.price || product.price || 0;
    const colorName = colorObj.name || 'Standard';
    const storageSize = storageObj.size || 'Standard';
    const cartItemId = `${product.id}-${colorName}-${storageSize}`;

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            cartItemId,
            id: product.id,
            name: product.name,
            image: colorObj.image || product.image,
            color: colorName,
            hex: colorObj.hex || '#343434',
            storage: storageSize,
            price: itemPrice,
            quantity: 1,
          }
        ];
      }
    });

    showToast(`Added ${product.name} (${storageSize}) to Bag`);
  };

  const removeFromCart = (cartItemId) => {
    setCart(prevCart => prevCart.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, delta) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.cartItemId === cartItemId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalAmount,
      totalCount,
      toastMessage,
      showToast
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
