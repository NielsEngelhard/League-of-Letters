import BackButton from "../BackButton";
import Title from "../text/Title";

interface Props {
    title: string;
    subText?: string;
    titleSize?: "sm" | "md" | "lg";
    titleColor?: "primary" | "text" | "gradient";    
    backHref?: string;
    children?: React.ReactElement;
}

export default function PageIntro({ title, subText, titleSize = "md", titleColor = "primary", backHref, children }: Props) {
    return (
        <div className="w-full flex flex-col items-center text-center md:space-y-3">
            {/* <div className="relative flex w-full items-center justify-between">
                <div>
                    {backHref && <BackButton href={backHref} />}
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 text-center">
                    <Title title={title} size={titleSize} color={titleColor} />
                </div>

                <div />
            </div> */}

            <div className="relative flex flex-row w-full justify-center">
                {backHref && (
                    <div className="absolute left-0">
                        <BackButton href={backHref} />
                    </div>
                )}

                <Title title={title} size={titleSize} color={titleColor} />
            </div>

            
            <div className="">
                    {subText && (
                    <div className="text-lg md:text-xl text-foreground-muted" 
                        style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
                        {subText}
                    </div>
                )}
                
                {children}
            </div>
        </div>
    );
}