import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import "../styles/LoginPage.css"
import logo from '../assets/logo.png'; // adjust path based on your structure
import AuthService from '../services/AuthService';
import { SUCCESS } from '../util/Constants';

const { Title } = Typography;

const LoginPage = () => {

    const navigate = useNavigate();
    const onFinish = async (values) => {
        try {
            const result = await AuthService.loginUser(values)
            console.log(result);

            if (result.responseCode === SUCCESS && result.responseObject.userType === "ADMIN") {
                message.success("Login successful!");
                sessionStorage.setItem("token", result.responseObject.token);
                sessionStorage.setItem("userName", result.responseObject.userName);
                const loginTime = new Date().getTime();
                const sessionTime = 60 * 60 * 1000;
                const expirationTime = loginTime + sessionTime;
                sessionStorage.setItem("loginTime", loginTime);
                sessionStorage.setItem("expirationTime", expirationTime);
                navigate("/Home");
            } else {
                message.error("Login Failed : " + result.responseDesc);
            }
        } catch (error) {
            message.error("Login Failed : " + error);
        }
    };

    return (
        <div className="login-container">
            <Card className="login-card">
                <div className="logo-wrapper">
                    <img src={logo} alt="Logo" className="login-logo" />
                </div>
                <Title level={3} style={{ textAlign: 'center' }}>Login as Admin</Title>
                <Form
                    name="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="userEmail"
                        label="Username"
                        rules={[{ required: true, message: 'Please enter your username!' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Enter username" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true, message: 'Please enter your password!' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Enter password" />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            style={{ backgroundColor: '#b10dc9', borderColor: '#b10dc9' }}
                        >
                            Login
                        </Button>

                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default LoginPage;
