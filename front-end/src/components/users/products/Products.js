import React, { useEffect, useRef, useState } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import axios from 'axios';
import AuthService from '../../../services/AuthService';
import jwtDecode from 'jwt-decode';
import { useScreenshot } from 'use-react-screenshot';


function Products() {

    var [productList, setProductList] = useState([]);
    var [loading, setLoading] = useState(true);

    let history = useHistory();

    var ref = useRef(null);
    var [screenShot, getScreenShot] = useScreenshot();
    const getImage = () => getScreenShot(ref.current);

    const addScreenShot = (image) => {
        var today = new Date();
        var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var time_entered = date + ' ' + time;
        let data = {
            id: jwtDecode(AuthService.getCurrentUser().accessToken).id,
            ss: {
                image, time_entered
            }
        };

        axios.post("http://localhost:8080/api/auth/screenshot", data).then((response) => {
            // console.log(response.data);
        });
    }
    const addEvent = (Event) => {
        if (jwtDecode(AuthService.getCurrentUser().accessToken).roles[0].name.includes("user")) {
            var today = new Date();
            var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var action_time = date + ' ' + time;

            var x = Event.clientX;
            var y = Event.clientY;
            var coords = "X: " + x + " Y: " + y;

            var path = window.location.pathname;

            let data = {
                id: jwtDecode(AuthService.getCurrentUser().accessToken).id,
                event: {
                    action: "klik",
                    coords,
                    action_time,
                    path
                }
            }

            axios.post("http://localhost:8080/api/auth/activity", data).then((response) => {
                //console.log(response.data);
            });
        }
    }

    const addToCart = (data) => {
        let items = JSON.parse(sessionStorage.cartItems);
        let found = false;

        for (let i = 0; i < items.length; i++) {
            if (items[i]._id === data._id) {
                items[i].qty++;
                items[i].total = parseInt(items[i].total) + parseInt(data.price);
                sessionStorage.setItem('cartItems', JSON.stringify(items));
                found = true;
                break;
            }
        }
        if (found === false) {
            data.qty = 1;
            data.total = data.price;
            items.push(data);
            sessionStorage.setItem('cartItems', JSON.stringify(items));
        }
        let current = parseInt(sessionStorage.cart);
        sessionStorage.setItem('cart', current + 1);
        window.location.reload();
    }

    useEffect(() => {
        axios.get("http://127.0.0.1:8080/api/products-all").then((response) => {
            setProductList(response.data);
            setLoading(false);
            if (jwtDecode(AuthService.getCurrentUser().accessToken).roles[0].name.includes("user")) {
                getImage().then((base64) => {
                    addScreenShot(base64);
                });
            }
        });

    }, []);

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <div ref={ref} onClick={(Event) => { addEvent(Event) }} className="container">
                    <div className="py-4 text-center">
                        <h2>Proizvodi</h2>
                    </div>
                    <div className="row mb-2" >
                        {productList.map((value) => {
                            return (
                                <div className="col-md-6 mt-5" key={value._id}>
                                    <div className="row g-0 border rounded-0 overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
                                        <div className="col p-4 d-flex flex-column position-static">
                                            <p className="lead">Naziv:</p>
                                            <h3 className="mb-0 mb-4">{value.title}</h3>
                                            <div className="mb-1 text-muted"><p className="h5">Opis:</p> {value.description}</div>
                                            <div className="mb-1 text-muted"><p className="h4">Cena: {value.price}.oo RSD</p></div>
                                            <button className="btn btn-outline-primary rounded-0 btn-md mt-2 mb-3" type="button" onClick={() => { addToCart(value) }}><i className="fas fa-cart-plus"></i> Dodaj u korpu</button>
                                            <button className="btn btn-warning rounded-0 btn-md mt-2 mb-3" type="button" onClick={() => { history.push(`/product/${value._id}`) }}><i className="fas fa-info-circle"></i> Detaljnije</button>
                                        </div>
                                        <div className="col-auto d-none d-lg-block m-auto">
                                            <img className="bd-placeholder-img" width="200" height="281" src={value.image} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Products);