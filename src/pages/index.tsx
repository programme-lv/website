import NavigationBar from '@/components/NavigationBar'

export default function Home() {
	return (
		<>
			<NavigationBar active='index'/>
			<main className="container m-auto">
				<h1>Programme.lv</h1>
			</main>
		</>
	)
}
