import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface CalendarProps {
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  disabled?: (date: Date) => boolean
}

// Simple calendar component for now
export function Calendar({ selected, onSelect, disabled }: CalendarProps) {
  const today = new Date()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay()
  
  const days = []
  
  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="p-2"></div>)
  }
  
  // Add days of month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(today.getFullYear(), today.getMonth(), day)
    const isSelected = selected && format(date, 'yyyy-MM-dd') === format(selected, 'yyyy-MM-dd')
    const isDisabled = disabled?.(date)
    
    days.push(
      <button
        key={day}
        type="button"
        onClick={() => onSelect?.(date)}
        disabled={isDisabled}
        className={cn(
          "p-2 hover:bg-gray-100 rounded text-sm",
          isSelected && "bg-blue-600 text-white hover:bg-blue-700",
          isDisabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {day}
      </button>
    )
  }
  
  return (
    <div className="p-3">
      <div className="text-center font-medium mb-4">
        {format(today, 'MMMM yyyy')}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="p-2 text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
        {days}
      </div>
    </div>
  )
}

export { CalendarIcon }