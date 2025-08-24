import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button, Select, Upload, message, Divider, Typography , Row , Col} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ProductService from '../services/ProductService';
import { SUCCESS } from '../util/Constants';
// You need this for fetching categories

const NewProduct = () => {
    const [form] = Form.useForm();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await ProductService.viewProductCategoryList(); // Correctly call the API
                console.log(response);

                if (response.responseCode === SUCCESS) {
                    setCategories(response.responseObject || []); // Use responseObject as in ProductCategory.jsx
                } else {
                    console.log(response);
                    console.log('Failed to fetch product categories response code:', response.responseCode);
                    message.error('Failed to fetch product categories.');
                }
            } catch (error) {
                console.error(error);
                message.error('Error while fetching product categories.');
            }
        };
        fetchCategories();
    }, []);

    const onFinish = async (values) => {
        const userName = sessionStorage.getItem('userName');

        // Create FormData for multipart request
        const formData = new FormData();
        formData.append('productDTO', new Blob([JSON.stringify({
            productName: values.productName,
            price: values.price,
            quantity: values.quantity,
            weight: values.weight,
            description: values.description,
            addedBy: userName,
            productCat: { id: values.categoryId }
        })], { type: 'application/json' }));

        console.log('FormData contents:', formData);

        if (values.imageFile && values.imageFile[0]?.originFileObj) {
            formData.append('imageFile', values.imageFile[0].originFileObj);
        } else {
            message.error('Main image is required1');
            return;
        }

        if (values.additionalImages) {
            values.additionalImages.forEach((file) => {
                formData.append('additionalImages', file.originFileObj);
            });
        }

        console.log(formData);




        try {
            setLoading(true);
            const productBlob = formData.get('productDTO');
            productBlob.text().then(text => console.log('Product DTO JSON:', text));

            const response = await ProductService.addNewProduct(formData); // API call
            if (response.responseCode === SUCCESS) {
                message.success('Product added successfully!');
                form.resetFields();
            } else {
                message.error('Failed to add product, response code: ' + response.responseCode);
            }
        } catch (error) {
            console.error(error);
            message.error('Error while adding product: ' + error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Typography.Title level={4}>Add New Product</Typography.Title>
            <Divider />

            <Form form={form} layout="vertical" onFinish={onFinish}>
                {/* First Row: Product Name, Price, Quantity */}
                <Row gutter={24}>
                    <Col span={6}>
                        <Form.Item name="productName" label="Product Name" rules={[{ required: true }]}>
                            <Input placeholder="Enter product name" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                            <InputNumber style={{ width: '100%' }} placeholder="Enter price" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
                            <InputNumber style={{ width: '100%' }} placeholder="Enter quantity" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="categoryId" label="Product Category" rules={[{ required: true }]}>
                            <Select placeholder="Select category">
                                {categories.map((cat) => (
                                    <Select.Option key={cat.id} value={cat.id}>
                                        {cat.categoryName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                {/* Second Row: Weight, Description, Category */}
                <Row gutter={24}>
                    {/* <Col span={8}>
                        <Form.Item name="weight" label="Weight" rules={[{ required: true }]}>
                            <Input placeholder="Enter weight" />
                        </Form.Item>
                    </Col> */}
                    <Col span={24}>
                        <Form.Item name="description" label="Description">
                            <Input.TextArea rows={2} placeholder="Enter product description" />
                        </Form.Item>
                    </Col>
                    
                </Row>

                {/* Third Row: Image Uploads */}
                <Row gutter={12}>
                    <Col span={6}>
                        <Form.Item
                            name="imageFile"
                            label="Main Image"
                            valuePropName="fileList"
                            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                            rules={[{ required: true, message: 'Main image is required' }]}
                        >
                            <Upload beforeUpload={() => false} maxCount={1} listType="picture">
                                <Button icon={<UploadOutlined />}>Upload Main Image</Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="additionalImages"
                            label="Additional Images"
                            valuePropName="fileList"
                            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                        >
                            <Upload beforeUpload={() => false} multiple listType="picture">
                                <Button icon={<UploadOutlined />}>Upload Additional Images</Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        style={{ backgroundColor: '#722ed1', borderColor: '#722ed1' }}
                    >
                        Add Product
                    </Button>
                </Form.Item>
            </Form>

        </div>
    );
};

export default NewProduct;
