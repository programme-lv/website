import Link from "next/link";
import Image from "next/image";
import Logo from "../../public/proglv_logo_simple.png";
import Folder from "flat-color-icons/svg/folder.svg";
import FilingCabinet from "flat-color-icons/svg/filing_cabinet.svg";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import { Typography } from "@mui/joy";
import { useUser } from "@/contexts/UserContext";
import React, { useState } from "react";
import Winter from "@/../public/winter.png";


type NavFrameProps = {
    path: { name: string, link: string }[];
    children: any;
    active?: "tasks" | "submissions";
}

export default function NavFrame({ path, children, active }: NavFrameProps) {
    const { userData, loginError } = useUser();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className={"flex h-screen bg-gray-100"}>
            <SideBar active={active} />
            <div className={"w-full h-full overflow-auto flex flex-col"}>
                <nav className={"bg-white h-14 min-h-[3.5rem] flex items-center justify-between px-6 pe-10"}>
                    <button type="button" onClick={()=>setMobileMenuOpen(!mobileMenuOpen)} className="sm:hidden cursor-pointer px-1 pt-1 bg-blue-420 text-white rounded-md border-opacity-70 hover:bg-blue-69 transition-colors ease-in-out border-none" >
                        <MenuSVG />
                    </button>
                    <div className={"hidden sm:block"}>
                        <Breadcrumbs>
                            {path.slice(0, -1).map(({ name, link }) => (
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
                <div className={`${mobileMenuOpen?"hidden sm:block":""} w-full pb-8 flex-grow bg-fixed bg-no-repeat bg-cover`} style={{ backgroundImage: `url(${Winter.src})` }}>
                    {children}
                </div>
                <div className={`${mobileMenuOpen?"block sm:hidden":"hidden"}`}>
                    <MobileMenu />
                </div>
            </div>
        </div>
    )
}

function MenuSVG() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 48 48"><path fill="white" d="M6 22h36v4H6zm0-12h36v4H6zm0 24h36v4H6z" /></svg>
    )
}

type SideBarProps = {
    active?: "tasks" | "submissions";
}

// TODO: the implementation of expanding sidebar was postponed to lack of time
function SideBar({ active }: SideBarProps) {
    return (
        <div className={`inset-y-0 left-0 z-30 bg-blue-420 overflow-auto w-20 flex-col gap-12 py-2 hidden sm:flex`}>
            <Link href={"/"} className={"w-full justify-center align-middle flex"}>
                <div className={"bg-white rounded-lg inline-flex p-1.5"}>
                    <Image src={Logo} alt={"programme.lv logo"} width={45} />
                </div>
            </Link>

            <Link href={"/tasks"} className={"w-full justify-center align-middle flex"}>
                <div className={`hover:bg-gray-69 transition-all rounded-lg inline-flex p-1.5 ${active === "tasks" ? 'outline outline-white' : ''}`}>
                    <Image src={Folder} alt={"folder icon that leads to tasks"} width={45} />
                </div>
            </Link>

            <Link href={"/submissions"} className={"w-full justify-center align-middle flex"}>
                <div className={`hover:bg-gray-69 transition-all rounded-lg inline-flex p-1.5 ${active === "submissions" ? 'outline outline-white' : ''}`}>
                    <Image src={FilingCabinet} alt={"icon that leads to submissions"} width={45} />
                </div>
            </Link>

        </div>
    )
}


function MobileMenu() {
    let active = "i am tired";
    return (
        <div className={`flex flex-col gap-12 w-[12em] m-auto mt-6`}>
            <Link href={"/"} className={"w-full no-underline flex justify-center align-middle bg-white h-12 p-2 rounded-md hover:shadow-sm"}>
                <div className={"flex gap-4 items-center w-full justify-center"}>
                    <Image src={Logo} alt={"programme.lv logo"} width={45} />
                    <span className="text-black w-1/2">programme.lv</span>
                </div>
            </Link>

            <Link href={"/tasks"} className={"w-full no-underline flex justify-center align-middle bg-white h-12 p-2 hover:shadow-sm"}>
                <div className={`flex gap-4 items-center w-full justify-center ${active === "tasks" ? '' : ''}`}>
                    <Image src={Folder} alt={"folder icon that leads to tasks"} width={45} />
                    <span className="text-black w-1/2">uzdevumi</span>
                </div>
            </Link>

            <Link href={"/submissions"} className={"w-full no-underline flex justify-center align-middle bg-white h-12 p-2 hover:shadow-sm"}>
                <div className={`flex gap-4 items-center w-full justify-center ${active === "submissions" ? '' : ''}`}>
                    <Image src={FilingCabinet} alt={"icon that leads to submissions"} width={45} />
                    <span className="text-black w-[6em]">iesūtījumi</span>
                </div>
            </Link>

        </div>
    )
}