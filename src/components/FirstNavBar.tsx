import Image from "next/image";
import Logo from "@/../public/P_logo_simple.png"
import Link from "next/link";
import JoyButton from "@mui/joy/Button";

export default function FirstNavBar() {
    return (
        <nav className={"bg-white py-3"}>
            <div className={"container m-auto flex justify-between items-center gap-4"}>
                <div className={"flex justify-center items-center gap-4"}>
                    <a href={'/'} style={{textDecoration: "none"}}>
                        <Image src={Logo} alt={"Logo"} width={40}/>
                    </a>
                    <div className={"flex gap-2 items-baseline"}>
                        <span className={"text-2xl font-semibold text-logoblue-69"}>Programme.lv</span>
                        <span className={"text-logoblue-420"}>Alpha</span>
                    </div>

                </div>
                <div className={"flex gap-4 items-center"}>
                    <Link href={"/login"} className={"no-underline text-black hover:text-gray-420"}>Pieslēgties</Link>
                    <Link href={"/register"} className={""}>
                        <JoyButton color={"neutral"} variant={"outlined"} className={"text-md px-6"}>Reģistrēties</JoyButton>
                    </Link>
                </div>
            </div>
        </nav>
    )
}