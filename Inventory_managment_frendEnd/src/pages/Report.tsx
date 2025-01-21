import { useEffect, useState } from 'react';
import { Table, Button, DatePicker, message } from 'antd';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import axiosInstance from '../service/axiosConfigue';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from "jspdf";
import "jspdf-autotable";

const { RangePicker } = DatePicker;

// Define types for your data
interface CustomerDetails {
    name: string;
}

interface SalesReport {
    _id: string;
    date: string;
    customerDetails: CustomerDetails;
    itemName: string;
    price: number;
    quantity: number;
    total: number;
    paymentMethod: string;
}

interface ProductReport {
    _id: string;
    name: string;
    quantity: number;
    price: number;
    totalUnitsSold: number;
    totalRevenue: number;
}

type ReportType = 'sales' | 'product';

// Define the columns type
type ColumnsType = {
    sales: any[];  // You can make this more specific if needed
    product: any[];
}

const ReportPage = () => {
    const [reportData, setReportData] = useState<(SalesReport | ProductReport)[]>([]);
    const [dateRange, setDateRange] = useState<[Date | null, Date | null] | null>(null);
    const [activeReport, setActiveReport] = useState<ReportType>("product");

    const fetchReport = async (reportType: ReportType = "product") => {
        try {
            const endpoint = reportType === 'sales' ? '/api/sales/salesReport' : '/api/product/productreport';
            const response = await axiosInstance.get(endpoint);

            if (response.data.status) {
                console.log(response.data.result);
                const data = reportType === 'sales'
                    ? response.data.result.salesReport || []
                    : response.data.result.productReport || [];
                setReportData(data);
                setActiveReport(reportType);
            } else {
                message.error(response.data.message || 'Failed to fetch report.');
            }
        } catch (error) {
            console.error('Error fetching report:', error);
            message.error('An error occurred while fetching the report.');
        }
    };

    const handleDateRangeChange = (dates: any) => {
        setDateRange(dates);
    };

    const exportToExcel = (data: (SalesReport | ProductReport)[], fileName: string) => {
        let processedData = data;
        if (fileName === "Sales_Report") {
            processedData = (data as SalesReport[]).map((item) => ({
                Date: new Date(item.date).toLocaleDateString(),
                Customer: item.customerDetails ? item.customerDetails.name : 'N/A',
                "Item Name": item.itemName,
                Price: `${item.price.toFixed(2)}`,
                Quantity: item.quantity,
                Total: `${item.total.toFixed(2)}`,
                "Payment Method": item.paymentMethod,
            }));
        }

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(processedData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: "array" });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, `${fileName}.xlsx`);
    };

    const columns: ColumnsType = {
        sales: [
            {
                title: 'Date',
                dataIndex: 'date',
                key: 'date',
                render: (date: string) => new Date(date).toLocaleDateString(),
            },
            {
                title: 'Customer',
                dataIndex: 'customerDetails',
                key: 'customerName',
                render: (customerDetails: CustomerDetails) => customerDetails ? customerDetails.name : 'N/A'
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
                render: (price: number) => `RS:${price.toFixed(2)}`,
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
        ],
        product: [
            { title: 'Product Name', dataIndex: 'name', key: 'name' },
            { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
            { title: 'Price', dataIndex: 'price', key: 'price', render: (price: number) => `$${price.toLocaleString()}` },
            { title: 'Total Units Sold', dataIndex: 'totalUnitsSold', key: 'totalUnitsSold' },
            { title: 'Total Revenue', dataIndex: 'totalRevenue', key: 'totalRevenue', render: (revenue: number) => `$${revenue.toLocaleString()}` },
        ],
    };

    const exportAsPdf = (data: (SalesReport | ProductReport)[], fileName: string) => {
        const doc = new jsPDF();
        const title = fileName === "Sales_Report" ? "Sales Report" : "Product Report";

        let tableData: (string | number)[][] = [];
        let tableColumns: string[] = [];

        if (fileName === "Sales_Report") {
            tableColumns = [
                "Date",
                "Customer",
                "Item Name",
                "Price",
                "Quantity",
                "Total",
                "Payment Method",
            ];

            tableData = (data as SalesReport[]).map((item) => [
                new Date(item.date).toLocaleDateString(),
                item.customerDetails ? item.customerDetails.name : "N/A",
                item.itemName,
                `RS:${item.price.toFixed(2)}`,
                item.quantity,
                `RS:${item.total.toFixed(2)}`,
                item.paymentMethod,
            ]);
        } else {
            tableColumns = [
                "Product Name",
                "Quantity",
                "Price",
                "Total Units Sold",
                "Total Revenue",
            ];

            tableData = (data as ProductReport[]).map((item) => [
                item.name,
                item.quantity,
                `$${item.price.toLocaleString()}`,
                item.totalUnitsSold,
                `$${item.totalRevenue.toLocaleString()}`,
            ]);
        }

        doc.text(title, 14, 10);
        doc.autoTable({
            startY: 20,
            head: [tableColumns],
            body: tableData,
        });

        doc.save(`${fileName}.pdf`);
    };

    const printData = (data: (SalesReport | ProductReport)[], reportName: string) => {
        const print = window.open("", "_blank");
        if (!print) return;

        const tableData = data as ProductReport[];  // Type assertion since we only print product reports

        print.document.write(`
            <html>
                <head>
                    <title>${reportName}</title>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f4f4f4; }
                    </style>
                </head>
                <body>
                    <h1>${reportName}</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total Revenue</th>
                                <th>Total Units Sold</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableData.map(item => `
                                <tr>
                                    <td>${item.name}</td>
                                    <td>${item.price}</td>
                                    <td>${item.quantity}</td>
                                    <td>${item.totalRevenue}</td>
                                    <td>${item.totalUnitsSold}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
            </html>
        `);

        print.document.close();
        print.print();
    };

    useEffect(() => {
        fetchReport("product");
    }, []);

    return (
        <div>
            <NavBar />
            <div className="min-h-screen p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <div className="space-x-4">
                            <Button
                                type={activeReport === 'product' ? 'primary' : 'default'}
                                onClick={() => fetchReport('product')}
                                className="bg-black text-white"
                            >
                                Product Report
                            </Button>
                            <Button
                                type={activeReport === 'sales' ? 'primary' : 'default'}
                                onClick={() => fetchReport('sales')}
                                className="bg-black text-white"
                            >
                                Sales Report
                            </Button>
                        </div>
                        <div className="space-x-4">
                            <Button
                                onClick={() => exportToExcel(reportData, activeReport === 'sales' ? 'Sales_Report' : 'Product_Report')}
                                className="bg-green-500 text-white"
                            >
                                Export to Excel
                            </Button>
                            <Button
                                onClick={() => exportAsPdf(reportData, activeReport === 'sales' ? 'Sales_Report' : 'Product_Report')}
                                className="bg-green-500 text-white"
                            >
                                Export to PDF
                            </Button>
                            <Button
                                onClick={() => printData(reportData, activeReport === 'sales' ? 'Sales_Report' : 'Product_Report')}
                                className="bg-green-500 text-white"
                            >
                                Print Data
                            </Button>
                        </div>

                        {activeReport === 'sales' && (
                            <RangePicker onChange={handleDateRangeChange} className="w-64" />
                        )}
                    </div>

                    {activeReport && (
                        <div>
                            <h2 className="text-2xl font-bold mb-4">
                                {activeReport === 'sales' ? 'Sales Report' : 'Product Report'}
                            </h2>
                            <Table
                                columns={columns[activeReport]}
                                dataSource={reportData}
                                rowKey="_id"
                                summary={(pageData) => {
                                    let total = 0;
                                    if (activeReport === 'sales') {
                                        total = (pageData as SalesReport[]).reduce((sum, row) => sum + row.total, 0);
                                    } else {
                                        total = (pageData as ProductReport[]).reduce((sum, row) => sum + row.totalRevenue, 0);
                                    }
                                    return (
                                        <Table.Summary.Row>
                                            <Table.Summary.Cell index={0} colSpan={activeReport === 'sales' ? 4 : 4}>
                                                {activeReport === 'sales' ? 'Total Sales' : 'Total Revenue'}
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={1}>
                                                ${total.toLocaleString()}
                                            </Table.Summary.Cell>
                                        </Table.Summary.Row>
                                    );
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ReportPage;