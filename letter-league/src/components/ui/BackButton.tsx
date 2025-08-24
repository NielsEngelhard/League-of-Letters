import { ArrowBigLeft } from "lucide-react";
import Button from "./Button";
import Link from "next/link";

interface Props {
    href: string;
    text?: string;
}

export default function BackButton({ href, text = "Back" }: Props) {
    return (
        <Button
            href={href}
            size="sm"
            variant="skeleton">
            <div className="flex gap-1 items-center">
                <ArrowBigLeft size={16} />
                {text}
            </div>
        </Button>        
    )
}