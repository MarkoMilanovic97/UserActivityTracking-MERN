import React, { useEffect, useState } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import axios from 'axios';
import AuthService from '../../services/AuthService';
import AuthHeader from '../../services/AuthHeader';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import FileBase64 from 'react-file-base64';

function AddProduct() {

    useEffect(() => {
        axios.get("http://localhost:8080/api/auth/admin", {headers: {
            'Content-Type': 'application/json',
            'x-access-token': AuthHeader()['x-access-token']
        }}).then((response) => {
            if(response.data.unauthorized){
                AuthService.logout();
            }
        });
    }, []);

    let history = useHistory();

    var [image, setImage] = useState([]);

    const initialValues = {
        title: "",
        price: "",
        description: "",
        image: ""
    };

    const validationSchema = Yup.object().shape({
        title: Yup.string().required("*Morate uneti naziv proizvoda"),
        price: Yup.number().required("*Morate uneti cenu proizvoda"),
        description: Yup.string().required("*Morate uneti opis proizvoda")
    });

    const onSubmit = (data) => {
        data.image = image.base64;
        axios.post("http://127.0.0.1:8080/api/products-add", data).then((response) => {
            history.push("/product-list");
        });
    };

    return (
        <div>
            <div className="container">
                <div className="py-5 text-center">
                    <h2>Dodavanje proizvoda</h2>
                </div>
                <div className="row">
                    <div className="col-12 col-lg-6 m-auto mb-5">
                        <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                            <Form className="p-4 p-md-5 border rounded-0 bg-light">

                                <div className="col">
                                    <label htmlFor="title" className="form-label">Naziv proizvoda:</label>
                                    <Field type="text" className="form-control rounded-0" id="title" name="title" placeholder="exp. Masina za ves" />
                                    <ErrorMessage name="title" component="span" />
                                </div>

                                <div className="col mb-4 mt-3">
                                    <label htmlFor="price" className="form-label">Cena proizvoda:</label>
                                    <Field type="number" className="form-control rounded-0" id="price" name="price" placeholder="exp. 750" />
                                    <ErrorMessage name="price" component="span" />
                                </div>


                                <div className="col mb-4 mt-3">
                                    <label htmlFor="description" className="form-label">Opis proizvoda:</label>
                                    <Field type="text" as="textarea" className="form-control rounded-0" id="description" name="description" placeholder="exp. Bela masina sa wifi sistemom..." />
                                    <ErrorMessage name="description" component="span" />
                                </div>

                                <div className="col mb-4 mt-3">
                                    <label htmlFor="password" className="form-label">Slika proizvoda:</label>
                                    <FileBase64 multiple={ false } onDone={setImage} />
                                    <ErrorMessage name="password" component="span" />
                                </div>

                                <button className="w-100 btn btn-lg btn-outline-success rounded-0" type="submit"><i className="far fa-plus-square"></i> Dodaj proizvod</button>
                            </Form>
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withRouter(AddProduct);
