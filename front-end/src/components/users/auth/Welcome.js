import React, { useEffect, useRef } from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import AuthService from '../../../services/AuthService';
import AuthHeader from '../../../services/AuthHeader';
import jwtDecode from 'jwt-decode';
import { useScreenshot } from "use-react-screenshot";
import landing_image from '../../../resources/images/landing-shop.jpg';

function Welcome() {

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
    };

    useEffect(() => {
        axios.get("http://localhost:8080/api/auth/user", {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': AuthHeader()['x-access-token']
            }
        }).then((response) => {
            if (response.data.unauthorized) {
                AuthService.logout();
            }
        });

        if (jwtDecode(AuthService.getCurrentUser().accessToken).roles[0].name.includes("user")) {
            getImage().then((base64) => {
                addScreenShot(base64);
            });
        }
    }, []);

    return (
        <div ref={ref} onClick={(Event) => { addEvent(Event) }}>
            <div>
            <div className="container-fluid">
                <div className="container my-5">
                    <div className="row p-4 pb-0 pe-lg-0 pt-lg-5 align-items-center rounded-3 border shadow-lg">
                        <div className="col-lg-7 p-3 p-lg-5 pt-lg-3">
                            <h4>Dragi korisnice,</h4>
                            <p className="lead">Brzo, lako i sigurno pretrazite i kupite proizvode koji te interesuju!<br /></p>
                            <p className="lead">Pogledaj proizvode i pocni da kupujes po najjeftinijim cenama na trzistu!</p>
                            <div className="d-grid gap-2 d-md-flex justify-content-md-start mb-4 mb-lg-3">
                                <Link to="/products" className="btn btn-primary rounded-0 btn-lg m-auto mt-5 px-4 fw-bold">Katalog</Link>
                                
                            </div>
                        </div>
                        <div className="col-lg-4 p-0 mb-5 overflow-hidden shadow-lg">
                            <img src={landing_image} height="400" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    )
}

export default withRouter(Welcome);