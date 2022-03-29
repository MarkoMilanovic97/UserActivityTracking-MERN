import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';

function Login() {

    const initialValues = {
        email: "",
        password: ""
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email("*Email nije validan").required("*Morate uneti e-mail"),
        password: Yup.string().required("*Morate uneti lozinku")
    });

    const onSubmit = (data) => {
        AuthService.login(data);
    }

    const StyledLink = styled(Link)`
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;

    return (
        <div>
            <div className="container">
                <div className="py-5 text-center">
                    <h2>Prijava</h2>
                </div>
                <div className="row">
                    <div className="col-12 col-lg-6 m-auto mb-5">
                        <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                            <Form className="p-4 p-md-5 border rounded-0 bg-light">
                                <div className="col">
                                    <label htmlFor="title" className="form-label">E-mail:</label>
                                    <Field type="email" className="form-control rounded-0" id="email" name="email" placeholder="exp. forest@gump.com" />
                                    <ErrorMessage name="email" component="span" />
                                </div>

                                <div className="col mb-4 mt-3">
                                    <label htmlFor="password" className="form-label">Lozinka:</label>
                                    <Field type="password" className="form-control rounded-0" id="password" name="password" />
                                    <ErrorMessage name="password" component="span" />
                                </div>

                                <button className="w-100 btn btn-lg btn-outline-primary rounded-0" type="submit"><i className="fas fa-sign-in-alt"></i> Prijava</button>
                                <hr className="my-4" />
                                <p className="h5"><StyledLink to="/reset-password">Zaboravljena lozinka?</StyledLink></p>
                                <p className="h4"><StyledLink to="/registration">Nemas nalog? Registruj se.</StyledLink></p>
                            </Form>
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withRouter(Login);