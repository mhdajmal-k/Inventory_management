interface CustomerDetails {
    name: string;
    address: string;
    email: string;
    mobile: string;
}

interface Item {
    productId: string;
    itemName: string;
    price: number;
    quantity: number;
    _id: string;
}

export default interface SalesReport {
    _id: string;
    items: Item[];
    paymentMethod: string;
    total: number;
    date: string;
    customerDetails: CustomerDetails[];
}
