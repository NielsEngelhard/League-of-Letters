export default function KeyboardColorExplanation() {
    return (
      <div className="flex justify-center mt-3 gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-success rounded-full" />
              <span>Correct</span>
          </div>
          <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-warning rounded-full" />
              <span>Close</span>
          </div>
          <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-error rounded-full" />
              <span>Wrong</span>
          </div>
      </div>
    )
}