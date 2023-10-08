import Image from "next/image";
import Logo from "@/../public/P_logo_simple.png"

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
                <div>
                    <span
                        className={"p-2 px-4 font-medium border border-logoblue-69 border-solid rounded-lg text-logoblue-69"}>Pieslēgties</span>
                </div>
            </div>
        </nav>
    )
}