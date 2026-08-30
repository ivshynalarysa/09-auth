'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarLoader } from 'react-spinners';

type Props = {
	children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
	const [loading, setLoading] = useState(true);

	const router = useRouter();

	useEffect(() => {
		router.refresh();
		setLoading(false);
	}, [router]);

	return <>{loading ? <BarLoader color="#ffffff" width={80} height={4} /> : children}</>;
}