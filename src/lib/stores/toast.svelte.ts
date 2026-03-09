export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
	id: string;
	message: string;
	type: ToastType;
}

const DURATION_MS = 3500;

function createToastStore() {
	let toasts = $state<Toast[]>([]);

	function add(message: string, type: ToastType = 'success') {
		const id = crypto.randomUUID();
		toasts = [...toasts, { id, message, type }];
		setTimeout(() => remove(id), DURATION_MS);
	}

	function remove(id: string) {
		toasts = toasts.filter((t) => t.id !== id);
	}

	return {
		get toasts() {
			return toasts;
		},
		add,
		remove
	};
}

export const toastStore = createToastStore();
