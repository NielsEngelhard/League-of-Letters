export default function FullScreenLoading() {
    return (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
                {/* Main loading spinner */}
                <div className="relative">
                {/* Outer ring */}
                <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-spin border-t-blue-500"></div>
                {/* Inner ring */}
                <div className="absolute top-2 left-2 w-12 h-12 border-4 border-gray-100 rounded-full animate-spin animate-reverse border-t-secondary"></div>
                {/* Center dot */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse"></div>
                </div>
                
                {/* Loading text with animated dots */}
                <div className="flex items-center space-x-1 text-gray-600">
                <span className="text-lg font-medium">Loading</span>
                <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                </div>
                
                {/* Progress bar */}
                <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse"></div>
                </div>
            </div>
        </div>        
    )
}