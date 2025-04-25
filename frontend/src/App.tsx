import './App.css';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { LoadingProvider } from './context/LoadingContext';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <LoadingProvider>
      <CartProvider>
    <AuthProvider>
      <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
    </AuthProvider>
    </CartProvider>
    </LoadingProvider>
  );
}

export default App;
