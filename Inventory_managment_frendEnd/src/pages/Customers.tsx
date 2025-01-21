import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { toast } from 'sonner';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import axiosInstance from '../service/axiosConfigue';
import { ADDcustomer, GETcustomer, updateCustomer, } from '../service/api';
import Customer from '../types/ICustomers';



const CustomerManagementPage = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingItem, setEditingItem] = useState<Customer | null>(null);
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState<boolean>()

    const handleAddCustomer = () => {
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleModalOk = () => {
        form.validateFields()
            .then(async (values) => {
                try {
                    if (editingItem) {
                        const updatedItem = { ...values, _id: editingItem._id };

                        const response = await axiosInstance.put(`${updateCustomer}/${editingItem._id}`, updatedItem);

                        if (response.status === 200 || response.status === 201) {
                            setCustomers((prevItems) =>
                                prevItems.map((item) => (item._id === editingItem._id ? response.data.result : item))
                            );
                            toast.success('Product updated successfully!');
                        }
                    } else {

                        const response = await axiosInstance.post(ADDcustomer, values);
                        if (response.status === 200 || response.status === 201) {
                            setCustomers([...customers, response.data.result]);
                            setIsModalVisible(false);
                            toast.success('Customer added successfully!');

                        }
                    }
                } catch (error: any) {
                    if (error.response) {
                        toast.error(error.response.data.message || 'Failed to fetch products.');
                    } else if (error.request) {
                        toast.error('Network error. Please check your connection.');
                    } else {
                        toast.error('An unexpected error occurred.');
                    }
                }
                setIsModalVisible(false);
            })
            .catch(() => {
                toast.error('Please fill all fields correctly.');
            });
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    const getCustomers = async () => {
        try {
            setLoading(true)
            const response = await axiosInstance.get(GETcustomer);
            if (response.status === 200 || response.status === 201) {
                setCustomers(response.data.result);
            }
        } catch (error: any) {
            if (error.response) {
                toast.error(error.response.data.message || 'Failed to fetch products.');
            } else if (error.request) {
                toast.error('Network error. Please check your connection.');
            } else {
                toast.error('An unexpected error occurred.');
            }
        } finally {
            setLoading(false)
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Mobile',
            dataIndex: 'mobile',
            key: 'mobile',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Customer) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
                        Edit
                    </Button>

                </Space>
            ),
        },
    ];

    const handleEdit = (item: Customer) => {
        setEditingItem(item);
        form.setFieldsValue(item);
        setIsModalVisible(true);
    };


    useEffect(() => {
        getCustomers();
    }, []);


    return (
        <div>
            <NavBar />
            <div className="min-h-screen p-6">
                <h1 className="text-center text-xl font-bold">Customer Management</h1>
                <div className="flex items-center justify-between m-5">
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAddCustomer}
                    >
                        Add New Customer
                    </Button>
                </div>
                <Table columns={columns} dataSource={customers} rowKey="id" loading={loading} />

                {/* Modal for Adding Customers */}
                <Modal
                    title="Add New Customer"
                    visible={isModalVisible}
                    onOk={handleModalOk}
                    onCancel={handleModalCancel}
                >
                    <Form form={form} layout="vertical">
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please enter the customer name' }]}
                        >
                            <Input placeholder="Enter customer name" />
                        </Form.Item>
                        <Form.Item
                            label="email"
                            name="email"
                            rules={[{ required: true, type: "email", message: 'Please enter the customer email' }]}
                        >
                            <Input placeholder="Enter customer email" />
                        </Form.Item>
                        <Form.Item
                            label="Address"
                            name="address"
                            rules={[{ required: true, message: 'Please enter the address' }]}
                        >
                            <Input placeholder="Enter address" />
                        </Form.Item>
                        <Form.Item
                            label="Gender"
                            name="gender"
                            rules={[{ required: true, message: "Please select a gender" }]}
                        >
                            <Select placeholder="Select gender" allowClear>
                                <Select.Option value="male">Male</Select.Option>
                                <Select.Option value="female">Female</Select.Option>
                                <Select.Option value="other">Other</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Mobile Number"
                            name="mobile"
                            rules={[
                                { required: true, message: 'Please enter the mobile number' },
                                { pattern: /^\d{10}$/, message: 'Enter a valid 10-digit mobile number' },
                            ]}
                        >
                            <Input placeholder="Enter mobile number" />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
            <Footer />
        </div>
    );
};

export default CustomerManagementPage;
