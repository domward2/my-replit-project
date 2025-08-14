export default function HomePage() {
	return (
		<main className="p-6">
			<h1 className="text-2xl font-semibold">Dashboard</h1>
			<p className="mt-2 text-gray-600">Welcome. Navigate to the DEX to start swapping.</p>
			<a className="text-blue-600 underline mt-4 inline-block" href="/dex">Go to DEX</a>
		</main>
	)
}