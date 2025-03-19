// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

// src/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], totalQuantity: 0, totalPrice: 0 },
  reducers: {
    addItem: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (!existingItem) {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.totalQuantity++;
      state.totalPrice += action.payload.price;
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload.id);
      state.totalQuantity--;
      state.totalPrice -= action.payload.price;
    },
  },
});

export const { addItem, removeItem } = cartSlice.actions;
export default cartSlice.reducer;

// src/components/LandingPage.jsx
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="landing">
      <h1>Houseplant Haven</h1>
      <p>Your one-stop shop for beautiful houseplants!</p>
      <Link to="/products"><button>Get Started</button></Link>
    </div>
  );
}

// src/components/ProductList.jsx
import { useDispatch } from 'react-redux';
import { addItem } from '../cartSlice';

const products = [
  { id: 1, name: 'Fern', price: 15, image: 'fern.jpg' },
  { id: 2, name: 'Cactus', price: 10, image: 'cactus.jpg' },
  { id: 3, name: 'Aloe Vera', price: 12, image: 'aloe.jpg' },
];

export default function ProductList() {
  const dispatch = useDispatch();
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <img src={product.image} alt={product.name} />
          <h3>{product.name}</h3>
          <p>${product.price}</p>
          <button onClick={() => dispatch(addItem(product))}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
}

// src/components/CartPage.jsx
import { useSelector, useDispatch } from 'react-redux';
import { removeItem } from '../cartSlice';

export default function CartPage() {
  const { items, totalPrice } = useSelector(state => state.cart);
  const dispatch = useDispatch();

  return (
    <div>
      <h2>Shopping Cart</h2>
      {items.map(item => (
        <div key={item.id}>
          <h3>{item.name}</h3>
          <p>${item.price} x {item.quantity}</p>
          <button onClick={() => dispatch(removeItem(item))}>Remove</button>
        </div>
      ))}
      <h3>Total: ${totalPrice}</h3>
    </div>
  );
}

// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import ProductList from './components/ProductList';
import CartPage from './components/CartPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </Router>
  );
}

// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);
