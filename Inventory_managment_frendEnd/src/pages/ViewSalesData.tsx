import { Card, Descriptions, Typography, Divider, Tag, Button } from "antd"
import { DollarOutlined, CalendarOutlined, UserOutlined, DownloadOutlined } from "@ant-design/icons"
import { useEffect, useState } from "react"
// import SalesReport from "../types/IpreviweSalesData"
import { useParams } from "react-router-dom"
import axiosInstance from "../service/axiosConfigue"
import { toast } from "sonner"
import { viewSaleData } from "../service/api"
import Footer from "../components/Footer"
import NavBar from "../components/NavBar"
import jsPDF from "jspdf";
import "jspdf-autotable";
import SalesReport from "../types/IpreviweSalesData"

declare module 'jspdf' {
    interface jsPDF {
        autoTable: (options: any) => jsPDF;
    }
}

const { Title } = Typography;

const SalesReportPreview = () => {
    const { id } = useParams();
    const [salesData, setSalesData] = useState<SalesReport>();
    const [loading, setLoading] = useState(false);

    const fetchSalesDataById = async (id: string) => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`${viewSaleData}/${id}`);
            if (response.status === 200 || response.status === 201) {
                console.log(response.data.result, "is the ")
                setSalesData(response.data.result);
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

    const downloadReceipt = () => {
        if (!salesData) return;

        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Sales Receipt", 14, 20);

        doc.setFontSize(12);
        doc.text("Customer Details:", 16, 30);
        doc.text(`Name: ${salesData.customerDetails[0].name}`, 14, 36);
        doc.text(`Email: ${salesData.customerDetails[0].email}`, 14, 42);
        doc.text(`Mobile: ${salesData.customerDetails[0].mobile}`, 14, 48);
        doc.text(`Address: ${salesData.customerDetails[0].address}`, 14, 54);

        doc.text("Sales Details:", 14, 64);

        const tableData = salesData.items.map(item => [
            item.itemName,
            `RS:${item.price.toFixed(2)}`,
            item.quantity
        ]);

        doc.autoTable({
            startY: 70,
            head: [["Item Name", "Price", "Quantity"]],
            body: tableData,
        });

        doc.text("Payment Method:", 14, doc.finalY + 10);
        doc.text(salesData.paymentMethod, 50, doc.lastAutoTable.finalY + 10);

        doc.text("Total:", 14, doc.lastAutoTable.finalY + 20);
        doc.text(`RS:${salesData.total.toFixed(2)}`, 50, doc.lastAutoTable.finalY + 20);

        doc.text("Thanks for shopping with us", 50, doc.lastAutoTable.finalY + 40);

        doc.save(`Sales_Receipt_${salesData.customerDetails[0].name}.pdf`);
    };

    useEffect(() => {
        fetchSalesDataById(id!);
    }, []);

    return (
        <>
            <NavBar />
            <div className="min-h-screen m-2 p-2">
                <div className="text-end m-4">
                    <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        onClick={downloadReceipt}
                        disabled={loading || !salesData}
                    >
                        Download Receipt
                    </Button>
                </div>

                <Card
                    className="text-black"
                    title={<Title level={3}>Sales Report Preview</Title>}
                    extra={<Tag color="blue">{salesData?._id}</Tag>}
                    style={{ maxWidth: 700, margin: "0 auto" }}
                    loading={loading}
                >
                    <Card
                        type="inner"
                        title={
                            <>
                                <UserOutlined /> {salesData?.customerDetails[0].name}
                            </>
                        }
                    >
                        <Descriptions column={1}>
                            <Descriptions.Item label={<strong>Email</strong>}>
                                <strong>{salesData?.customerDetails[0].email}</strong>
                            </Descriptions.Item>
                            <Descriptions.Item label={<strong>Mobile</strong>}>
                                {salesData?.customerDetails[0].mobile}
                            </Descriptions.Item>
                            <Descriptions.Item label={<strong>Address</strong>}>
                                {salesData?.customerDetails[0].address}
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                    <Divider orientation="left">Sales Details</Divider>
                    <Descriptions column={1} bordered>
                        <Descriptions.Item label={<strong>Date</strong>}>
                            <CalendarOutlined /> <strong>{salesData?.date.slice(0, 10)}</strong>
                        </Descriptions.Item>
                        {salesData?.items.map((item, index) => (
                            <Descriptions.Item key={index} label={<strong>Item {index + 1}</strong>}>
                                <strong>{item.itemName} - RS:{item.price.toFixed(2)} x {item.quantity}</strong>
                            </Descriptions.Item>
                        ))}
                        <Descriptions.Item label={<strong>Payment Method</strong>}>
                            <Tag color="green">
                                <strong>{salesData?.paymentMethod}</strong>
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label={<strong>Total</strong>}>
                            <Title level={4}>
                                <DollarOutlined /> <strong>RS:{salesData?.total.toFixed(2)}</strong>
                            </Title>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            </div>
            <Footer />
        </>
    );
};

export default SalesReportPreview;
