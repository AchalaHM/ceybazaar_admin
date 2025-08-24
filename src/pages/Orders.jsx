import React, { useEffect, useState } from 'react';
import { Table, Typography, message, Spin, Button, Select, Tag, Modal } from 'antd';
import AdminService from '../services/AdminService';
import { SUCCESS } from '../util/Constants';

const { Title } = Typography;
const { Option } = Select;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = filter === 'paid' 
        ? await AdminService.getPaidOrders()
        : await AdminService.getAllOrders();
      
      if (response.responseCode === SUCCESS) {
        setOrders(response.responseObject || []);
      } else {
        message.error('Failed to load orders.');
      }
    } catch (error) {
      console.error(error);
      message.error('Error fetching orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteOrder = async (orderId) => {
    Modal.confirm({
      title: 'Complete Order',
      content: 'Are you sure you want to complete this order?',
      onOk: async () => {
        try {
          const response = await AdminService.completeOrder(orderId);
          if (response.responseCode === SUCCESS) {
            message.success('Order completed successfully');
            fetchOrders();
          } else {
            message.error('Failed to complete order');
          }
        } catch (error) {
          message.error('Error completing order');
        }
      }
    });
  };

  const handleDeliveryStatusChange = async (orderId, deliveryStatus) => {
    try {
      const response = await AdminService.updateDeliveryStatus(orderId, deliveryStatus);
      if (response.responseCode === SUCCESS) {
        message.success('Delivery status updated successfully');
        fetchOrders();
      } else {
        message.error('Failed to update delivery status');
      }
    } catch (error) {
      message.error('Error updating delivery status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PAID': return 'green';
      case 'COMPLETED': return 'blue';
      case 'UNPAID': return 'red';
      default: return 'default';
    }
  };

  const getDeliveryStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'orange';
      case 'PROGRESSING': return 'blue';
      case 'DELIVERED': return 'green';
      default: return 'default';
    }
  };

  const columns = [
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
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>
    },
    {
      title: 'Delivery Status',
      dataIndex: 'deliveryStatus',
      key: 'deliveryStatus',
      render: (deliveryStatus, record) => (
        record.status === 'PAID' ? (
          <Select
            value={deliveryStatus}
            style={{ width: 120 }}
            onChange={(value) => handleDeliveryStatusChange(record.orderId, value)}
          >
            <Option value="PROGRESSING">PROGRESSING</Option>
            <Option value="DELIVERED">DELIVERED</Option>
          </Select>
        ) : (
          <Tag color={getDeliveryStatusColor(deliveryStatus)}>{deliveryStatus}</Tag>
        )
      )
    },
    {
      title: 'Total Cost',
      dataIndex: 'totalCost',
      key: 'totalCost',
      render: (cost) => `Rs. ${cost.toFixed(2)}`
    },
    {
      title: 'Date',
      dataIndex: 'addedOn',
      key: 'addedOn',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        record.status === 'PAID' && (
          <Button 
            type="primary" 
            style={{ backgroundColor: '#581381' }}
            onClick={() => handleCompleteOrder(record.orderId)}
          >
            Complete Order
          </Button>
        )
      )
    }
  ];

  if (loading) {
    return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4}>Order Management</Title>
        <Select
          value={filter}
          style={{ width: 150 }}
          onChange={setFilter}
        >
          <Option value="all">All Orders</Option>
          <Option value="paid">Paid Orders</Option>
        </Select>
      </div>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        bordered
        expandable={{
          expandedRowRender: (record) => (
            <div>
              <p><strong>Email:</strong> {record.customerEmail}</p>
              <p><strong>Address:</strong> {record.address}</p>
              <p><strong>Region:</strong> {record.region}</p>
              <p><strong>Shipping Cost:</strong> Rs. {record.shippingCost.toFixed(2)}</p>
              <div>
                <strong>Items:</strong>
                <ul>
                  {record.orderItems?.map((item, index) => (
                    <li key={index}>
                      {item.productName} - Qty: {item.quantity} - Rs. {item.unitPrice?.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ),
        }}
      />
    </div>
  );
};

export default Orders;