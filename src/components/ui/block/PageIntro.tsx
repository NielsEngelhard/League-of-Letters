import Title from "../text/Title";

interface Props {
    title: string;
    subText?: string;
    titleSize?: "sm" | "md" | "lg";
    titleColor?: "primary" | "text" | "gradient";    
}

export default function PageIntro({ title, subText, titleSize = "md", titleColor = "primary" }: Props) {
    return (
        <div className="w-full flex flex-col gap-4 text-center">
            <Title
                title={title}
                size={titleSize}
                color={titleColor}
            />

            {subText && (
                <div className="text-xl text-foreground-muted">
                    {subText}
                </div>
            )}
        </div>
    );
}
