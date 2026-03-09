export interface Company {
	id: string;
	name: string;
}

export interface Contact {
	id: string;
	name: string;
	email: string;
	companyId?: string;
	createdAt: string;
	updatedAt: string;
}
