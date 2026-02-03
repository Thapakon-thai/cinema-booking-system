'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Ticket, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { bookSeats } from '@/app/actions/booking'

interface SeatGridProps {
  rows?: number
  cols?: number
  bookedSeats: string[]
  movieId: number
  price: number
  movieTitle: string
}

export function SeatGrid({ 
  rows = 8, 
  cols = 8, 
  bookedSeats, 
  movieId, 
  price,
  movieTitle 
}: SeatGridProps) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [isBooking, setIsBooking] = useState(false)
  
  const toggleSeat = (seatId: string) => {
    if (bookedSeats.includes(seatId)) return
    
    setSelectedSeats(prev => 
      prev.includes(seatId) 
        ? prev.filter(id => id !== seatId)
        : [...prev, seatId]
    )
  }

  const handleBooking = async () => {
    if (selectedSeats.length === 0) return
    setIsBooking(true)
    try {
      await bookSeats(movieId, selectedSeats)
    } catch (error) {
      console.error(error)
      setIsBooking(false)
    }
  }

  const generateSeats = () => {
    const seats = []
    const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

    for (let r = 0; r < rows; r++) {
      for (let c = 1; c <= cols; c++) {
        const id = `${rowLabels[r]}${c}`
        const isBooked = bookedSeats.includes(id)
        const isSelected = selectedSeats.includes(id)

        seats.push(
          <button
            key={id}
            onClick={() => toggleSeat(id)}
            disabled={isBooked || isBooking}
            className={cn(
              "w-8 h-8 sm:w-10 sm:h-10 m-1 rounded-t-lg transition-all duration-300 relative flex items-center justify-center text-xs font-bold shadow-lg",
              isBooked 
                ? "bg-slate-700/50 cursor-not-allowed text-slate-500 border border-slate-700" 
                : isSelected
                  ? "bg-blue-500 text-white shadow-blue-500/50 scale-110 z-10"
                  : "bg-white/10 hover:bg-white/20 hover:scale-105 text-slate-300 border border-white/5"
            )}
          >
            {isBooked ? <User className="w-4 h-4" /> : isSelected ? <Check className="w-4 h-4" /> : id}
          </button>
        )
      }
    }
    return seats
  }

  const totalPrice = selectedSeats.length * price

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto glass-panel p-8">
      {/* Screen */}
      <div className="w-full max-w-2xl mb-12 relative">
        <div className="h-2 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent w-full rounded-full screen-glow" />
        <div className="h-16 bg-gradient-to-b from-blue-500/10 to-transparent w-full transform -perspective-1000 rotate-x-12 origin-top" />
        <p className="text-center text-slate-500 text-sm mt-4 uppercase tracking-widest">Screen</p>
      </div>

      {/* Seats */}
      <div className="grid grid-cols-8 gap-1 md:gap-2 mb-12 p-4 bg-slate-900/50 rounded-2xl border border-white/5">
        {generateSeats()}
      </div>

      {/* Legend */}
      <div className="flex gap-6 mb-8 text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white/10 rounded" /> Available
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded" /> Selected
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-slate-700/50 rounded" /> Occupied
        </div>
      </div>

      {/* Summary */}
      <div className="w-full bg-slate-900/50 p-6 rounded-xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
           <h3 className="text-xl font-bold text-white mb-1">{movieTitle}</h3>
           <p className="text-slate-400">
             {selectedSeats.length} seat(s) selected: <span className="text-blue-400">{selectedSeats.join(', ')}</span>
           </p>
        </div>
        
        <div className="flex items-center gap-6">
           <div className="text-right">
             <p className="text-sm text-slate-400">Total Price</p>
             <p className="text-2xl font-bold text-white">${totalPrice.toFixed(2)}</p>
           </div>
           
           <button
             onClick={handleBooking}
             disabled={selectedSeats.length === 0 || isBooking}
             className={cn(
               "glass-btn px-8 py-3 font-bold flex items-center gap-2 text-white",
               selectedSeats.length > 0 
                  ? "bg-blue-600 hover:bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/20" 
                  : "opacity-50 cursor-not-allowed"
             )}
           >
             {isBooking ? 'Booking...' : 'Confirm Booking'} <Ticket className="w-5 h-5" />
           </button>
        </div>
      </div>
    </div>
  )
}
