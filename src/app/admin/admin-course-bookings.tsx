'use client';

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Booking = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  courseId: string
  dateId: string
  status: string
}

export function AdminCourseBookings() {

  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  async function loadBookings() {

    const snapshot = await getDocs(collection(db, "courseBookings"))

    const data: Booking[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as any)
    }))

    setBookings(data)
    setLoading(false)
  }

  useEffect(() => {
    loadBookings()
  }, [])

  async function confirmBooking(id: string) {

    await fetch("/api/confirm-booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ bookingId: id })
    })

    loadBookings()
  }

  if (loading) {
    return <p>Loading bookings...</p>
  }

  return (

    <Card>

      <CardHeader>
        <CardTitle>Course Bookings</CardTitle>
      </CardHeader>

      <CardContent>

        {bookings.length === 0 && (
          <p>No bookings yet.</p>
        )}

        {bookings.map(booking => (

          <div
            key={booking.id}
            className="border p-4 rounded-md mb-4 flex justify-between items-center"
          >

            <div>

              <p className="font-semibold">
                {booking.firstName} {booking.lastName}
              </p>

              <p className="text-sm">
                {booking.email}
              </p>

              <p className="text-sm">
                Course: {booking.courseId}
              </p>

              <p className="text-sm">
                Status: {booking.status}
              </p>

            </div>

            {booking.status !== "confirmed" && (

              <Button
                onClick={() => confirmBooking(booking.id)}
              >
                Confirm Payment
              </Button>

            )}

          </div>

        ))}

      </CardContent>

    </Card>

  )
}