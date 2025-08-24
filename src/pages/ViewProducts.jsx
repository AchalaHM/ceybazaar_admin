import React, { useEffect, useState } from 'react';
import { Table, Image, Typography, message, Spin } from 'antd';
import ProductService from '../services/ProductService';
import { SUCCESS } from '../util/Constants';

const { Title } = Typography;

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await ProductService.viewProductList(); // API to get all products
        if (response.responseCode === SUCCESS) {
          setProducts(response.responseObject || []);
        } else {
          message.error('Failed to load products.');
        }
      } catch (error) {
        console.error(error);
        message.error('Error fetching products.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const columns = [
    {
        title: 'Image',
        dataIndex: 'imagePath',
        key: 'imagePath',
        render: (text) => (
          text ? (
            <Image
              src={`http://localhost:8080/CeyBazaar${text.replace(/\\/g, "/")}`}
              alt="Product"
              width={80}
              height={80}
              style={{ objectFit: 'cover' }}
            />
          ) : (
            'No Image'
          )
        ),
      },
      
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `Rs. ${price}`,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Category',
      dataIndex: 'productCatName', // Nested field
      key: 'productCatName',
    },
    
  ];

  if (loading) {
    return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />;
  }

  return (
    <div>
      <Title level={4}>All Products</Title>
      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        bordered
      />
    </div>
  );
};

export default ViewProducts;
