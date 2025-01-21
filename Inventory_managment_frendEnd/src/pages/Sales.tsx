import { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { DollarOutlined, PlusOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Col, Statistic, Table, } from 'antd';
import axiosInstance from '../service/axiosConfigue';
import { getSale } from '../service/api';
import { toast } from 'sonner';

const Sales = () => {
    const navigate = useNavigate();
    const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch sales data from the backend
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
                toast.error(error.response.data.message || 'Failed to fetch products.');
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
    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Customer',
            dataIndex: 'customerDetails',
            key: 'customerDetails',
            render: (record) => record.customerDetails?.name ?? 'N/A'
        },
        {
            title: 'Item Name',
            dataIndex: 'itemName',
            key: 'itemName',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => ` RS:${price.toFixed(2)}`,
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            render: (total: number) => `RS:${total.toFixed(2)}`,
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
                <Button
                    type="link"
                    onClick={() => navigate(`/viewSales/${record._id}`)}
                >
                    View Details
                </Button>
            ),
        },
    ];

    return (
        <div>
            <NavBar />
            <div className="min-h-screen p-6 mx-5">
                <h1 className="text-center text-xl font-bold">Sales Management</h1>
                <div className='flex justify-between gap-3 m-2'>
                    <Col xs={24} sm={12} md={5}>
                        <Card className='bg-black text-center'>
                            <Statistic
                                className='text-white'
                                title={
                                    <span style={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center', display: 'block' }}>
                                        Total Sales
                                    </span>
                                }
                                value={salesData.reduce((sum, sale) => sum + sale.total, 0)}
                                prefix={<DollarOutlined style={{ color: '#5fc551' }} />}
                                valueStyle={{ color: '#5fc551', fontWeight: 'bold' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={5}>
                        <Card className='bg-black text-center'>
                            <Statistic
                                title={
                                    <span style={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center', display: 'block' }}>
                                        Orders
                                    </span>
                                }
                                value={salesData.length}
                                prefix={<ShoppingCartOutlined style={{ color: '#5fc551' }} />}
                                valueStyle={{ color: '#5fc551', fontWeight: 'bold' }}
                            />
                        </Card>
                    </Col>

                </div>

                <div className="flex items-center m-5 justify-between">
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => navigate('/CreateSales')}
                    >
                        Add New Item
                    </Button>
                </div>
                <Table
                    dataSource={salesData}
                    columns={columns}
                    loading={loading}
                    rowKey="_id" // Assuming `_id` is the unique identifier for each sale
                    bordered
                />
            </div>
            <Footer />
        </div >
    );
};

export default Sales;
