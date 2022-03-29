import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { withRouter, Link, useHistory } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import jwtDecode from 'jwt-decode';
import { useScreenshot } from 'use-react-screenshot';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import NotificationManager from 'react-notifications/lib/NotificationManager';

function Cart() {
    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }

    let history = useHistory();

    var [cart, setCart] = useState();
    var [isEmptyCart, setIsEmptyCart] = useState(true);
    let totalCart = 0;
    var [total, setTotal] = useState();
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
            console.log("Success");
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

    const initialValues = {
        first_name: jwtDecode(AuthService.getCurrentUser().accessToken).first_name,
        last_name: jwtDecode(AuthService.getCurrentUser().accessToken).last_name,
        address: jwtDecode(AuthService.getCurrentUser().accessToken).address,
        city: jwtDecode(AuthService.getCurrentUser().accessToken).city,
        phone_number: jwtDecode(AuthService.getCurrentUser().accessToken).phone_number,
        email: jwtDecode(AuthService.getCurrentUser().accessToken).email
    };

    const phoneReg = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

    const validationSchema = Yup.object().shape({
        first_name: Yup.string().required("*Morate uneti ime"),
        last_name: Yup.string().required("*Morate uneti prezime"),
        address: Yup.string().required("*Morate uneti adresu"),
        city: Yup.string().required("*Morate uneti grad"),
        phone_number: Yup.string().matches(phoneReg, "*Broj nije validan").required("*Morate uneti broj telefona"),
        email: Yup.string().email("*Email nije validan").required("*Morate uneti e-mail")
    });

    const onSubmit = (data) => {
        data.id = jwtDecode(AuthService.getCurrentUser().accessToken).id;
        data.total = total;
        data.items = JSON.parse(sessionStorage.cartItems);
        axios.post("http://localhost:8080/api/auth/buy", data).then((response) => {
            if (response.data.no_data) {
                // console.log(response.data.no_data);
            } else {
                NotificationManager.success('Sifru porudzbine ce Vam biti poslata na e-mail.', 'Uspesna kupovina!', 5000);
                sessionStorage.setItem('cartItems', []);
                sessionStorage.setItem('cart', 0);
                setTimeout(function () { window.location.reload(history.push('/welcome')) }, 1500)
            }
        });
    }

    const removeItem = (data) => {
        let items = JSON.parse(sessionStorage.cartItems);

        for (let i = 0; i < items.length; i++) {
            if (items[i]._id === data._id) {
                if (items[i].qty > 1) {
                    items[i].qty--;
                    items[i].total = parseInt(items[i].total) - parseInt(data.price);
                    sessionStorage.setItem('cartItems', JSON.stringify(items));
                    break;
                } else {
                    items.splice(i, 1);
                    sessionStorage.setItem('cartItems', JSON.stringify(items));
                    break;
                }
            }
        }

        let current = parseInt(sessionStorage.cart);
        sessionStorage.setItem('cart', current - 1);
        window.location.reload();
    }

    const StyledLink = styled(Link)`
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;

    useEffect(() => {
        if (!isEmpty(JSON.parse(sessionStorage.cartItems))) {
            setCart(JSON.parse(sessionStorage.cartItems));
            setIsEmptyCart(false);

            for (let i = 0; i < JSON.parse(sessionStorage.cartItems).length; i++) {
                totalCart += parseInt(JSON.parse(sessionStorage.cartItems)[i].total);
                setTotal(totalCart);
            }
        }

      
            setTimeout(
              function() {
                if (jwtDecode(AuthService.getCurrentUser().accessToken).roles[0].name.includes("user")) {
                    getImage().then((base64) => {
                        addScreenShot(base64);
                    });
                }
              }, 1000);
        

    }, []);


    if (isEmptyCart) {
        return <div ref={ref} className="text-center mt-5 h1">Korpa je prazna...</div>
    } else {
        return (
            <div ref={ref} onClick={(Event) => { addEvent(Event) }}>
                <div className="container">
                    <div className="py-5 text-center">
                        <h2>Korpa</h2>
                    </div>
                    <table className="table text-center">
                        <thead>
                            <tr>
                                <th scope="col">Naziv proizvoda</th>
                                <th scope="col">Kolicina</th>
                                <th scope="col">Ukupno</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((value, key) => {
                                return (
                                    <tr key={value._id}>
                                        <th scope="row"><strong className="text-success">{value.title}</strong></th>
                                        <td><strong className="text-secondary">x{value.qty}</strong></td>
                                        <td><strong className="text-primary">{value.total}.oo RSD</strong></td>
                                        <td><button className="btn btn-danger rounded-0" onClick={() => { removeItem(value) }} ><i className="fas fa-trash"></i></button></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>

                    <div className="text-end">
                        <p className="lead"><b>Ukupno: {total}.oo RSD</b></p>
                    </div>

                    {/* Za visitore */}
                    {jwtDecode(AuthService.getCurrentUser().accessToken).roles[0].name.includes("dummy") && (
                        <>
                            <div className="text-center">
                                <p className="lead"><b><StyledLink to="/login">Klikni da se prijavis i zavrsis kupovinu</StyledLink></b></p>
                            </div>
                        </>
                    )}

                    {/* Za usere */}
                    {jwtDecode(AuthService.getCurrentUser().accessToken).roles[0].name.includes("user") && (
                        <>
                            <div className="row">
                                <div className="col-12 col-lg-6 m-auto mb-5">
                                    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                                        <Form className="p-4 p-md-5 border rounded-0 bg-light">
                                            <div className="py-1 text-center">
                                                <h4>Podaci za dostavu</h4>
                                            </div>
                                            <div className="col">
                                                <label htmlFor="first_name" className="form-label">Ime:</label>
                                                <Field type="text" className="form-control rounded-0" id="first_name" name="first_name" placeholder="exp. Forrest" />
                                                <ErrorMessage name="first_name" component="span" />
                                            </div>

                                            <div className="col mb-4 mt-3">
                                                <label htmlFor="last_name" className="form-label">Prezime:</label>
                                                <Field type="text" className="form-control rounded-0" id="last_name" name="last_name" placeholder="exp. Gump" />
                                                <ErrorMessage name="last_name" component="span" />
                                            </div>

                                            <div className="col mb-4 mt-3">
                                                <label htmlFor="address" className="form-label">Adresa:</label>
                                                <Field type="text" className="form-control rounded-0" id="address" name="address" placeholder="exp. Kraljice Marije 1" />
                                                <ErrorMessage name="address" component="span" />
                                            </div>

                                            <div className="col mb-4 mt-3">
                                                <label htmlFor="city" className="form-label">Grad:</label>
                                                <Field type="text" className="form-control rounded-0" id="city" name="city" placeholder="exp. Beograd" />
                                                <ErrorMessage name="city" component="span" />
                                            </div>

                                            <div className="col mb-4 mt-3">
                                                <label htmlFor="phone_number" className="form-label">Broj telefona:</label>
                                                <Field type="number" className="form-control rounded-0" id="phone_number" name="phone_number" placeholder="exp. 1234567" />
                                                <ErrorMessage name="phone_number" component="span" />
                                            </div>

                                            <div className="col mb-4 mt-3">
                                                <label htmlFor="email" className="form-label">E-mail:</label>
                                                <Field type="email" className="form-control rounded-0" id="email" name="email" placeholder="exp. forrest@gump.com" />
                                                <ErrorMessage name="email" component="span" />
                                            </div>
                                            <hr className="my-4" />
                                            <button className="w-100 btn btn-lg btn-outline-success rounded-0" type="submit">Kupi <i className="fas fa-credit-card"></i></button>

                                        </Form>
                                    </Formik>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    }
}

export default withRouter(Cart);