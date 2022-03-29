import React, { useEffect, useState } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import axios from 'axios';
import AuthService from '../../services/AuthService';
import AuthHeader from '../../services/AuthHeader';

function ProductList() {

    let history = useHistory();

    var [products, setProducts] = useState([]);
    var [loading, setLoading] = useState(false);

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

        setLoading(true);
        axios.get("http://127.0.0.1:8080/api/products-all").then((response) => {
            setProducts(response.data);
            setLoading(false);
        });
    }, []);

    const deleteProduct = (id) => {
        axios.delete(`http://127.0.0.1:8080/api/products-remove/${id}`).then(() => {
            window.location.reload();
        });
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
                        <h2>Lista proizvoda</h2>
                    </div>
                    <table className="table text-center">
                        <thead>
                            <tr>
                                <th scope="col">Naziv</th>
                                <th scope="col">Opis</th>
                                <th scope="col">Cena</th>
                                <th scope="col"></th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((value, key) => {
                                return (
                                    <tr key={value._id}>
                                        <th scope="row">{value.title}</th>
                                        <td>{value.description.slice(0, 10)}...</td>
                                        <td>{value.price}.oo RSD </td>
                                        <td><button className="btn btn-warning rounded-0" onClick={() => { history.push(`/edit-product/${value._id}`) }}><i className="far fa-edit"></i></button></td>
                                        <td><button className="btn btn-danger rounded-0" onClick={() => { deleteProduct(value._id) }}><i className="fas fa-trash"></i></button></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default withRouter(ProductList);