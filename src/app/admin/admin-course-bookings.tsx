'use client';

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
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
  date?: string
  freeSeats?: number
}

export function AdminCourseBookings() {

  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  async function loadBookings() {

    const snapshot = await getDocs(collection(db, "courseBookings"))

    const data = await Promise.all(

      snapshot.docs.map(async (docSnap) => {

        const booking = docSnap.data() as any

        let date = ""
        let freeSeats = 0

        try {

          const dateRef = doc(db, "courseDates", booking.dateId)
          const dateDoc = await getDoc(dateRef)

          if (dateDoc.exists()) {

            const dateData = dateDoc.data() as any

            if (dateData.date) {
              date = dateData.date.toDate().toLocaleDateString("cs-CZ")
            }

            const courseRef = doc(db, "courses", booking.courseId)
            const courseDoc = await getDoc(courseRef)

            if (courseDoc.exists()) {

              const courseData = courseDoc.data() as any

              const capacity = courseData.capacity || 0
              const bookedSeats = dateData.bookedSeats || 0

              freeSeats = capacity - bookedSeats
            }
          }

        } catch (error) {
          console.error("Error loading course data", error)
        }

        return {
          id: docSnap.id,
          ...booking,
          date,
          freeSeats
        }

      })

    )

    setBookings(data as Booking[])
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

  async function rejectBooking(id: string) {

    await fetch("/api/reject-booking", {
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
                Date: {booking.date || "Unknown"}
              </p>

              <p className="text-sm">
                Free seats: {booking.freeSeats}
              </p>

              <p className="text-sm">
                Status: {booking.status}
              </p>

            </div>

            {booking.status !== "confirmed" && booking.status !== "rejected" && (

              <div className="flex gap-2">

                <Button
                  onClick={() => confirmBooking(booking.id)}
                >
                  Confirm Payment
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => rejectBooking(booking.id)}
                >
                  Reject
                </Button>

              </div>

            )}

          </div>

        ))}

      </CardContent>

    </Card>

  )
}