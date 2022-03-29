import React from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { NotificationManager } from 'react-notifications';


function ResetPassword() {

    let history = useHistory();

    const initialValues = {
        email: ""
    };

    const onSubmit = (data) => {
        AuthService.resetPassword(data).then((response) => {
            if (response.data.user_not_found) {
                NotificationManager.error('E-mail koji ste uneli nije povezan ni sa jednim nalogom.', 'Greska!', 5000);
            } else {
                NotificationManager.success('Nova lozinka je poslata na e-mail.', 'Uspesno!', 5000);
                history.push('/login');
            }
        })
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email("*Email nije validan").required("*Morate uneti e-mail")
    });

    return (
        <div>
            <div className="container">
                <div className="py-5 text-center">
                    <h2>Resetovanje lozinke</h2>
                </div>
                <div className="row">
                    <div className="col-12 col-lg-6 m-auto mb-5">
                        <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                            <Form className="p-4 p-md-5 border rounded-0 bg-light">
                                <div className="col mb-3">
                                    <label htmlFor="email" className="form-label">E-mail:</label>
                                    <Field type="email" className="form-control rounded-0" id="email" name="email" placeholder="exp. forest@gump.com" />
                                    <ErrorMessage name="email" component="span" />
                                </div>

                                <button className="w-100 btn btn-lg btn-outline-danger rounded-0" type="submit"><i className="far fa-paper-plane"></i> Posalji</button>
                            </Form>
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withRouter(ResetPassword);