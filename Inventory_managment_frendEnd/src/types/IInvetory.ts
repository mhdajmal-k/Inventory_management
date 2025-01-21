

export default interface InventoryItem {
    _id: string;
    name: string;
    description: string;
    quantity: number;
    price: number;
    totalStockValue: number;
    block: boolean;
}