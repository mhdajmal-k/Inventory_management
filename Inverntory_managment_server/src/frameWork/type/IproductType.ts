export interface IItem extends Document {
    name: string;
    description: string;
    quantity: number;
    price: number;
    totalStockValue: number;
    block: boolean
}