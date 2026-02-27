import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, Ticket } from "lucide-react";
import { Movie } from "@prisma/client";
import { cn } from "@/lib/utils";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link
      href={`/movie/${movie.id}`}
      className="group block glass-panel overflow-hidden hover:scale-[1.02] transition-transform duration-300"
    >
      <div className="relative h-96 w-full">
        <Image
          src={movie.image}
          alt={movie.title}
          fill
          priority
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />

        <div className="absolute bottom-0 left-0 p-6 w-full">
          <h2 className="text-2xl font-bold text-white mb-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            {movie.title}
          </h2>

          <div className="flex items-center gap-4 text-slate-300 text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>{movie.showTime.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-pink-400" />
              <span>
                {movie.showTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
            <span className="text-lg font-bold text-white">${movie.price}</span>
            <span className="glass-btn px-4 py-2 text-sm font-medium flex items-center gap-2">
              Book Seats <Ticket className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
