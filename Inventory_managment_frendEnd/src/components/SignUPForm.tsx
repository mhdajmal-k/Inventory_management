import { useFormik } from 'formik';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUpValidationSchema } from '../validator/SignUpValidator';
import { Button, Input, Form, message } from 'antd';
import loginImage from "../assets/images/login.png";
import axiosInstance from '../service/axiosConfigue';
import { USERSIGNUP } from '../service/api';

const SignUpForm: React.FC = () => {
    const [showConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const formik = useFormik({
        initialValues: {
            companyName: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: signUpValidationSchema,
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: async (values) => {
            try {
                const signUpData = {
                    companyName: values.companyName,
                    email: values.email,
                    password: values.password,
                };
                const response = await axiosInstance.post(USERSIGNUP, signUpData)

                if (response.status === 201 || response.status === 200) {
                    messageApi.success('Sign-up successful!');
                    console.log(response, "is the sing up")
                    localStorage.setItem('user', JSON.stringify(response.data.result.tokenJwt))
                    navigate('/');
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                if (error.response) {
                    messageApi.error(error.response.data.message || 'Sign-up failed. Please try again.');
                } else if (error.request) {
                    messageApi.error('Network error. Please check your connection.');
                } else {
                    messageApi.error('An unexpected error occurred. Please try again.');
                }
            }
        },
    });

    return (
        <div className="min-h-screen container bg-bgColor flex justify-center items-center mx-auto">
            {contextHolder}
            <div className="flex flex-col md:flex-row max-w-4xl bg-white shadow-md rounded-lg overflow-hidden">
                <div>
                    <img src={loginImage} alt="Sign-up illustration" className="h-full object-cover" />
                </div>
                <div className="w-full md:w-full p-8">
                    <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
                    <Form onFinish={formik.handleSubmit} layout="vertical">
                        <Form.Item
                            label="Company Name"
                            name="companyName"
                            validateStatus={formik.errors.companyName && formik.touched.companyName ? 'error' : ''}
                            help={formik.errors.companyName && formik.touched.companyName ? formik.errors.companyName : ''}
                        >
                            <Input
                                type="text"
                                name="companyName"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.companyName}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            validateStatus={formik.errors.email && formik.touched.email ? 'error' : ''}
                            help={formik.errors.email && formik.touched.email ? formik.errors.email : ''}
                        >
                            <Input
                                type="email"
                                name="email"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            validateStatus={formik.errors.password && formik.touched.password ? 'error' : ''}
                            help={formik.errors.password && formik.touched.password ? formik.errors.password : ''}
                        >
                            <Input.Password
                                name="password"
                                type='password'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Confirm Password"
                            name="confirmPassword"
                            validateStatus={formik.errors.confirmPassword && formik.touched.confirmPassword ? 'error' : ''}
                            help={formik.errors.confirmPassword && formik.touched.confirmPassword ? formik.errors.confirmPassword : ''}
                        >
                            <Input.Password
                                name="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.confirmPassword}
                            // iconRender={() =>
                            //     showConfirmPassword ? (
                            //         <EyeOutlined onClick={() => setShowConfirmPassword(false)} />
                            //     ) : (
                            //         <EyeInvisibleOutlined onClick={() => setShowConfirmPassword(true)} />
                            //     )
                            // }
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="w-full"
                                loading={formik.isSubmitting}
                            >
                                Sign Up
                            </Button>
                        </Form.Item>
                    </Form>

                    <p className="mt-4 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-900">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUpForm;
