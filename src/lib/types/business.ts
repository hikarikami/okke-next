export type InvoiceTheme = 'classic' | 'modern' | 'minimal' | 'bold';

export interface BusinessAddress {
	street: string;
	street2?: string;
	suburb: string;
	state: string;
	postcode: string;
	country: string;
}

export interface BusinessSettings {
	name: string;
	abn: string;
	streetAddress: BusinessAddress;
	postalAddressSameAsStreet: boolean;
	postalAddress: BusinessAddress;
	phone: string;
	website: string;
	email: string;
	/** Base64 data URL or a path/URL to the uploaded logo */
	logoUrl: string;
	invoiceTheme: InvoiceTheme;
	/** Hex colour used as the accent across invoices and other branded output */
	brandColour: string;
}

export const DEFAULT_BUSINESS_SETTINGS: BusinessSettings = {
	name: '',
	abn: '',
	streetAddress: {
		street: '',
		street2: '',
		suburb: '',
		state: '',
		postcode: '',
		country: 'Australia'
	},
	postalAddressSameAsStreet: true,
	postalAddress: {
		street: '',
		street2: '',
		suburb: '',
		state: '',
		postcode: '',
		country: 'Australia'
	},
	phone: '',
	website: '',
	email: '',
	logoUrl: '',
	invoiceTheme: 'classic',
	brandColour: '#37a87d'
};
