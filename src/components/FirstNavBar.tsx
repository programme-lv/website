import Link from "next/link";
import JoyButton from "@mui/joy/Button";
import LogoWithText from "@/components/LogoWithText";

export default function FirstNavBar() {
    return (
        <nav className={"bg-white py-3"}>
            <div className={"container m-auto flex justify-between items-center gap-4"}>
                <LogoWithText/>
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