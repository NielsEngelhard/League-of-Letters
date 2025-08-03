export default function KeyboardColorExplanation() {
    return (
      <div className="mt-4 flex justify-center gap-4 text-xs text-foreground-muted flex-row md:flex-row">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-success rounded"></div>
          <span>Correct</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-warning rounded"></div>
          <span>Wrong Position</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-error rounded"></div>
          <span>Not in Word</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-border rounded"></div>
          <span>Unguessed</span>
        </div>        
      </div>
    )
}