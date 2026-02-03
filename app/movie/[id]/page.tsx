import { getMovie } from '@/app/actions/booking'
import { SeatGrid } from '@/components/SeatGrid'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const revalidate = 0

export default async function BookingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const modalId = parseInt(id)
  if (isNaN(modalId)) notFound()

  const movie = await getMovie(modalId)
  if (!movie) notFound()

  // Flatten booked seats from all bookings for this movie
  const bookedSeats = movie.bookings.flatMap((b: any) => b.seats.split(','))

  return (
    <main className="min-h-screen p-6 md:p-12 relative overflow-hidden bg-[#0f172a]">
       <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-900 to-slate-900 -z-10" />
       
       <div className="max-w-6xl mx-auto">
         <Link 
           href="/" 
           className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors group"
         >
           <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Movies
         </Link>

         <SeatGrid 
           bookedSeats={bookedSeats} 
           movieId={movie.id} 
           price={movie.price}
           movieTitle={movie.title}
         />
       </div>
    </main>
  )
}
