/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { Form, Input, Button } from 'antd';
import { toast } from 'sonner';
import signUpImage from "../assets/images/login.png"
import axiosInstance from '../service/axiosConfigue';
import { USERLOGIN } from '../service/api';

const LoginForm: React.FC = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: any) => {
        try {
            setLoading(true);
            const loginData = {
                email: values.email,
                password: values.password,
            };

            const response = await axiosInstance.post(USERLOGIN, loginData)

            if (response.status === 201 || response.status === 200) {
                console.log(response)
                localStorage.setItem('user', JSON.stringify(response.data.result.tokenJwt))
                toast.success(response.data.message);
                navigate('/');
            }

        } catch (error: any) {
            if (error.response) {
                toast.error(error.response.data.message || 'Sign-up failed. Please try again.');
            } else if (error.request) {
                toast.error('Network error. Please check your connection.');
            } else {
                toast.error('An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen container bg-bgColor flex justify-center items-center mx-auto">

            <div className="flex flex-col md:flex-row max-w-3xl bg-white shadow-md rounded-lg overflow-hidden">
                <div className="w-full md:w-2/3 p-8">
                    <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
                    <Form
                        name="login"
                        layout="vertical"
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, type: 'email', message: 'Please enter a valid email!' }]}
                        >
                            <Input size="large" placeholder="Enter your email" />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Please enter your password!' }]}
                        >
                            <Input.Password
                                size="large"
                                placeholder="Enter your password"
                                iconRender={visible => visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block size="large" loading={loading} >
                                Sign In
                            </Button>
                        </Form.Item>
                    </Form>
                    <p className="mt-4 text-center text-sm text-gray-600">
                        Do not have an account? <Link to="/signup" className="text-blue-900">Sign Up</Link>
                    </p>
                </div>

                <div className="hidden md:block w-1/3">
                    <img
                        src={signUpImage}
                        alt="Sign in illustration"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
