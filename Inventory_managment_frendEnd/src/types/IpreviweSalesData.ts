interface CustomerDetails {
    name: string
    address: string
    email: string
    mobile: string
}

export default interface SalesReport {
    _id: string
    itemName: string
    price: number
    quantity: number
    paymentMethod: string
    total: number
    date: string
    customerDetails: CustomerDetails[]
}
