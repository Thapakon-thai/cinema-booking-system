import { getMovies } from "./actions/booking";
import { MovieCard } from "@/components/MovieCard";
import { Ticket } from "lucide-react";

export const revalidate = 0; // Disable cache for demo purposes to see updates immediately

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    success?: string;
    raceCondition?: string;
    seats?: string;
    ticketId?: string;
  }>;
}) {
  const movies = await getMovies();
  const resolvedSearchParams = await searchParams;
  const isSuccess = resolvedSearchParams.success === "true";
  const isRaceCondition = resolvedSearchParams.raceCondition === "true";
  const bookedSeats = resolvedSearchParams.seats
    ? decodeURIComponent(resolvedSearchParams.seats)
    : "";
  const ticketId = resolvedSearchParams.ticketId || "Unknown";

  return (
    <main className="min-h-screen p-8 md:p-12 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900 to-slate-900 -z-10" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -z-10 animate-pulse" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col items-center justify-center text-center space-y-6 pt-12">
          <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-2xl glass-panel animate-float">
            <Ticket className="w-8 h-8 text-blue-400 mr-2" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              CineBook
            </h1>
          </div>

          <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-2xl">
            Experience the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
              Magic
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl">
            Book your tickets for the latest blockbusters with our premium
            seating experience.
          </p>
        </header>

        {isSuccess && !isRaceCondition && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-6 py-4 rounded-xl text-center backdrop-blur-md animate-in fade-in slide-in-from-top-4">
            Booking confirmed! You have successfully booked seats:{" "}
            <span className="font-bold text-white">{bookedSeats}</span> (Ticket
            ID: {ticketId}). Enjoy your movie!
          </div>
        )}

        {isSuccess && isRaceCondition && (
          <div className="bg-red-500/20 border-2 border-red-500 text-red-200 px-6 py-6 rounded-xl text-center backdrop-blur-md animate-in fade-in slide-in-from-top-4 shadow-[0_0_30px_rgba(239,68,68,0.4)]">
            <h3 className="text-2xl font-bold text-red-500 mb-2">
              🚨 RACE CONDITION DETECTED! 🚨
            </h3>
            <p className="text-lg">
              You booked seats{" "}
              <span className="font-bold text-white bg-red-900/50 px-2 py-1 rounded">
                {bookedSeats}
              </span>{" "}
              (Ticket ID: {ticketId}).
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {movies.map((movie: any) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {movies.length === 0 && (
          <div className="text-center text-slate-500 py-20">
            No movies showing specifically right now. Please seed the database.
          </div>
        )}
      </div>
    </main>
  );
}
