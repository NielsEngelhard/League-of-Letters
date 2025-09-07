import Card from "./Card";
import { CardContent, CardHeader, CardTitle } from "./card-children";

interface Props {
    title: string;
    Icon?: React.ElementType;
    children: React.ReactNode;
}

export default function DefaultCard({ title, Icon, children }: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    {Icon && <Icon className="w-4 h-4" />}
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>     
    )
}