import NavigationBar from '@/components/NavigationBar'
import { useState } from 'react'
import { useRouter } from 'next/router'

type View = 'description' | 'testing' | 'metadata'

export default function EditTask() {
    const router = useRouter()

    const [openedView, setOpenedView] =
        useState<View>('description');


    return (
        <>
            <NavigationBar active='tasks' />
            <main className="container m-auto">
                <h1 className="text-xl font-normal">Uzdevuma
                    <code className="mx-2">{router.query['edit-task-id']}</code>
                    rediģēšana</h1>
                <div className="flex justify-between gap-2">
                    <div className="flex-grow max-w-[10em]">
                        <ActionList openedView={openedView} setOpenedView={setOpenedView} />
                    </div>
                    <div className="flex-grow">
                        <TaskEditView view={openedView} />
                    </div>
                </div>
            </main>
        </>
    )
}

function ActionList(props: { openedView: View, setOpenedView: (view: View) => void }) {
    return (
        <nav className="flex flex-col gap-2 border border-solid border-gray-200 p-2">
            <ActionListButton
                isActive={props.openedView === 'description'}
                onClick={() => props.setOpenedView('description')}>
                Apraksts
            </ActionListButton>
            <ActionListButton
                isActive={props.openedView === 'testing'}
                onClick={() => props.setOpenedView('testing')}>
                Testēšana
            </ActionListButton>
            <ActionListButton
                isActive={props.openedView === 'metadata'}
                onClick={() => props.setOpenedView('metadata')}>
                Metadati
            </ActionListButton>
        </nav>
    )
}

function ActionListButton(props: { isActive: boolean, onClick: () => void, children: any }) {
    return (
        <button type='button'
            className="bg-transparent border-none cursor-pointer hover:bg-gray-69 rounded-lg p-2 text-left"
            onClick={props.onClick}>
            {(!props.isActive) && props.children}
            {(props.isActive) && <span className="text-blue-69">{props.children}</span>}
        </button>
    )
}


function TaskEditView(props: { view: View }) {
    switch (props.view) {
        case 'description':
            return <DescriptionView />
        case 'testing':
            return <TestingView />
        case 'metadata':
            return <MetadataView />
    }
}

/*
 * apraksts
 * testēšana
 * metadati
 * publicēšana
*/

function DescriptionView() {
    return (<>description</>)
}

function TestingView() {
    return (<>testing</>)
}

function MetadataView() {
    return (<>metadata</>)
}



