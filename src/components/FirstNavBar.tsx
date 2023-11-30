import Link from "next/link";
import JoyButton from "@mui/joy/Button";
import LogoWithText from "@/components/LogoWithText";

export default function FirstNavBar() {
    return (
        <nav className={"bg-white py-3 px-2"}>
            <div className={"container m-auto flex justify-between items-center gap-4"}>
                <LogoWithText />
                <div className={"sm:flex gap-4 items-center hidden"}>
                    <Link href={"/login"} className={"no-underline text-black hover:text-gray-420"}>
                        <JoyButton className={"text-sm px-3 bg-logoblue-69 hover:bg-logoblue-420 font-normal"} size={"sm"}>Pieslēgties</JoyButton>
                    </Link>
                    <Link href={"/register"} className={""}>
                        <JoyButton className={"text-sm px-3 bg-green-69 hover:bg-green-420 font-normal"} size={"sm"}>Reģistrēties</JoyButton>
                    </Link>
                </div>
            </div>
        </nav>
    )
}