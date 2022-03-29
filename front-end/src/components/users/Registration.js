import React from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { NotificationManager } from 'react-notifications';

function Registration() {

    let history = useHistory();

    const initialValues = {
        first_name: "",
        last_name: "",
        city: "",
        address: "",
        phone_number: "",
        email: "",
        password: "",
        password_conf: ""
    };

    const phoneReg = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

    const validationSchema = Yup.object().shape({
        first_name: Yup.string().required("*Morate uneti ime"),
        last_name: Yup.string().required("*Morate uneti prezime"),
        city: Yup.string().required("*Morate uneti grad"),
        address: Yup.string().required("*Morate uneti adresu"),
        phone_number: Yup.string().matches(phoneReg, "*Broj nije validan").required("*Morate uneti broj telefona"),
        email: Yup.string().email("*Email nije validan").required("*Morate uneti e-mail"),
        password: Yup.string().min(6, "*Lozinka mora imati bar 6 karaktera").required("*Morate uneti lozinku"),
        password_conf: Yup.string().oneOf([Yup.ref('password'), null], "*Morate pravilno ponoviti lozinku").required("*Morate ponoviti lozinku")
    });

    const onSubmit = (data) => {
        AuthService.register(data).then((response) => {
            if (response.data.email_exists) {
                return NotificationManager.error('Greska prilikom registracije!', 'E-mail je zauzet.', 5000);
            } else if (response.data.phone_number_exists) {
                return NotificationManager.error('Greska prilikom registracije!', 'Broj je zauzet.', 5000);
            } else {
                return NotificationManager.success('Uspesna registracija!', 'Dobrodosli!', 5000), setTimeout(function () { history.push('/login') }, 1500);
            }
        });
    };


    return (
        <div>
            <div className="container">
                <div className="py-5 text-center">
                    <h2>Registracija</h2>
                </div>
                <div className="row g-5">
                    <div className="col">
                        <h4 className="mb-3">Informacije</h4>
                        <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                            <Form>
                                <div className="row g-3">
                                    <div className="col-sm-6">
                                        <label htmlFor="first_name" className="form-label">Ime:</label>
                                        <Field type="first_name" className="form-control rounded-0" id="first_name" name="first_name" placeholder="exp. Forest" />
                                        <ErrorMessage name="first_name" component="span" />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor="last_name" className="form-label">Prezime:</label>
                                        <Field type="text" className="form-control rounded-0" id="last_name" name="last_name" placeholder="exp. Gump" />
                                        <ErrorMessage name="last_name" component="span" />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor="city" className="form-label">Grad:</label>
                                        <Field type="text" className="form-control rounded-0" id="city" name="city" placeholder="exp. Beograd" />
                                        <ErrorMessage name="city" component="span" />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor="address" className="form-label">Adresa:</label>
                                        <Field type="text" className="form-control rounded-0" id="address" name="address" placeholder="exp. Kraljice Marije 1" />
                                        <ErrorMessage name="address" component="span" />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor="phone_number" className="form-label">Broj telefona:</label>
                                        <Field type="number" className="form-control rounded-0" id="phone_number" name="phone_number" placeholder="exp. 01264567" />
                                        <ErrorMessage name="phone_number" component="span" />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor="email" className="form-label">E-mail:</label>
                                        <Field type="email" className="form-control rounded-0" id="email" name="email" placeholder="exp. forest@gump.com" />
                                        <ErrorMessage name="email" component="span" />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor="password" className="form-label">Lozinka:</label>
                                        <Field type="password" className="form-control rounded-0" id="password" name="password" />
                                        <ErrorMessage name="password" component="span" />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor="password_conf" className="form-label">Potvrda lozinke:</label>
                                        <Field type="password" className="form-control rounded-0" id="password_conf" name="password_conf" />
                                        <ErrorMessage name="password_conf" component="span" />
                                    </div>
                                </div>
                                <button className="btn btn-outline-success rounded-0 btn-lg mt-5" type="submit"><i className="fas fa-user-plus"></i> Registuj se</button>
                            </Form>
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withRouter(Registration);