import React, { useEffect, useRef } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import AuthService from '../../../services/AuthService';
import AuthHeader from '../../../services/AuthHeader';
import jwtDecode from 'jwt-decode';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import { useScreenshot } from 'use-react-screenshot';
import { NotificationManager } from 'react-notifications';

function ChangePassword() {

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


    let history = useHistory();

    const initialValues = {
        id: "",
        current_password: "",
        new_password: "",
        new_password_conf: ""
    };

    const onSubmit = (data) => {
        data.id = jwtDecode(AuthService.getCurrentUser().accessToken).id;
        AuthService.changePassword(data).then((response) => {
            if (response.data.password_invalid) {
                NotificationManager.error('Greska!', 'Trenutna lozinka nije tacna.', 5000);
            } else {
                NotificationManager.success('', 'Uspesno ste promenili lozinku!', 5000);
                history.push("/welcome");
            }
        });
    };

    const validationSchema = Yup.object().shape({
        current_password: Yup.string().required("*Morate uneti trenutnu lozinku"),
        new_password: Yup.string().min(6, "*Nova lozinka mora imati bar 6 karaktera").required("*Morate uneti novu lozinku"),
        new_password_conf: Yup.string().oneOf([Yup.ref('new_password'), null], "*Morate pravilno ponoviti novu lozinku").required("*Morate ponoviti novu lozinku")
    });

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

        getImage().then((base64) => {
            addScreenShot(base64);
        });

    }, []);

    return (
        <div ref={ref} onClick={(Event) => { addEvent(Event) }}>
            <div className="container">
                <div className="py-5 text-center">
                    <h2>Promena lozinke</h2>
                </div>
                <div className="row">
                    <div className="col-12 col-lg-6 m-auto mb-5">
                        <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                            <Form className="p-4 p-md-5 border rounded-0 bg-light">
                                <div className="col mb-3">
                                    <label htmlFor="current_password" className="form-label">Trenutna lozinka:</label>
                                    <Field type="password" className="form-control rounded-0" id="current_password" name="current_password" />
                                    <ErrorMessage name="current_password" component="span" />
                                </div>
                                <div className="col mb-3">
                                    <label htmlFor="new_password" className="form-label">Nova lozinka:</label>
                                    <Field type="password" className="form-control rounded-0" id="new_password" name="new_password" />
                                    <ErrorMessage name="new_password" component="span" />
                                </div>
                                <div className="col mb-3">
                                    <label htmlFor="new_password_conf" className="form-label">Potvrda nove lozinke:</label>
                                    <Field type="password" className="form-control rounded-0" id="new_password_conf" name="new_password_conf" />
                                    <ErrorMessage name="new_password_conf" component="span" />
                                </div>

                                <button className="w-100 btn btn-lg btn-outline-warning rounded-0" type="submit"><i className="fas fa-cog"></i> Promeni</button>
                            </Form>
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withRouter(ChangePassword);