import { Calendar } from "@/components/ui/calendar"

export function MonthCalendar() {
  return (
    <div className="p-4 bg-white rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Calendar View</h3>
      <Calendar />
    </div>
  )
}