import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Typography, Spin, message, Progress } from 'antd';
import { 
  ShoppingOutlined, 
  DollarOutlined, 
  CheckCircleOutlined, 
  TruckOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import AdminService from '../services/AdminService';
import ProductService from '../services/ProductService';
import { SUCCESS } from '../util/Constants';
import dayjs from 'dayjs';

const { Title } = Typography;

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    todayReport: null,
    recentOrders: [],
    products: [],
    categories: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const today = dayjs().format('YYYY-MM-DD');
      
      const [todayReportRes, ordersRes, productsRes, categoriesRes] = await Promise.all([
        AdminService.getDailyReport(today),
        AdminService.getAllOrders(),
        ProductService.viewProductList(),
        ProductService.viewProductCategoryList()
      ]);

      setDashboardData({
        todayReport: todayReportRes.responseCode === SUCCESS ? todayReportRes.responseObject : null,
        recentOrders: ordersRes.responseCode === SUCCESS ? ordersRes.responseObject.slice(0, 5) : [],
        products: productsRes.responseCode === SUCCESS ? productsRes.responseObject : [],
        categories: categoriesRes.responseCode === SUCCESS ? categoriesRes.responseObject : []
      });
    } catch (error) {
      message.error('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const orderColumns = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span style={{ 
          color: status === 'PAID' ? '#52c41a' : status === 'COMPLETED' ? '#1890ff' : '#ff4d4f',
          fontWeight: 'bold'
        }}>
          {status}
        </span>
      )
    },
    {
      title: 'Total',
      dataIndex: 'totalCost',
      key: 'totalCost',
      render: (cost) => `Rs. ${cost?.toFixed(2)}`
    }
  ];

  const lowStockProducts = dashboardData.products.filter(p => p.quantity < 10);
  const completionRate = dashboardData.todayReport ? 
    (dashboardData.todayReport.completedOrders / Math.max(dashboardData.todayReport.paidOrders, 1) * 100) : 0;

  if (loading) {
    return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />;
  }

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24, color: '#581381' }}>Dashboard Overview</Title>
      
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Today's Orders"
              value={dashboardData.todayReport?.totalOrders || 0}
              prefix={<ShoppingOutlined style={{ color: '#581381' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Paid Orders"
              value={dashboardData.todayReport?.paidOrders || 0}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Completed Orders"
              value={dashboardData.todayReport?.completedOrders || 0}
              prefix={<TruckOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Today's Revenue"
              value={dashboardData.todayReport?.totalRevenue || 0}
              prefix={<DollarOutlined style={{ color: '#faad14' }} />}
              suffix="LKR"
              precision={2}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Products"
              value={dashboardData.products.length}
              prefix={<AppstoreOutlined style={{ color: '#722ed1' }} />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Product Categories"
              value={dashboardData.categories.length}
              prefix={<AppstoreOutlined style={{ color: '#eb2f96' }} />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <div>
              <div style={{ marginBottom: 8 }}>Order Completion Rate</div>
              <Progress 
                percent={completionRate} 
                strokeColor="#581381"
                format={percent => `${percent.toFixed(1)}%`}
              />
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={14}>
          <Card title="Recent Orders" style={{ height: 400 }}>
            <Table
              columns={orderColumns}
              dataSource={dashboardData.recentOrders}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        <Col span={10}>
          <Card title="Low Stock Alert" style={{ height: 400 }}>
            {lowStockProducts.length > 0 ? (
              <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                {lowStockProducts.map((product, index) => (
                  <div key={index} style={{ 
                    padding: '8px 0', 
                    borderBottom: '1px solid #f0f0f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{product.productName}</div>
                      <div style={{ color: '#666', fontSize: '12px' }}>Rs. {product.price}</div>
                    </div>
                    <div style={{ 
                      color: product.quantity < 5 ? '#ff4d4f' : '#faad14',
                      fontWeight: 'bold'
                    }}>
                      {product.quantity} left
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#666', padding: '40px 0' }}>
                All products are well stocked!
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;