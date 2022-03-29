import React, { useEffect, useRef, useState } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import AuthService from '../../../services/AuthService';
import jwtDecode from 'jwt-decode';
import { useScreenshot } from 'use-react-screenshot';

function PurchaseHistory() {

    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }

    var [loading, setLoading] = useState(true);
    var [historyList, setHistoryList] = useState({});
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
            //console.log(response.data);
        });
    }

    const addEvent = (Event) => {
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

    useEffect(() => {
        axios.get(`http://localhost:8080/api/auth/history/${jwtDecode(AuthService.getCurrentUser().accessToken).id}`).then((response) => {
            setHistoryList(response.data.items);
            setLoading(false);
            getImage().then((base64) => {
                addScreenShot(base64);
            });
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
    } else if (isEmpty(historyList)) {
        return (
            <div ref={ref} onClick={(Event) => { addEvent(Event) }}>
                <div className="container">
                    <div className="py-4 text-center">
                        <h2>Nemate kupljenih proizvoda...</h2>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div ref={ref} onClick={(Event) => { addEvent(Event) }} className="container">
                <div className="py-1 text-center mt-5">
                    <h2>Istorija kupovine</h2>
                </div>
                <div className="row row-cols-1 row-cols-md-3 mb-3 text-center">
                    {historyList.map((value, key) => {
                        return (
                            <div className="col m-auto mt-5">
                                <div className="card mb-4 rounded-3 shadow-sm">
                                    <div className="card-header py-3">
                                        <h4 className="my-0 fw-normal">Kod: <b>{value.code}</b></h4>
                                    </div>
                                    <div className="card-body">
                                        <p className="lead">Ukupno:</p>
                                        <h1 className="card-title pricing-card-title">{value.total}<small className="text-muted fw-light">.oo RSD</small></h1>
                                        <ul className="list-unstyled mt-3 mb-4">
                                            <li><h4 className="text-success">Podaci: </h4></li>
                                            <li>Ime: <b>{value.first_name}</b></li>
                                            <li>Prezime: <b>{value.last_name}</b></li>
                                            <li>Broj telefona: <b>{value.phone_number}</b></li>
                                            <li>E-mail: <b>{value.email}</b></li>
                                            <li>Grad: <b>{value.city}</b></li>
                                            <li>Adresa: <b>{value.address}</b></li>
                                            <ul className="list-unstyled mt-3 mb-4">
                                                <li><h4 className="text-primary">Proizvodi: </h4></li>
                                                {value.items.map((item, key) => {
                                                    return (
                                                        <li>Naziv: <b>{item.title}</b>, Cena: <b>{item.price}</b> x <b>{item.qty}</b> = <b>{item.total}.oo RSD</b></li>
                                                    )
                                                })}
                                            </ul>
                                        </ul>

                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        )
    }
}

export default withRouter(PurchaseHistory);