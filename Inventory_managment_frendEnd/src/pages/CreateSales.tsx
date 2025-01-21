import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import { Button, Form, Input, Select } from 'antd'
import { ADDPRODUCTS, createSale, GETcustomer, GETPRODUCTS } from '../service/api'
import Customer from '../types/ICustomers'
import { toast } from 'sonner'
import axiosInstance from '../service/axiosConfigue'
import InventoryItem from '../types/IInvetory'
import { useNavigate } from 'react-router-dom'

const CreateSales = () => {
    const [form] = Form.useForm();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer>();
    const [selectedItem, setSelectedItem] = useState<InventoryItem>();
    const [quantity, setQuantity] = useState(1); // Add state for quantity
    const [totalPrice, setTotalPrice] = useState(0)
    const navigate = useNavigate()
    const getCustomers = async () => {
        try {
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
        }
    };
    const getProducts = async () => {
        try {
            const response = await axiosInstance.get(GETPRODUCTS);
            if (response.status === 200 || response.status === 201) {
                setInventoryItems(response.data.result);
                // (response.data.result);
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
    const handleItemChange = (value: string) => {
        const item = inventoryItems.find((inv) => inv.name === value);
        setSelectedItem(item);
        form.setFieldsValue({ price: item?.price, quantity: quantity });
        setQuantity(1);
    };

    const handleCustomerChange = (value: string) => {
        const customer = customers.find((cust) => cust.name === value);
        setSelectedCustomer(customer);
        form.setFieldsValue({
            email: customer?.email,
            phone: customer?.mobile,
            address: customer?.address,
        });
    };

    useEffect(() => {
        getCustomers()
        getProducts()
    }, [])

    useEffect(() => {
        if (selectedItem) {
            setTotalPrice(selectedItem.price * quantity);
        }
    }, [selectedItem, quantity]);

    const handleSubmit = async (values: any) => {
        try {

            values.productId = selectedItem?._id
            values.customerId = selectedCustomer?._id
            values.total = totalPrice

            const response = await axiosInstance.post(createSale, values);
            if (response.status === 200 || response.status === 201) {
                navigate("/sales")

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
    }
    return (
        <div className="flex flex-col min-h-screen">
            <NavBar />
            <main className=" bg-white py-8 px-4 sm:px-6 lg:px-8 rounded-lg">
                <div className="max-w-4xl mx-auto">

                    <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Record Sale</h1>                    <div className='bg-slate-300 max-w-xl mx-auto'>
                        <div className="bg-[#ebecf0] shadow-md rounded-xl p-6">
                            <Form form={form}
                                onFinish={handleSubmit}
                                layout="vertical"
                                className="space-y-6">

                                <Form.Item
                                    label="Customer Name"
                                    name="customerName"
                                    rules={[{ required: true, message: "Please select a customer" }]}
                                >
                                    <Select showSearch onChange={handleCustomerChange}>
                                        {customers.map((customer) => (
                                            <Select.Option key={customer._id} value={customer.name} >
                                                {customer.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">


                                    <Form.Item label="Email" name="email">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item label="Phone" name="phone">
                                        <Input disabled />
                                    </Form.Item>
                                    <Form.Item label="Address" name="address">
                                        <Input disabled />
                                    </Form.Item>
                                </div>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">


                                    <Form.Item
                                        label="Item Name"
                                        name="itemName"
                                        rules={[{ required: true, message: "Please select an item" }]}
                                    >
                                        <Select onChange={handleItemChange} showSearch>
                                            {inventoryItems.map((item) => (
                                                <Select.Option key={item._id} value={item.name}>
                                                    {item.name}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item label="Price" name="price">
                                        <Input disabled />
                                    </Form.Item>

                                    <Form.Item
                                        label="Quantity"
                                        name="quantity"
                                    // rules={[{ required: true }]}
                                    >
                                        <Input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => {
                                                const inputQuantity = Number(e.target.value);
                                                if (inputQuantity <= (selectedItem?.quantity || 0)) {
                                                    form.setFieldsValue({
                                                        quantity: inputQuantity

                                                    });
                                                    setQuantity(inputQuantity);
                                                } else {
                                                    toast.error("Quantity exceeds available stock!");
                                                }
                                            }}
                                            min={1}
                                        />
                                        {selectedItem && (
                                            <h1>Remaining Quantity: {selectedItem.quantity - quantity}</h1>
                                        )}
                                    </Form.Item>

                                    <Form.Item
                                        label="Payment Method"
                                        name="paymentMethod"
                                        rules={[{ required: true, message: "Please select a payment method" }]}
                                    >
                                        <Select >
                                            <Select.Option value="Cash">Cash</Select.Option>
                                            <Select.Option value="Card">Card</Select.Option>
                                        </Select>
                                    </Form.Item>

                                    <h1 className='text-xl font-bold'>Total Amount:RS {totalPrice}</h1>

                                </div>
                                <div className="flex justify-end">
                                    <Button type="primary" htmlType="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
                                        Record Sale
                                    </Button>
                                </div>
                            </Form>

                        </div>
                    </div>

                </div>
            </main>


            <Footer />
        </div>
    )
}

export default CreateSales