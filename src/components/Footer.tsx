import Image from "next/image";
import Discord_logo from "@/../public/links_icons/discord.svg"
import Instagram_logo from "@/../public/links_icons/instagram.svg"
import Linkendin_logo from "@/../public/links_icons/linkedin.svg"
import Git_logo from "@/../public/links_icons/git.svg"
import GitHub_logo from "@/../public/links_icons/github.svg"

export default function Footer() {
    return (
        <>
            <div className={"items-center bg-logoblue-69 p-3"}>
                <div className={"flex justify-between flex-wrap items-center container m-auto"}>
                    <div className={"flex gap-6"}>
                        <a href={"https://discord.gg/eV6tArk2Xe"} target={"_blank"}>
                            <Image src={Discord_logo} alt={"Join our Discord server!"}/>
                        </a>
                        <a href={"https://www.instagram.com/programme.lv/"} target={"_blank"}>
                            <Image src={Instagram_logo} alt={"Follow us on Instagram!"}/>
                        </a>
                        <a href={"https://youtu.be/dQw4w9WgXcQ?si=UoCMO0GOa-H37AI2"} target={"_blank"}>
                            <Image src={Linkendin_logo} alt={"Join our team via Linkendin!"}/>
                        </a>
                    </div>
                    <span className={"flex justify-center"}>
                    <a href={"mailto:info@programme.lv"} className={"text-white p-1"}
                       style={{textDecoration: "none"}}>
                        info@programme.lv
                    </a>
                    {/*    <a href={"/about"} className={"text-white p-1"} style={{textDecoration: "none"}}>*/}
                    {/*    | par mums*/}
                    {/*</a>*/}
                    </span>

                    <span className={"flex justify-end"}>
                        <a href={"https://git-scm.com"} target={"_blank"} className={"p-3"}>
                            <Image src={Git_logo} alt={"Git"}/>
                        </a>
                        <a href={"https://github.com/programme-lv/"} target={"_blank"} className={"p-3"}>
                            <Image src={GitHub_logo} alt={"Our GitHub repo"}/>
                        </a>
                    </span>
                </div>

            </div>
        </>
    )
}