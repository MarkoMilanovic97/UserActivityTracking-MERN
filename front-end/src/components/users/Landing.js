import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import landing_image from '../../resources/images/landing-shop.jpg';

function Landing() {

    return (
        <div>
            <div className="container-fluid">
                <div className="container my-5">
                    <div className="row p-4 pb-0 pe-lg-0 pt-lg-5 align-items-center rounded-3 border shadow-lg">
                        <div className="col-lg-7 p-3 p-lg-5 pt-lg-3">
                            <h2 className="display-4 fw-bold lh-1">Dobrodosli u Online Shop!</h2>
                            <p className="lead">Brzo, lako i sigurno pretrazite i kupite proizvode koji te interesuju!<br /></p>
                            <p className="lead">Prijavi se i pocni da kupujes po najjeftinijim cenama na trzistu!</p>
                            <div className="d-grid gap-2 d-md-flex justify-content-md-start mb-4 mb-lg-3">
                                <Link to="/products" className="btn btn-primary rounded-0 btn-lg px-4 me-md-2 fw-bold">Katalog</Link>
                                <Link to="/login" className="btn btn-outline-warning rounded-0 btn-lg px-4">Prijava</Link>
                            </div>
                        </div>
                        <div className="col-lg-4 p-0 mb-5 overflow-hidden shadow-lg">
                            <img src={landing_image} height="400" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withRouter(Landing);
