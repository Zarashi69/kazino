import { cn } from "@/lib/utils";

interface TitleProps {
    children: React.ReactNode;
    className?: string;
}

export const Title = ({ children, className }: TitleProps) => {
    return (
        <h1 className={`text-3xl font-bold ${className || ''}`}>
            {children}
        </h1>
    );
};