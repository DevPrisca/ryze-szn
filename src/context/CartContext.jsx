import { createContext, useContext, useEffect, useState } from "react";
import { getProductById } from "../data/products.js";
import { BRAND } from "../config.js";

const CartContext = createContext(null);
const STORAGE_KEY = "ryze-cart";

function loadCart() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    // storage not available, start with an empty cart
  }
  return [];
}

export function CartProvider(props) {
  const [items, setItems] = useState(loadCart);

  // Save the cart so it is still there after a page refresh
  useEffect(
    function () {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        // ignore
      }
    },
    [items]
  );

  function addItem(id, size, qty) {
    const copy = [...items];
    let found = false;

    for (let i = 0; i < copy.length; i++) {
      if (copy[i].id === id && copy[i].size === size) {
        const newQty = Math.min(copy[i].qty + qty, 10);
        copy[i] = { id: id, size: size, qty: newQty };
        found = true;
      }
    }

    if (found === false) {
      copy.push({ id: id, size: size, qty: Math.min(qty, 10) });
    }

    setItems(copy);
  }

  function changeQty(id, size, qty) {
    if (qty < 1 || qty > 10) {
      return;
    }

    const copy = [...items];
    for (let i = 0; i < copy.length; i++) {
      if (copy[i].id === id && copy[i].size === size) {
        copy[i] = { id: id, size: size, qty: qty };
      }
    }
    setItems(copy);
  }

  function removeItem(id, size) {
    const copy = [];
    for (let i = 0; i < items.length; i++) {
      if (!(items[i].id === id && items[i].size === size)) {
        copy.push(items[i]);
      }
    }
    setItems(copy);
  }

  function clearCart() {
    setItems([]);
  }

  // Work out the totals
  let count = 0;
  let subtotal = 0;

  for (let i = 0; i < items.length; i++) {
    const product = getProductById(items[i].id);
    if (product !== null) {
      count = count + items[i].qty;
      subtotal = subtotal + product.price * items[i].qty;
    }
  }

  let delivery = 0;
  if (subtotal > 0 && subtotal < BRAND.freeDeliveryOver) {
    delivery = BRAND.deliveryFee;
  }

  const value = {
    items: items,
    count: count,
    subtotal: subtotal,
    delivery: delivery,
    total: subtotal + delivery,
    addItem: addItem,
    changeQty: changeQty,
    removeItem: removeItem,
    clearCart: clearCart,
  };

  return <CartContext.Provider value={value}>{props.children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
