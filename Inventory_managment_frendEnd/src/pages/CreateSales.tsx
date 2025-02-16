import { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import { Button, Form, Input, Select, Space } from 'antd'
import { createSale, GETcustomer, GETPRODUCTS } from '../service/api'
import Customer from '../types/ICustomers'
import { toast } from 'sonner'
import axiosInstance from '../service/axiosConfigue'
import InventoryItem from '../types/IInvetory'
import { useNavigate } from 'react-router-dom'
import { DeleteOutlined } from '@ant-design/icons'

interface SaleItem {
    productId: string;
    itemName: string;
    price: number;
    quantity: number;
}

const CreateSales = () => {
    const [form] = Form.useForm();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer>();
    const [selectedItems, setSelectedItems] = useState<SaleItem[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const navigate = useNavigate();

    const getCustomers = async () => {
        try {
            const response = await axiosInstance.get(GETcustomer);
            if (response.status === 200 || response.status === 201) {
                setCustomers(response.data.result);
            }
        } catch (error: any) {
            if (error.response) {
                toast.error(error.response.data.message || 'Failed to fetch customers.');
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

    const handleCustomerChange = (value: string) => {
        const customer = customers.find((cust) => cust.name === value);
        setSelectedCustomer(customer);
        form.setFieldsValue({
            email: customer?.email,
            phone: customer?.mobile,
            address: customer?.address,
        });
    };

    const handleAddItem = () => {
        form.validateFields(['itemName', 'quantity']).then((values) => {
            const item = inventoryItems.find((inv) => inv.name === values.itemName);
            if (item) {
                const quantity = values.quantity || 1;
                if (quantity > item.quantity) {
                    toast.error("Quantity exceeds available stock!");
                    return;
                }

                const newItem: SaleItem = {
                    productId: item._id,
                    itemName: item.name,
                    price: item.price,
                    quantity: quantity
                };

                setSelectedItems([...selectedItems, newItem]);
                updateTotalPrice([...selectedItems, newItem]);


                form.setFieldsValue({
                    itemName: undefined,
                    quantity: undefined,
                });
            }
        });
    };

    const handleRemoveItem = (index: number) => {
        const updatedItems = selectedItems.filter((_, i) => i !== index);
        setSelectedItems(updatedItems);
        updateTotalPrice(updatedItems);
    };

    const updateTotalPrice = (items: SaleItem[]) => {
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotalPrice(total);
    };

    const handleSubmit = async (values: any) => {
        try {
            if (selectedItems.length === 0) {
                toast.error('Please add at least one item to the sale');
                return;
            }

            const saleData = {
                customerId: selectedCustomer?._id,
                items: selectedItems,
                paymentMethod: values.paymentMethod,
                total: totalPrice
            };

            const response = await axiosInstance.post(createSale, saleData);
            if (response.status === 200 || response.status === 201) {
                navigate("/sales");
            }
        } catch (error: any) {
            if (error.response) {
                toast.error(error.response.data.message || 'Failed to create sale.');
            } else if (error.request) {
                toast.error('Network error. Please check your connection.');
            } else {
                toast.error('An unexpected error occurred.');
            }
        }
    };

    useEffect(() => {
        getCustomers();
        getProducts();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <NavBar />
            <main className="bg-white py-8 px-4 sm:px-6 lg:px-8 rounded-lg">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Record Sale</h1>
                    <div className='bg-slate-300 max-w-xl mx-auto'>
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
                                        {customers
                                            .filter((customer) => !customer.block)
                                            .map((customer) => (
                                                <Select.Option key={customer._id} value={customer.name}>
                                                    {customer.name}
                                                </Select.Option>
                                            ))}
                                    </Select>
                                </Form.Item>


                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <Form.Item label="Email" name="email">
                                        <Input disabled />
                                    </Form.Item>
                                    <Form.Item label="Phone" name="phone">
                                        <Input disabled />
                                    </Form.Item>
                                    <Form.Item label="Address" name="address">
                                        <Input disabled />
                                    </Form.Item>
                                </div>

                                {/* Items Section */}
                                <div className="border p-4 rounded-md mb-4">
                                    <h2 className="text-lg font-semibold mb-4">Add Items</h2>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <Form.Item
                                            label="Item Name"
                                            name="itemName"
                                        >
                                            <Select showSearch>
                                                {inventoryItems.map((item) => (
                                                    <Select.Option key={item._id} value={item.name}>
                                                        {item.name} (Stock: {item.quantity})
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            label="Quantity"
                                            name="quantity"
                                        >
                                            <Input type="number" min={1} />
                                        </Form.Item>
                                    </div>
                                    <Button type="dashed" onClick={handleAddItem} className="w-full mb-4">
                                        + Add Item
                                    </Button>


                                    {selectedItems.length > 0 && (
                                        <div className="border p-4 rounded-md mb-4">
                                            <h3 className="font-semibold mb-2">Selected Items:</h3>
                                            {selectedItems.map((item, index) => (
                                                <div key={index} className="flex justify-between items-center mb-2 p-2 bg-white rounded">
                                                    <span>{item.itemName}</span>
                                                    <Space>
                                                        <span>{item.quantity} × ₹{item.price} = ₹{item.quantity * item.price}</span>
                                                        <Button
                                                            type="text"
                                                            danger
                                                            icon={<DeleteOutlined />}
                                                            onClick={() => handleRemoveItem(index)}
                                                        />
                                                    </Space>
                                                </div>
                                            ))}
                                            <div className="text-right font-bold mt-2">
                                                Total: ₹{totalPrice}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Payment Section */}
                                <Form.Item
                                    label="Payment Method"
                                    name="paymentMethod"
                                    rules={[{ required: true, message: "Please select a payment method" }]}
                                >
                                    <Select>
                                        <Select.Option value="Cash">Cash</Select.Option>
                                        <Select.Option value="Card">Card</Select.Option>
                                    </Select>
                                </Form.Item>

                                <div className="flex justify-end">
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                                    >
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
    );
};

export default CreateSales;