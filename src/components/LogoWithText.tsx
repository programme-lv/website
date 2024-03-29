import Image from "next/image";
import Logo from "../../public/proglv_logo_simple.png";
import Link from "next/link";

export default function LogoWithText() {
    return (
        <Link href={'/'} style={{textDecoration: "none"}}>
            <div className={"flex justify-center items-center gap-4"}>
                <Image src={Logo} alt={"Logo"} width={40}/>
                <div className={"flex gap-2 items-baseline"}>
                    <span className={"text-2xl font-semibold text-logoblue-69"}>programme.lv</span>
                    <span className={"hidden sm:block text-logoblue-420"}>Alpha</span>
                </div>
            </div>
        </Link>
    )
}