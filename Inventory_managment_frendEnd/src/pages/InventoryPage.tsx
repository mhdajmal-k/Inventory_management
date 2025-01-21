import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import axiosInstance from '../service/axiosConfigue';
import { ADDPRODUCTS, deleteProduct, GETPRODUCTS, updateProduct } from '../service/api';
import { toast } from 'sonner';
import InventoryItem from '../types/IInvetory';


const InventoryPage = () => {
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState<boolean>()
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
    const [form] = Form.useForm();
    const [searchQuery, setSearchQuery] = useState('');
    const handleAdd = () => {
        setEditingItem(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handelSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase()
        setSearchQuery(query)
        const filtered = inventoryItems.filter((item) => item.name.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query))
        setFilteredItems(filtered)
    }
    const handleEdit = (item: InventoryItem) => {
        setEditingItem(item);
        form.setFieldsValue(item);
        setIsModalVisible(true);
    };

    const handleDelete = async (id: string) => {
        try {

            const response = await axiosInstance.patch(`${deleteProduct}/${id}`);

            if (response.status === 200 || response.status === 201) {
                toast.success(response.data.message || 'Product deleted successfully!');
                getProducts();
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            if (error.response) {
                toast.error(error.response.data.message || 'Failed to delete the product.');
            } else if (error.request) {
                toast.error('Network error. Please check your connection.');
            } else {
                toast.error('An unexpected error occurred.');
            }
        }
    };


    const getProducts = async () => {
        try {
            setLoading(true)
            const response = await axiosInstance.get(GETPRODUCTS);
            if (response.status === 200 || response.status === 201) {
                setInventoryItems(response.data.result);
                setFilteredItems(response.data.result);
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
    const addProducts = async (data: InventoryItem) => {
        try {
            console.log(data, "in the data")
            const response = await axiosInstance.post(ADDPRODUCTS, data);
            if (response.status === 200 || response.status === 201) {
                setInventoryItems([...inventoryItems, response.data.result]);
                setFilteredItems([...inventoryItems, response.data.result]);

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
    };
    const editProducts = async (data: InventoryItem, id: string) => {
        try {

            const response = await axiosInstance.put(`${updateProduct}/${id}`, data);

            if (response.status === 200 || response.status === 201) {
                setInventoryItems((prevItems) =>
                    prevItems.map((item) => (item._id === id ? response.data.result : item))
                );
                toast.success('Product updated successfully!');
            }
        } catch (error: any) {
            if (error.response) {
                toast.error(error.response.data.message || 'Failed to update the product.');
            } else if (error.request) {
                toast.error('Network error. Please check your connection.');
            } else {
                toast.error('An unexpected error occurred.');
            }
        }
    };



    useEffect(() => {
        getProducts();
    }, []);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Price(RS)',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => `${price}`,
        },
        {
            title: 'Total Stock Value(RS)',
            dataIndex: 'totalStockValue',
            key: 'totalStockValue',
            render: (value: number) => `${value}`,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: InventoryItem) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure you want to delete this item?"
                        onConfirm={() => handleDelete(record._id)}
                    >
                        <Button icon={<DeleteOutlined />} danger>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <NavBar />
            <div className="min-h-screen p-6 mx-5">
                <h1 className="text-center text-xl font-bold">Inventory Management</h1>
                <div className="flex items-center m-5 justify-between">
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                    >
                        Add New Item
                    </Button>
                    <div className='items-center flex justify-center'>
                        <Input
                            placeholder="Search by name or description"
                            prefix={<SearchOutlined />}
                            value={searchQuery}
                            onChange={handelSearch}
                            className='w-[300px] rounded-lg'
                        />
                    </div>

                </div>
                <Table columns={columns} dataSource={filteredItems} rowKey="_id" className='text-4xl font-medium' loading={loading} />
                <Modal
                    title={editingItem ? 'Edit Item' : 'Add New Item'}
                    open={isModalVisible}
                    onOk={() => {
                        form.validateFields().then(values => {
                            if (editingItem) {

                                const updatedItem = { ...values, _id: editingItem._id };
                                editProducts(updatedItem, editingItem._id);

                            } else {
                                const newItem: InventoryItem = {
                                    ...values,
                                    totalStockValue: values.quantity * values.price,
                                };
                                addProducts(newItem)
                            }
                            setIsModalVisible(false);
                        });
                    }}
                    onCancel={() => setIsModalVisible(false)}
                >
                    <Form form={form} layout="vertical">
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[{ required: true, message: 'Please input the name!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Description"
                            rules={[{ required: true, message: 'Please input the description!' }]}
                        >
                            <Input.TextArea />
                        </Form.Item>
                        <Form.Item
                            name="quantity"
                            label="Quantity"
                            rules={[{ required: true, message: 'Please input the quantity!' }]}
                        >
                            <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item
                            name="price"
                            label="Price"
                            rules={[{ required: true, message: 'Please input the price!' }]}
                        >
                            <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
            <Footer />
        </div>
    );
};

export default InventoryPage;
