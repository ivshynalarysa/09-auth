export interface SignRequest {
	email: string;
	password: string;
}

export type CheckSessionResponse = {
	success: boolean;
};