import './App.css';
import 'react-notifications/lib/notifications.css';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { NotificationContainer } from 'react-notifications';

//Komponente
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import Landing from './components/users/Landing';
import Login from './components/users/Login';
import Registration from './components/users/Registration';
import ResetPassword from './components/users/ResetPassword';
import Welcome from './components/users/auth/Welcome';
import Products from './components/users/products/Products';
import ProductList from './components/admin/ProductList';
import AddProduct from './components/admin/AddProduct';
import EditProduct from './components/admin/EditProduct';
import AuthService from './services/AuthService';
import ProtectedRoute from './helpers/ProtectedRoute';
import Product from './components/users/products/Product';
import SearchResult from './components/users/products/SearchResult';
import ChangePassword from './components/users/auth/ChangePassword';
import Cart from './components/users/Cart';
import PurchaseHistory from './components/users/auth/PurchaseHistory';
import UserActivity from './components/admin/UserActivity';
import Users from './components/admin/Users';

function App() {

  //JWT sa dummy userom
  if (!localStorage.user) {
    const dummy = {
      accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6W3sibmFtZSI6ImR1bW15In1dfQ.C2pQz3n4_ck0_kpr9TgBsfocUhEBf7wiqO7DUsQ8Y-A"
    }
    localStorage.setItem('user', JSON.stringify(dummy));
  }

  //Inicijalizacija korpe
  if (!sessionStorage.cartItems) {
    sessionStorage.setItem('cartItems', JSON.stringify([]));
  }

  //Inicijalizacija broja za korpu
  if (isNaN(sessionStorage.cart)) {
    sessionStorage.setItem('cart', 0);
  }

  return (
    <div className="App">
      <Router>
        <Navbar />
        <Switch>

          {/* Visitor */}
          <ProtectedRoute exact path="/" component={Landing} isAuth={jwtDecode(AuthService.getCurrentUser().accessToken).roles[0].name.includes("dummy")} />
          <ProtectedRoute exact path="/login" component={Login} isAuth={jwtDecode(AuthService.getCurrentUser().accessToken).roles[0].name.includes("dummy")} />
          <ProtectedRoute exact path="/registration" component={Registration} isAuth={jwtDecode(AuthService.getCurrentUser().accessToken).roles[0].name.includes("dummy")} />
          <ProtectedRoute exact path="/reset-password" component={ResetPassword} isAuth={jwtDecode(AuthService.getCurrentUser().accessToken).roles[0].name.includes("dummy")} />

          {/* Visitor and User */}
          <ProtectedRoute exact path="/products" component={Products} isAuth={!jwtDecode(AuthService.getCurrentUser().accessToken).roles[0].name.includes("admin")} />
          <ProtectedRoute exact path="/product/:id" component={Product} isAuth={!jwtDecode(AuthService.getCurrentUser().accessToken).roles[0].name.includes("admin")} />
          <ProtectedRoute exact path="/search-result/:data" component={SearchResult} isAuth={!jwtDecode(AuthService.getCurrentUser().accessToken).roles[0].name.includes("admin")} />
          <ProtectedRoute exact path="/cart" component={Cart} isAuth={!jwtDecode(AuthService.getCurrentUser().accessToken).roles[0].name.includes("admin")} />

          {/* User */}
          <ProtectedRoute exact path="/welcome" component={Welcome} isAuth={jwtDecode(AuthService.getCurrentUser().accessToken).roles[0].name.includes("user")} />
          <ProtectedRoute exact path='/change-password' component={ChangePassword} isAuth={jwtDecode(AuthService.getCurrentUser().accessToken).roles[0].name.includes("user")} />
          <ProtectedRoute exact path='/purchase-history' component={PurchaseHistory} isAuth={jwtDecode(AuthService.getCurrentUser().accessToken).roles[0].name.includes("user")} />

          {/* Admin */}
          <ProtectedRoute exact path="/product-list" component={ProductList} isAuth={jwtDecode(AuthService.getCurrentUser().accessToken).roles[0].name.includes("admin")} />
          <ProtectedRoute exact path="/add-product" component={AddProduct} isAuth={jwtDecode(AuthService.getCurrentUser().accessToken).roles[0].name.includes("admin")} />
          <ProtectedRoute exact path="/edit-product/:id" component={EditProduct} isAuth={jwtDecode(AuthService.getCurrentUser().accessToken).roles[0].name.includes("admin")} />
          <ProtectedRoute exact path="/users" component={Users} isAuth={jwtDecode(AuthService.getCurrentUser().accessToken).roles[0].name.includes("admin")} />
          <ProtectedRoute exact path="/user-activity/:id" component={UserActivity} isAuth={jwtDecode(AuthService.getCurrentUser().accessToken).roles[0].name.includes("admin")} />

        </Switch>
        <Footer />
      </Router>
      <NotificationContainer />
    </div>
  );
}

export default App;