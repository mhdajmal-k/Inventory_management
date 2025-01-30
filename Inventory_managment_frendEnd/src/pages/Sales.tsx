import { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { DollarOutlined, PlusOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Col, Statistic, Table, Badge, Space, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import axiosInstance from '../service/axiosConfigue';
import { getSale } from '../service/api';
import { toast } from 'sonner';

const { Text } = Typography;

interface ProductDetails {
    name: string;
    category: string;
}

interface SaleItem {
    productId: string;
    itemName: string;
    price: number;
    quantity: number;
    productDetails: ProductDetails;
}

interface CustomerDetails {
    name: string;
    email: string;
    mobile: string;
    address: string;
}

interface SalesData {
    _id: string;
    date: string;
    customerDetails: CustomerDetails;
    items: SaleItem[];
    total: number;
    paymentMethod: string;
}

const Sales = () => {
    const navigate = useNavigate();
    const [salesData, setSalesData] = useState<SalesData[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchSalesData = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(getSale);
            if (response.status === 200 || response.status === 201) {
                setSalesData(response.data.result);
                toast.success('Sales data loaded successfully');
            } else {
                toast.error('Failed to load sales data');
            }
        } catch (error: any) {
            if (error.response) {
                toast.error(error.response.data.message || 'Failed to fetch sales.');
            } else if (error.request) {
                toast.error('Network error. Please check your connection.');
            } else {
                toast.error('An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSalesData();
    }, []);

    const expandedRowRender = (record: SalesData) => {
        const itemColumns: ColumnsType<SaleItem> = [
            {
                title: 'Item Name',
                dataIndex: ['productDetails', 'name'],
                key: 'name',
            },
            {
                title: 'Category',
                dataIndex: ['productDetails', 'category'],
                key: 'category',
            },
            {
                title: 'Price',
                dataIndex: 'price',
                key: 'price',
                render: (price: number) => `₹${price.toFixed(2)}`,
            },
            {
                title: 'Quantity',
                dataIndex: 'quantity',
                key: 'quantity',
            },
            {
                title: 'Subtotal',
                key: 'subtotal',
                render: (_, record) => `₹${(record.price * record.quantity).toFixed(2)}`,
            },
        ];

        return (
            <div className="p-4">
                <div className="mb-4">
                    <Text strong>Customer Details:</Text>
                    <div className="ml-4">
                        <Text>Email: {record.customerDetails.email}</Text>
                        <br />
                        <Text>Phone: {record.customerDetails.mobile}</Text>
                        <br />
                        <Text>Address: {record.customerDetails.address}</Text>
                    </div>
                </div>
                <Table
                    columns={itemColumns}
                    dataSource={record.items}
                    pagination={false}
                    rowKey="productId"
                />
            </div>
        );
    };

    const columns: ColumnsType<SalesData> = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Customer',
            dataIndex: ['customerDetails', 'name'],
            key: 'customerName',
        },
        {
            title: 'Items',
            key: 'items',
            render: (_, record) => (
                <Badge count={record.items.length} showZero color="#5fc551">
                    <Text>{record.items.length} items</Text>
                </Badge>
            ),
        },
        {
            title: 'Total Amount',
            dataIndex: 'total',
            key: 'total',
            render: (total: number) => `₹${total.toFixed(2)}`,
        },
        {
            title: 'Payment Method',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        onClick={() => navigate(`/viewSales/${record._id}`)}
                    >
                        View Details
                    </Button>
                </Space>
            ),
        },
    ];

    const getTotalRevenue = () => {
        return salesData.reduce((sum, sale) => sum + sale.total, 0);
    };

    const getTotalOrders = () => {
        return salesData.length;
    };

    const getTotalItems = () => {
        return salesData.reduce((sum, sale) => sum + sale.items.length, 0);
    };

    return (
        <div>
            <NavBar />
            <div className="min-h-screen p-6 mx-5">
                <h1 className="text-center text-2xl font-bold mb-6">Sales Management</h1>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
                    <Card className='bg-black text-center'>
                        <Statistic
                            title={<span className="text-white font-bold">Total Revenue</span>}
                            value={getTotalRevenue()}
                            prefix={<DollarOutlined className="text-green-500" />}
                            valueStyle={{ color: '#5fc551', fontWeight: 'bold' }}
                        />
                    </Card>

                    <Card className='bg-black text-center'>
                        <Statistic
                            title={<span className="text-white font-bold">Total Orders</span>}
                            value={getTotalOrders()}
                            prefix={<ShoppingCartOutlined className="text-green-500" />}
                            valueStyle={{ color: '#5fc551', fontWeight: 'bold' }}
                        />
                    </Card>

                    <Card className='bg-black text-center'>
                        <Statistic
                            title={<span className="text-white font-bold">Total Items Sold</span>}
                            value={getTotalItems()}
                            prefix={<ShoppingCartOutlined className="text-green-500" />}
                            valueStyle={{ color: '#5fc551', fontWeight: 'bold' }}
                        />
                    </Card>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => navigate('/CreateSales')}
                        className="bg-blue-500"
                    >
                        Create New Sale
                    </Button>
                </div>

                <Table
                    dataSource={salesData}
                    columns={columns}
                    expandable={{
                        expandedRowRender,
                        expandRowByClick: true,
                    }}
                    loading={loading}
                    rowKey="_id"
                    bordered
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} sales`
                    }}
                />
            </div>
            <Footer />
        </div>
    );
};

export default Sales;