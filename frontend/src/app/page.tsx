// src/app/page.tsx
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold mb-4">Prioritize PM Platform</h1>
      <p className="text-xl text-gray-600 mb-8">
        <a href="/dashboard" className="text-blue-600 underline">Go to dashboard</a>
      </p>
      <p className="text-sm text-gray-500">
        (This is the public landing page – src/app/page.tsx)
      </p>
    </div>
  );
}