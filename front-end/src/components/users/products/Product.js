import React, { useEffect, useRef, useState } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import axios from 'axios';
import AuthService from '../../../services/AuthService';
import jwtDecode from 'jwt-decode';
import { useScreenshot } from 'use-react-screenshot';

function Product() {

    let { id } = useParams();

    var [product, setProduct] = useState();
    var [loading, setLoading] = useState(true);
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
                // console.log(response.data);
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
        axios.get(`http://127.0.0.1:8080/api/products-single/${id}`).then((response) => {
            setProduct(response.data);
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
            <div ref={ref} onClick={(Event) => { addEvent(Event) }}>
                <div className="container">
                    <div className="row bg-light mt-5">
                        <div className="py-1 text-center mt-5">
                            <h2>{product.title}</h2>
                        </div>
                        <div className="col">
                            <img src={product.image} className="m-auto" width="400px" />
                        </div>
                        <div className="col text-center mt-5">

                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">
                                            <h3>Detalji</h3>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th scope="row"><p className="lead mt-5">Cena: <b>{product.price}.oo RSD</b></p></th>
                                    </tr>
                                    <tr>
                                        <th scope="row"><p className="lead mt-5">Opis: <b>{product.description}</b></p></th>
                                    </tr>
                                    <tr>
                                        <th scope="row">
                                            <button className="btn btn-outline-primary rounded-0 btn-md mt-5 mb-3" type="button" onClick={() => { addToCart(product) }}><i className="fas fa-cart-plus"></i> Dodaj u korpu</button>
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Product);