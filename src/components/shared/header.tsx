"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface Props {
    className?: string;
}

export const Header: React.FC<Props> = ({ className }) => {
    const router = useRouter();

    return (
        <header className={cn('w-full bg-black text-white py-4', className)}>
            <div className="container mx-auto px-4 flex justify-between items-center">
                <Link href="/" className="text-xl font-bold hover:text-gray-200">
                    Билеты
                </Link>
                <nav>
                    <Button
                        variant="ghost"
                        className="text-white hover:text-gray-200"
                        onClick={() => router.push('/tickets')}
                    >
                        Мои билеты
                    </Button>
                </nav>
            </div>
        </header>
    );
};
