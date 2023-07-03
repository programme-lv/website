import NavigationBar from "@/components/NavigationBar"

export default function ViewTask() {
    return (
        <>
            <NavigationBar active="tasks" />
            <main className='p-5'>
                <h1>view/[id].tsx</h1>
            </main>
        </>
    )
}
