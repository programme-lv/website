import Link from "next/link";
import Image from "next/image";
import Logo from "../../public/proglv_logo_simple.png";
import Folder from "flat-color-icons/svg/folder.svg";
import FilingCabinet from "flat-color-icons/svg/filing_cabinet.svg";


type NavFrameProps = {
    children: any;
}

export default function NavFrame({children}: NavFrameProps){

    return (
        <div className={"flex h-screen bg-gray-100"}>
            <SideBar/>
            <div className="flex-1">
                <main>
                    {children}
                </main>
            </div>
        </div>
    )
}

type SideBarProps = {}

// TODO: the implementation of expanding sidebar was postponed to lack of time
function SideBar({}: SideBarProps){
    return (
        <div className={`inset-y-0 left-0 z-30 bg-blue-420 overflow-auto w-20 flex flex-col gap-12 py-2`}>
            <Link href={"/"} className={"w-full justify-center align-middle flex"}>
                <div className={"bg-white rounded-lg inline-flex p-1.5"}>
                    <Image src={Logo} alt={"programme.lv logo"} width={45}/>
                </div>
            </Link>

            <Link href={"/tasks"} className={"w-full justify-center align-middle flex"}>
                <Image src={Folder} alt={"folder icon that leads to tasks"} width={45}/>
            </Link>

            <Link href={"/submissions"} className={"w-full justify-center align-middle flex"}>
                <Image src={FilingCabinet} alt={"icon that leads to submissions"} width={45}/>
            </Link>

        </div>
    )
}