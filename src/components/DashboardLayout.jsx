import React, { useState , useEffect } from 'react';
import { Layout, Menu, Avatar, Typography, message, Button } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  DashboardOutlined,
  AppstoreAddOutlined,
  ShoppingOutlined,
  BarChartOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import "../styles/DashboardLayout.css";
import logo from '../assets/logo.png'; 
import CheckSession from '../util/CheckSession'; // Ensure this path is correct

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const DashboardLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    const expirationTime = sessionStorage.getItem("expirationTime");
    const currentTime = new Date().getTime();
  
    if (expirationTime && currentTime > expirationTime) {
      sessionStorage.clear();
      navigate("/");
      message.warning("Your session has expired. Please login again.");
    }
  }, [navigate]);

  const userName = sessionStorage.getItem("userName");

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
    message.success("Logged out successfully");
  };

  // Map route paths to menu item keys
  const pathToKeyMap = {
    "/Home": "1",
    "/Product-Category": "2",
    "/New-Product": "3" ,
    "/View-Products": "4",
    "/Delivery-Region": "5",
    "/Orders": "6",
    "/Reports": "7"
  };

  const selectedKey = pathToKeyMap[location.pathname] || "1"; // default to Dashboard

  return (
    <Layout className="dashboard-layout">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="dashboard-sider"
      >
        <div className="logo-area">
          <img src={logo} alt="Logo" className="login-logo" />
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[selectedKey]} // ✅ dynamically selected key
        >
          <Menu.Item key="1" icon={<DashboardOutlined />} onClick={() => navigate("/Home")}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="2" icon={<AppstoreAddOutlined />} onClick={() => navigate("/Product-Category")}>
            Product Category
          </Menu.Item>
          <Menu.Item key="3" icon={<UserOutlined />} onClick={() => navigate("/New-Product")}>
            New Product
          </Menu.Item>
          <Menu.Item key="4" icon={<UserOutlined />} onClick={() => navigate("/View-Products")}>
            View Products
          </Menu.Item>
          <Menu.Item key="5" icon={<UserOutlined />} onClick={() => navigate("/Delivery-Region")}>
            Delivery Region
          </Menu.Item>
          <Menu.Item key="6" icon={<ShoppingOutlined />} onClick={() => navigate("/Orders")}>
            Orders
          </Menu.Item>
          <Menu.Item key="7" icon={<BarChartOutlined />} onClick={() => navigate("/Reports")}>
            Reports
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Header className="dashboard-header">
          {collapsed ? (
            <MenuUnfoldOutlined className="trigger-icon" onClick={toggleCollapsed} />
          ) : (
            <MenuFoldOutlined className="trigger-icon" onClick={toggleCollapsed} />
          )}

          <div className="user-info">
            <Avatar icon={<UserOutlined />} />
            <Text className="username">{userName}</Text>
            <Button 
              type="text" 
              icon={<LogoutOutlined />} 
              onClick={handleLogout}
              style={{ color: '#581381', marginLeft: 8 }}
            >
              Logout
            </Button>
          </div>
        </Header>

        <Content className="dashboard-content">
          {children || <div className="empty-placeholder"></div>}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
