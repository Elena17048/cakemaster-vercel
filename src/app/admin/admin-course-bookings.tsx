'use client';

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

type Booking = {
  id: string
  firstName: string
  lastName: string
  email: string
  courseId: string
  dateId: string
  status: string
  date?: string
}

export function AdminCourseBookings() {

  const [groupedBookings, setGroupedBookings] = useState<any>({})
  const [loading, setLoading] = useState(true)

  async function loadBookings() {

    const snapshot = await getDocs(collection(db, "courseBookings"))

    const bookings = await Promise.all(

      snapshot.docs.map(async (docSnap) => {

        const booking = docSnap.data() as any

        let date = ""

        try {

          const dateRef = doc(db, "courseDates", booking.dateId)
          const dateDoc = await getDoc(dateRef)

          if (dateDoc.exists()) {
            const dateData = dateDoc.data() as any

            if (dateData.date) {
              date = dateData.date.toDate().toLocaleDateString("cs-CZ")
            }
          }

        } catch (error) {
          console.error(error)
        }

        return {
          id: docSnap.id,
          ...booking,
          date
        }

      })

    )

    // seskupení podle data
    const grouped: any = {}

    bookings.forEach((booking) => {

      if (!grouped[booking.date]) {
        grouped[booking.date] = []
      }

      grouped[booking.date].push(booking)

    })

    setGroupedBookings(grouped)
    setLoading(false)

  }

  useEffect(() => {
    loadBookings()
  }, [])

  if (loading) {
    return <p>Loading bookings...</p>
  }

  return (

    <div className="space-y-10">

      {Object.entries(groupedBookings).map(([date, bookings]: any) => (

        <div key={date} className="border rounded-lg p-6">

          <h2 className="text-xl font-bold mb-4">
            {date}
          </h2>

          <table className="w-full text-left border-collapse">

            <thead>
              <tr className="border-b">
                <th className="py-2">Jméno</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {bookings.map((booking: any) => (

                <tr key={booking.id} className="border-b">

                  <td className="py-2">
                    {booking.firstName} {booking.lastName}
                  </td>

                  <td>
                    {booking.email}
                  </td>

                  <td>
                    {booking.status}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      ))}

    </div>

  )
}