import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import AuthService from '../../services/AuthService';
import jwtDecode from 'jwt-decode';
import { Formik, Form, Field } from 'formik';
import { NotificationManager, NotificationContainer } from 'react-notifications';

function Navbar() {

    let history = useHistory();

    const initialValues = {
        search: ""
    };

    const getInput = (data) => {
        let input = {
            id: jwtDecode(AuthService.getCurrentUser().accessToken).id,
            search: data
        }
        axios.post("http://localhost:8080/api/auth/input", input).then((response) => {
            // console.log(response.data);
        });
    }

    const onSubmit = (data) => {
        data = data.search;
        if (data === "") {
            NotificationManager.error('Morate uenti pojam za pretragu.', 'Greska', 5000);
        } else {
            getInput(data);
            history.push(`/search-result/${data}`);
            window.location.reload();
        }
    };

    const logOut = () => {
        AuthService.logout();
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <div className="container-fluid">

                    {/* Za visitore i usere */}
                    {!jwtDecode(AuthService.getCurrentUser().accessToken).roles[0].name.includes("admin") && <Link to="/" className="navbar-brand" >Online Shop</Link>}

                    {/* Za admina */}
                    {jwtDecode(AuthService.getCurrentUser().accessToken).roles[0].name.includes("admin") && <a className="navbar-brand" >Admin Panel</a>}

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto">

                            {/* Za visitore */}
                            {jwtDecode(AuthService.getCurrentUser().accessToken).roles[0].name.includes("dummy") && (
                                <>
                                    <li className="nav-item">
                                        <Link to="/" className="nav-link">Pocetna</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/products" className="nav-link">Proizvodi</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/login" className="nav-link">Prijava</Link>
                                    </li>
                                </>
                            )}

                            {/* Za usere */}
                            {jwtDecode(AuthService.getCurrentUser().accessToken).roles[0].name.includes("user") && (
                                <>
                                    <li className="nav-item">
                                        <Link to="/welcome" className="nav-link">Pocetna</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/products" className="nav-link">Proizvodi</Link>
                                    </li>
                                    <li className="nav-item dropdown">
                                        <a className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            {jwtDecode(AuthService.getCurrentUser().accessToken).first_name}
                                        </a>
                                        <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                            <li><Link to="/change-password" className="dropdown-item" >Promeni lozinku</Link></li>
                                            <li><Link to="/purchase-history" className="dropdown-item" >Istorija kupovine</Link></li>
                                            <li><hr className="dropdown-divider" /></li>
                                            <li><button className="dropdown-item" onClick={() => { logOut() }}><i className="fas fa-sign-out-alt"></i> Odjavi se</button></li>
                                        </ul>
                                    </li>
                                </>
                            )}

                            {/* Za admina */}
                            {jwtDecode(AuthService.getCurrentUser().accessToken).roles[0].name.includes("admin") && (
                                <>
                                    <li className="nav-item dropdown">
                                        <a className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            Panel
                                        </a>
                                        <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                            <li><Link to="/users" className="dropdown-item">Korisnici</Link></li>
                                            <li><Link to="/add-product" className="dropdown-item">Dodaj proizvod</Link></li>
                                            <li><Link to="/product-list" className="dropdown-item">Lista proizvoda</Link></li>
                                            <li><hr className="dropdown-divider" /></li>
                                            <li><button className="dropdown-item" onClick={() => { logOut() }}><i className="fas fa-sign-out-alt"></i> Odjavi se</button></li>
                                        </ul>
                                    </li>
                                </>
                            )}

                        </ul>

                        {/* Za visitore i usere */}
                        {!jwtDecode(AuthService.getCurrentUser().accessToken).roles[0].name.includes("admin") && (
                            <>

                                <ul className="navbar-nav mb-auto">
                                    <li className="nav-item me-3">
                                        <Link to="/cart" className="nav-link"><i className="fas fa-shopping-cart"></i> Korpa {sessionStorage.cart}</Link>
                                    </li>
                                    <li>
                                        <Formik initialValues={initialValues} onSubmit={onSubmit}>
                                            <Form className="d-flex">
                                                <Field className="form-control me-2 rounded-0" id="search" name="search" placeholder="Naziv proizvoda" />
                                                <button className="btn btn-outline-light rounded-0" type="submit">Trazi</button>
                                            </Form>
                                        </Formik>
                                    </li>
                                </ul>
                            </>
                        )}

                    </div>
                </div>
            </nav>
            <NotificationContainer />
        </div >
    )
}

export default Navbar;