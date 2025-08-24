import React from 'react';
import { useState, useEffect } from 'react';
import { Divider, Typography, Form, Input, Button, Table, message } from 'antd';
import { SUCCESS } from '../util/Constants';
import ProductService from '../services/ProductService';

const ProductCategory = () => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const response = await ProductService.viewProductCategoryList();
      if (response.responseCode === SUCCESS) {
        setCategories(response.responseObject);
      } else {
        message.error('Failed to fetch product categories.');
      }
    } catch (error) {
      message.error('Failed to fetch product categories.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onFinish = async (values) => {
    const userName = sessionStorage.getItem("userName");
    const payload = {
      categoryName: values.categoryName,
      addedBy: userName,
    };

    try {
      const response = await ProductService.newProductCategory(payload);
      if (response.responseCode === SUCCESS) {
        message.success('Product category added successfully!');
        form.resetFields();
        fetchCategories(); // Refresh the table after adding a new category
      } else {
        message.error('Failed to add product category.');
      }
    } catch (error) {
      message.error('Failed to add product category.');
      console.error(error);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Category Name',
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
  ];

  return (
    <div>
      <Typography.Title level={4} style={{ margin: 0 }}>
        Product Category
      </Typography.Title>

      <Divider />

      <Divider orientation="left" orientationMargin="0">
        Add New Product Category
      </Divider>

      <Form form={form} layout="inline" onFinish={onFinish}>
        <Form.Item
          label="Category Name"
          name="categoryName"
          rules={[{ required: true, message: 'Please enter category name' }]}
        >
          <Input placeholder="Enter category name" />
        </Form.Item>

        <Form.Item>
          <Button
            style={{ backgroundColor: '#722ed1', borderColor: '#722ed1' }}
            type="primary"
            htmlType="submit"
          >
            Add
          </Button>
        </Form.Item>
      </Form>

      <Divider orientation="left" orientationMargin="0">
        Product Categories
      </Divider>

      <Table
        loading={loading}
        dataSource={categories}
        columns={columns}
        rowKey="id"
        bordered
      />
    </div>
  );
};

export default ProductCategory;