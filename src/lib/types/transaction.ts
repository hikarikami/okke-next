export type TransactionType = 'income' | 'expense';

export interface Transaction {
	id: string;
	type: TransactionType;
	description: string;
	amount: number;
	categoryId: string;
	date: string; // YYYY-MM-DD
	createdAt: string;
	updatedAt: string;
}

export interface Category {
	id: string;
	label: string;
	type: TransactionType | 'both';
	color: string;
}

export const CATEGORY_COLORS = [
	'#ef4444', // red
	'#f97316', // orange
	'#eab308', // yellow
	'#84cc16', // lime
	'#22c55e', // green
	'#14b8a6', // teal
	'#06b6d4', // cyan
	'#3b82f6', // blue
	'#8b5cf6', // violet
	'#a855f7', // purple
	'#ec4899', // pink
	'#6b7280' //  gray
] as const;

export const DEFAULT_CATEGORIES: Category[] = [
	{ id: 'client-payment', label: 'Client Payment', type: 'income', color: '#22c55e' },
	{ id: 'salary', label: 'Salary', type: 'income', color: '#3b82f6' },
	{ id: 'refund', label: 'Refund', type: 'income', color: '#06b6d4' },
	{ id: 'misc-income', label: 'Misc Income', type: 'income', color: '#a855f7' },
	{ id: 'food', label: 'Food', type: 'expense', color: '#ef4444' },
	{ id: 'rent', label: 'Rent', type: 'expense', color: '#f97316' },
	{ id: 'transport', label: 'Transport', type: 'expense', color: '#eab308' },
	{ id: 'software', label: 'Software', type: 'expense', color: '#8b5cf6' },
	{ id: 'equipment', label: 'Equipment', type: 'expense', color: '#ec4899' },
	{ id: 'other', label: 'Other', type: 'both', color: '#6b7280' }
];
