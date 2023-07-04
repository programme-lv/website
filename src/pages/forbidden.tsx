import NavigationBar from '@/components/NavigationBar';

export default function Forbidden() {
    return (<>
    <NavigationBar />
    <main className="container m-auto">
        <div className="text-center">
            <h1 className="text-9xl font-medium">403</h1>
            <h2 className="text-3xl font-medium text-red-500">Aizliegts</h2>
            <h3 className="text-xl font-medium">Jums nav atļaujas skatīt šo lapu.</h3>
            </div>
        </main>
    </>)
}
