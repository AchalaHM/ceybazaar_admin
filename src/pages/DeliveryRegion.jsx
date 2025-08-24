import React, { useState, useEffect } from 'react';
import { Divider, Typography, Form, Input, Button, Table, message, InputNumber } from 'antd';
import { SUCCESS } from '../util/Constants';
import DeliveryRegionService from '../services/DeliveryRegionService';

const DeliveryRegion = () => {
  const [form] = Form.useForm();
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch delivery regions
  const fetchRegions = async () => {
    try {
      const response = await DeliveryRegionService.viewDeliveryRegionList();
      if (response.responseCode === SUCCESS) {
        setRegions(response.responseObject || []);
      } else {
        message.error('Failed to fetch delivery regions.');
      }
    } catch (error) {
      console.error(error);
      message.error('Error fetching delivery regions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  // Handle form submit
  const onFinish = async (values) => {
    const payload = {
      regionCode: values.regionCode,
      regionName: values.regionName,
      shippingCost: values.shippingCost,
    };

    try {
      const response = await DeliveryRegionService.newDeliveryRegion(payload);
      if (response.responseCode === SUCCESS) {
        message.success('Delivery region added successfully!');
        form.resetFields();
        fetchRegions(); // Refresh table 
      } else {
        message.error('Failed to add delivery region.');
      }
    } catch (error) {
      console.error(error);
      message.error('Error adding delivery region.');
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Region Code',
      dataIndex: 'regionCode',
      key: 'regionCode',
    },
    {
      title: 'Region Name',
      dataIndex: 'regionName',
      key: 'regionName',
    },
    {
      title: 'Shipping Cost',
      dataIndex: 'shippingCost',
      key: 'shippingCost',
      render: (cost) => `Rs. ${cost}`,
    },
  ];

  return (
    <div>
      <Typography.Title level={4} style={{ margin: 0 }}>
        Delivery Regions
      </Typography.Title>

      <Divider />

      <Divider orientation="left" orientationMargin="0">
        Add New Delivery Region
      </Divider>

      <Form form={form} layout="inline" onFinish={onFinish}>
        <Form.Item
          label="Region Code"
          name="regionCode"
          rules={[{ required: true, message: 'Please enter region code' }]}
        >
          <Input placeholder="Enter region code" />
        </Form.Item>

        <Form.Item
          label="Region Name"
          name="regionName"
          rules={[{ required: true, message: 'Please enter region name' }]}
        >
          <Input placeholder="Enter region name" />
        </Form.Item>

        <Form.Item
          label="Shipping Cost"
          name="shippingCost"
          rules={[{ required: true, message: 'Please enter shipping cost' }]}
        >
          <InputNumber placeholder="Enter cost" style={{ width: '120px' }} />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ backgroundColor: '#722ed1', borderColor: '#722ed1' }}
          >
            Add
          </Button>
        </Form.Item>
      </Form>

      <Divider orientation="left" orientationMargin="0">
        Delivery Region List
      </Divider>

      <Table
        loading={loading}
        dataSource={regions}
        columns={columns}
        rowKey="id" // Assuming backend sends an ID
        bordered
      />
    </div>
  );
};

export default DeliveryRegion;
