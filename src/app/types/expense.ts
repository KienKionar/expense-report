export interface Expense {
  id: number;
  amount: number;
  description?: string;
  date: string;
  category: {
    name: string;
    icon?: string;
  };
}
