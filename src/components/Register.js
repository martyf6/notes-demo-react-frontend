import React from "react";
import { useNavigate } from 'react-router-dom';
import { Formik } from "formik";
import * as Yup from "yup";

import AuthService from "../services/AuthService";

const Register = () => {

    let navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .required("Username is required.")
            .min(5, "Username must be at least 5 characters."),
        email: Yup.string()
            .email("Please enter a valid email address.")
            .required("Email address is required."),
        password: Yup.string()
            .required("Password is required.")
            .min(6, "Password must be at least 6 characters."),
        confirmPassword: Yup.string()
            .required("Please re-type your password.")
            .oneOf([Yup.ref("password")], "Passwords do not match."),
    });

    const handleSubmit = ( 
        {username, email, password, confirmPassword}, {setFieldError}
    ) => {
        AuthService.register(username, email, password).then(
            () => {
              navigate("/login");
              //window.location.reload();
            },
            error => {
                console.log(error);
                // if(error.search(/username/i)) //username already taken.
                // if(error.search(/email/i)) // email already in use.
                setTimeout(() => {
                    setFieldError("email", "Email address already registered.");
                }, 1000);
            }
        );
    };

    return (
        <div className="col-md-4 mx-auto my-4">
            <div className="card text-bg-light py-5 px-5">
                <h3 className="card-title text-center">Sign Up</h3>
                <Formik
                    initialValues={{
                        username: "",
                        email: "",
                        password: "",
                        confirmPassword: ""
                    }}
                    onSubmit={(values, errors) => {
                        handleSubmit(values, errors);
                    }}
                    validationSchema={validationSchema}
                >
                    {({
                        values, errors, handleSubmit, handleChange, handleBlur, 
                    }) => {
                        return (
                            <form onSubmit={handleSubmit} autoComplete="off">
                                <div className="form-group my-3">
                                    <label htmlFor="username" className="form-label">Username:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="username"
                                        aria-describedby="usernameFeedback"
                                        value={values.username}
                                        onChange={handleChange("username")}
                                        onBlur={handleBlur("username")}
                                    />
                                    <div id="usernameFeedback" className="form-text text-danger">{errors.username}</div>
                                </div>
                                <div className="form-group my-3">
                                    <label htmlFor="email" className="form-label">Email:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="email"
                                        aria-describedby="emailFeedback"
                                        value={values.email}
                                        onChange={handleChange("email")}
                                        onBlur={handleBlur("email")}
                                    />
                                    <div id="emailFeedback" className="form-text text-danger">{errors.email}</div>
                                </div>
                                <div className="form-group my-3">
                                    <label htmlFor="password" className="form-label">Password:</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        aria-describedby="passwordFeedback"
                                        value={values.password}
                                        onChange={handleChange("password")}
                                        onBlur={handleBlur("password")}
                                    />
                                    <div id="passwordFeedback" className="form-text text-danger">{errors.password}</div>
                                </div>
                                <div className="form-group my-3">
                                    <label htmlFor="confirmPassword" className="form-label">Confirm Password:</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="confirmPassword"
                                        aria-describedby="confirmPasswordFeedback"
                                        value={values.confirmPassword}
                                        onChange={handleChange("confirmPassword")}
                                        onBlur={handleBlur("confirmPassword")}
                                    />
                                    <div id="confirmPasswordFeedback" className="form-text text-danger">{errors.confirmPassword}</div>
                                </div>
                                <button className="btn btn-primary w-100 py-2" type="submit">Sign up</button>
                            </form>
                        );
                    }}
                </Formik>
            </div>
        </div>
    );
};

export default Register;