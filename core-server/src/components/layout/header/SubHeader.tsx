import Link from "next/link";

interface Props {

}

    const mainNavItems = [
        { label: "Solo Game", href: "/solo", icon: "🎯" },
        { label: "Online Game", href: "/online", icon: "🌐" },
        { label: "Create Game", href: "/create", icon: "➕" },
        { label: "Join Game", href: "/join", icon: "🔗" }
    ];

    const subNavItems = [
        { label: "Settings", href: "/settings" },
        { label: "Score System", href: "/scores" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "My Profile", href: "/profile" }
    ];

export default function SubHeader({}: Props) {
    return (
        <div className="w-full flex flex-row justify-between">
            {/* Left (main) */}
            <div className="flex flex-row gap-2">
                {mainNavItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="group relative flex items-center gap-1 text-sm font-medium text-foreground-muted hover:text-foreground"
                    >
                        <span className="text-xs opacity-60 group-hover:opacity-80 transition-opacity">
                            {item.icon}
                        </span>
                        {item.label}

                        {/* Active/hover indicator */}
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-4/5 transition-all duration-300 ease-out" />                        
                    </Link>
                ))}
            </div>

            {/* Right (secondary) */}
            <div className="hidden md:flex items-center gap-3">
                {subNavItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="group relative rounded-md text-xs font-medium text-foreground/50 hover:text-foreground/80 transition-all duration-200 hover:bg-background-secondary/30"
                    >
                        {item.label}
                        
                        {/* Active/hover indicator */}
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-4/5 transition-all duration-300 ease-out" />
                    </Link>
                ))}
            </div>
        </div>
    )
}