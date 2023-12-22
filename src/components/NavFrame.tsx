import Link from "next/link";
import Image from "next/image";
import Logo from "../../public/proglv_logo_simple.png";
import Folder from "flat-color-icons/svg/folder.svg";
import FilingCabinet from "flat-color-icons/svg/filing_cabinet.svg";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import {Typography} from "@mui/joy";
import {useUser} from "@/contexts/UserContext";
import React from "react";
import { url } from "inspector";
import Winter from "@/../public/winter.png";


type NavFrameProps = {
    path: {name: string, link: string}[];
    children: any;
    active?: "tasks" | "submissions";
}

export default function NavFrame({path, children, active}: NavFrameProps){
    const { userData, loginError } = useUser();

    return (
        <div className={"flex h-screen bg-gray-100"}>
            <SideBar active={active}/>
            <div className={"w-full h-full overflow-auto flex flex-col"}>
                <nav className={"bg-white h-14 flex items-center justify-end sm:justify-between px-6 pe-10"}>
                    <div className={"hidden sm:block"}>
                    <Breadcrumbs>
                        {path.slice(0,-1).map(({name, link})=>(
                            <Link key={name} color="neutral" href={link} className={"no-underline"}>
                                <Typography className={"hover:underline"}>{name}</Typography>
                            </Link>
                        ))}
                        <Link href={path.slice(-1)[0].link} className={"no-underline"}>
                            <Typography fontWeight={""} className={"text-black font-bold hover:underline"}>{path.slice(-1)[0].name}</Typography>
                        </Link>
                    </Breadcrumbs>
                        </div>
                    {userData && !loginError ? (
                            <div className="flex items-center">
                                <Link href="/profile" className={"no-underline text-blue-69 font-medium"}>
                                    {userData.username}
                                </Link>
                            </div>
                        ) : (
                        <div className={"flex gap-4 items-center"}>
                            <Link href={"/login"} className={"no-underline bg-green-600 hover:bg-green-500 transition-all duration-75 text-white p-1.5 px-3 rounded-lg"}>Pieslēgties</Link>
                        </div>)}
                </nav>
                <div className={"w-full pb-8 flex-grow bg-fixed bg-no-repeat bg-cover"} style={{backgroundImage:`url(${Winter.src})`}}>
                    {children}
                </div>
            </div>
        </div>
    )
}

type SideBarProps = {
    active?: "tasks" | "submissions";
}

// TODO: the implementation of expanding sidebar was postponed to lack of time
function SideBar({active}: SideBarProps){
    return (
        <div className={`inset-y-0 left-0 z-30 bg-blue-420 overflow-auto w-20 flex flex-col gap-12 py-2`}>
            <Link href={"/"} className={"w-full justify-center align-middle flex"}>
                <div className={"bg-white rounded-lg inline-flex p-1.5"}>
                    <Image src={Logo} alt={"programme.lv logo"} width={45}/>
                </div>
            </Link>

            <Link href={"/tasks"} className={"w-full justify-center align-middle flex"}>
                <div className={`hover:bg-gray-69 transition-all rounded-lg inline-flex p-1.5 ${active==="tasks" ? 'outline outline-white' : ''}`}>
                <Image src={Folder} alt={"folder icon that leads to tasks"} width={45}/>
                </div>
            </Link>

            <Link href={"/submissions"} className={"w-full justify-center align-middle flex"}>
                <div className={`hover:bg-gray-69 transition-all rounded-lg inline-flex p-1.5 ${active==="submissions" ? 'outline outline-white' : ''}`}>
                    <Image src={FilingCabinet} alt={"icon that leads to submissions"} width={45}/>
                </div>
            </Link>

        </div>
    )
}