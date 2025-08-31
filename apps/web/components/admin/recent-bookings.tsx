import { useReservations } from "@/lib/hooks/use-reservations"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function RecentBookings() {
  const { reservations, loading } = useReservations()

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reservations.slice(0, 5).map((reservation) => (
            <div key={reservation.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{reservation.customerName}</p>
                <p className="text-sm text-gray-500">
                  {reservation.checkIn.toLocaleDateString()} - {reservation.checkOut.toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">₹{reservation.total.toLocaleString()}</p>
                <p className={`text-sm ${
                  reservation.status === 'CONFIRMED' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {reservation.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}