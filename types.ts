
export interface Expense {
    id: string;
    title: string;
    amount: number;
    category: string;
    date: string; // YYYY-MM-DD
    tags?: string[];
}

export interface Income {
    id: string;
    title: string;
    amount: number;
    date: string; // YYYY-MM-DD
}

export type Transaction = Expense | Income;

export interface Category {
    label: string;
    icon: string;
    budget?: number | null;
}

export interface Categories {
    [key: string]: Category;
}

export type SortOrder = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';

export type HistoryType = 'expenses' | 'income' | 'all';

export enum View {
    MAIN = 'main',
    YEARLY_REPORT = 'yearly_report',
}

export enum ModalType {
    EXPENSE = 'expense',
    INCOME = 'income',
    BUDGET = 'budget',
    CATEGORY = 'category',
    SETTINGS = 'settings',
}

export interface DeleteInfo {
    id: string | null;
    type: 'expense' | 'income' | 'category' | 'all-data';
}
