import { Calendar } from "@/components/ui/calendar"

interface MonthCalendarProps {
  date?: Date;
  reservations?: any[];
  blocks?: any[];
}

export function MonthCalendar({ date, reservations, blocks }: MonthCalendarProps) {
  return (
    <div className="p-4 bg-white rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Calendar View</h3>
      <Calendar />
      {reservations && reservations.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Reservations</h4>
          <div className="space-y-1">
            {reservations.slice(0, 3).map((res) => (
              <div key={res.id} className="text-sm text-gray-600">
                {res.customerName} - {res.checkIn.toLocaleDateString()}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}