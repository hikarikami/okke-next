export type InvoiceStatus = 'draft' | 'sent';

export interface InvoiceLineItem {
	id: string;
	description: string;
	quantity: number;
	unitPrice: number;
	total: number;
}

export interface Invoice {
	id: string;
	number: string; // e.g. "INV-001"
	status: InvoiceStatus;
	issueDate: string; // YYYY-MM-DD
	dueDate: string; // YYYY-MM-DD

	from: {
		name: string;
		address?: string;
		email?: string;
		phone?: string;
	};

	billTo: {
		name: string;
		address?: string;
		email?: string;
	};

	lineItems: InvoiceLineItem[];

	taxEnabled: boolean;
	taxRate: number; // e.g. 10 (for 10%)
	subtotal: number;
	taxAmount: number;
	total: number;

	notes?: string;
	paymentTerms?: string;

	createdAt: string;
	updatedAt: string;
}
