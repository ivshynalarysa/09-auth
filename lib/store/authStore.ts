import { User } from '@/types/user';
import { create } from 'zustand';

type UserStoreType = {
	isAuthenticated: boolean;
	user: User | null;
	setUser: (user: User) => void;
	clearIsAuthenticated: () => void;
};

export const useAuthStore = create<UserStoreType>()(set => ({
	isAuthenticated: false,
	user: null,
	setUser: (user: User) => {
		set(() => {
			return { user, isAuthenticated: true };
		});
	},
	clearIsAuthenticated: () => {
		set(() => {
			return { user: null, isAuthenticated: false };
		});
	},
}));