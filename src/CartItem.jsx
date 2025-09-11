import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeItem, updateQuantity } from './CartSlice';
import './CartItem.css';

const CartItem = ({ onContinueShopping }) => {
  const cart = useSelector(state => state.cart.items);
  const dispatch = useDispatch();

  // Extract the numeric value from cost (assumes $ sign)
  const parseCost = cost => {
    if (typeof cost === "string" && cost.startsWith("$")) {
      return parseFloat(cost.substring(1));
    }
    return parseFloat(cost) || 0;
  };

  // Calculate total amount for all products in the cart
  const calculateTotalAmount = () => {
    return cart.reduce((total, item) => {
      return total + (item.quantity * parseCost(item.cost));
    }, 0);
  };

  const handleContinueShopping = (e) => {
    e.preventDefault();
    if (onContinueShopping) {
      onContinueShopping();
    }
  };

  const handleIncrement = (item) => {
    dispatch(updateQuantity({ name: item.name, quantity: item.quantity + 1 }));
  };

  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      dispatch(updateQuantity({ name: item.name, quantity: item.quantity - 1 }));
    } else {
      dispatch(removeItem(item.name));
    }
  };

  return (
    <div>
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cart.map(item => (
          <div key={item.name} className="cart-item">
            <h3>{item.name}</h3>
            <p>Quantity: {item.quantity}</p>
            <p>Cost: {item.cost}</p>
            <p>Subtotal: ${(parseCost(item.cost) * item.quantity).toFixed(2)}</p>
            <button onClick={() => handleDecrement(item)}>-</button>
            <button onClick={() => handleIncrement(item)}>+</button>
            <button onClick={() => dispatch(removeItem(item.name))}>Remove</button>
          </div>
        ))
      )}
      <h3>Total Amount: ${calculateTotalAmount().toFixed(2)}</h3>
      <button onClick={handleContinueShopping}>Continue Shopping</button>
    </div>
  );
};

export default CartItem;