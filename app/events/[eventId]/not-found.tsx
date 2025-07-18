import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Event Not Found</h2>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
        Sorry, we couldn&apos;t find the event you&apos;re looking for.
      </p>
      <Link
        href="/events"
        className="px-6 py-3 bg-[#0066FF] text-white font-medium rounded-lg hover:bg-[#0055DD] transition-colors"
      >
        View All Events
      </Link>
    </div>
  );
}
