import React, { useEffect, useState } from 'react';
import { useHistory, useParams, withRouter } from 'react-router-dom';
import axios from 'axios';
import AuthService from '../../services/AuthService';
import AuthHeader from '../../services/AuthHeader';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import FileBase64 from 'react-file-base64';


function EditProduct() {

    let history = useHistory();

    let { id } = useParams();

    var [product, setProduct] = useState([]);
    var [loading, setLoading] = useState(true);
    var [image, setImage] = useState([]);

    useEffect(() => {

        axios.get("http://localhost:8080/api/auth/admin", {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': AuthHeader()['x-access-token']
            }
        }).then((response) => {
            if (response.data.unauthorized) {
                AuthService.logout();
            }
        });

        axios.get(`http://127.0.0.1:8080/api/products-single/${id}`).then((response) => {
            setProduct(response.data);
            setLoading(false);
        });
    }, [id]);

    const initialValues = {
        title: product.title,
        price: product.price,
        description: product.description,
        image: product.image
    };

    const validationSchema = Yup.object().shape({
        title: Yup.string().required("*Morate uneti naziv proizvoda"),
        price: Yup.number().required("*Morate uneti cenu proizvoda"),
        description: Yup.string().required("*Morate uneti opis proizvoda")
    });

    const onSubmit = (data) => {
        if (typeof image.base64 === 'undefined') {
            axios.put(`http://127.0.0.1:8080/api/products-edit/${id}`, data).then(() => {
                history.push('/product-list');
                setLoading(true);
            });
        } else {
            data.image = image.base64;
            axios.put(`http://127.0.0.1:8080/api/products-edit/${id}`, data).then(() => {
                history.push('/product-list');
                setLoading(true);
            });
        }
    };

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
                <div className="container">
                    <div className="py-5 text-center">
                        <h2>Uredjivanje proizvoda</h2>
                    </div>
                    <div className="row">
                        <div className="col-12 col-lg-6 m-auto mb-5">
                            <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                                <Form className="p-4 p-md-5 border rounded-0 bg-light">

                                    <div className="col">
                                        <label htmlFor="title" className="form-label">Novi naziv proizvoda:</label>
                                        <Field type="text" className="form-control rounded-0" id="title" name="title" />
                                        <ErrorMessage name="title" component="span" />
                                    </div>

                                    <div className="col mb-4 mt-3">
                                        <label htmlFor="price" className="form-label">Nova cena proizvoda:</label>
                                        <Field type="number" className="form-control rounded-0" id="price" name="price" />
                                        <ErrorMessage name="price" component="span" />
                                    </div>


                                    <div className="col mb-4 mt-3">
                                        <label htmlFor="description" className="form-label">Novi opis proizvoda:</label>
                                        <Field type="text" as="textarea" className="form-control rounded-0" id="description" name="description" />
                                        <ErrorMessage name="description" component="span" />
                                    </div>

                                    <div className="col mb-4 mt-3">
                                        <label htmlFor="password" className="form-label">Nova slika proizvoda:</label>
                                        <FileBase64 multiple={false} onDone={setImage} />
                                        <ErrorMessage name="password" component="span" />
                                    </div>

                                    <button className="w-100 btn btn-lg btn-outline-success rounded-0" type="submit"><i className="far fa-save"></i> Sacuvaj</button>
                                </Form>
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(EditProduct);