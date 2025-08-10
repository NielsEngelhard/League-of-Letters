import BackButton from "../BackButton";
import { OptionItem, OptionsMenu } from "../OptionsMenu";
import Title from "../text/Title";

interface Props {
    title: string;
    subText?: string;
    titleSize?: "sm" | "md" | "lg";
    titleColor?: "primary" | "text" | "gradient";    
    backHref?: string;
    children?: React.ReactElement;
    options?: OptionItem[];
}

export default function PageIntro({ title, subText, titleSize = "md", titleColor = "primary", backHref, children, options }: Props) {
    return (
        <div className="w-full flex flex-col items-center text-center md:space-y-3">
            <div className="relative flex flex-row w-full justify-center">
                {backHref && (
                    <div className="absolute left-0">
                        <BackButton href={backHref} />
                    </div>
                )}

                <Title title={title} size={titleSize} color={titleColor} />

                <div className="absolute right-0">
                    {options && <OptionsMenu options={options} />}
                </div>             
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