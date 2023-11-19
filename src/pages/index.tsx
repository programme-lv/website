import Image from "next/image";
import Footer from "@/components/Footer";
import FirstNavBar from "@/components/FirstNavBar";
import Hills from "@/../public/hills.png"
import LP_1 from "@/../public/land_page_1.png"
import LIO_logo from "@/../public/LIO_logo.png"
import PPS_logo from "@/../public/PPS_logo_transparent.png"
import NMS_logo from "@/../public/nms_logo.jpg"
import StartIT_logo from "@/../public/startIT_logo.png"
import JoyButton from "@mui/joy/Button";
import Link from "next/link";
import {useUser} from "@/contexts/UserContext";
import React from "react";

export default function Home() {
    const {userData, loginError} = useUser();
    const loggedIn = userData && !loginError;

    return (
        <>
            <FirstNavBar/>
            <div className={"container m-auto mt-6 rounded-lg"}>
                <Hero loggedIn={loggedIn}/>
            </div>

            <div className={"container m-auto mt-6 bg-white p-2 text-lg"}>
                <InfoSection/>
            </div>

            <div className={"my-6"}>
                <div className={"container m-auto bg-white"}>
                    <div className={"flex justify-between p-6"}>
                        <Link href={"https://lio.lv"}>
                            <Image src={LIO_logo} alt={"Latvijas Informātikas Olimpiāde"}
                                   style={{
                                       width: 'auto',
                                       maxWidth: '100%',
                                       height: 'auto',
                                       maxHeight: '100px',
                                   }}/></Link>
                        <Link href={"https://pps.lv"}>
                            <Image src={PPS_logo} alt={"Pirmā Programmēšanas Skola"}
                                   style={{
                                       width: 'auto',
                                       maxWidth: '100%',
                                       height: 'auto',
                                       maxHeight: '100px',
                                   }}/>
                        </Link>
                        <Link href={"https://nms.lu.lv"}>
                            <Image src={NMS_logo} alt={"Latvijas Universitātes A. Liepas Neklātienes matemātikas skola"}
                                   style={{
                                       width: 'auto',
                                       maxWidth: '100%',
                                       height: 'auto',
                                       maxHeight: '100px',
                                   }}/>
                        </Link>
                        <Link href={"https://startit.lv"}>
                            <Image src={StartIT_logo} alt={"IT Izglītības fonds - start(it)"} style={{
                                width: 'auto',
                                maxWidth: '100%',
                                height: 'auto',
                                maxHeight: '100px',
                            }}/>
                        </Link>
                    </div>
                </div>
            </div>
            <div className={"mt-6"}>
                <Footer/>
            </div>
        </>
    )
}

function Hero(props: { loggedIn?: boolean }) {
    let link = "/login"
    if (props.loggedIn) {
        link = "/tasks"
    }
    return (<div className={"flex justify-center"}>
        <div className={"w-full relative"}>
            <Image src={Hills} alt={"Hills - background image"} style={{
                width: '100%',
                height: 'auto',
                maxHeight: '600px',
                overflow: 'hidden',
                objectFit: 'cover'
            }}/>
            <div className={"absolute w-full h-full flex justify-around items-center top-0"}>
                <div className={"bg-white p-10 rounded-lg text-3xl text-center flex flex-col gap-5"}>
                    <div className={"max-w-[14em]"}>
                        Jauna <span className={"text-green-69 font-medium"}>Pasaule</span> informātikas un
                        matemātikas
                        cienītājiem
                    </div>
                    <div className={"flex justify-center"}>
                        <Link href={link} className={""}>
                            <JoyButton color={"primary"}
                                       className={"text-xl px-12 font-medium bg-blue-700 hover:bg-blue-600"}>Ieiet
                                portālā</JoyButton>
                        </Link>
                    </div>
                </div>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </div>)
}

function InfoSection() {
    return (
        <div className={"bg-white flex gap-4"}>
            <div className={"flex-grow"}>
                <Image src={LP_1} alt={"Programming student"} style={{
                    width: "400px",
                    height: "auto",
                    overflow: 'hidden',
                    objectFit: 'contain',
                }}/>
            </div>
            <div className={"px-6 pe-8 flex flex-col justify-between pb-4"}>
                <div className={"m-0 text-justify"}>
                    <p className="mb-2">
                        Šī mājaslapa ir izstrādāta, lai palīdzētu skolēniem un studentiem apgūt kodēšanas mākslu. Tā
                        piedāvās bagātīgu teorētisko materiālu klāstu, kā arī dažādu prasmju līmeņiem piemērotus
                        praktiskos programmēšanas uzdevumus.
                    </p>
                    <p className="mb-2">
                        Turklāt, Programme.lv dod iespēju skolotājiem izveidot pielāgotus uzdevumus, sekot līdzi grupas
                        aktivitātēm un atrast programmēšanas izaicinājumus, kas atbilst viņu mācību mērķiem. Nu, t.i.,
                        dos. Šobrīd mājaslapa tiek aktīvi izstrādāta.
                    </p>
                    <p className="mb-4">
                        Atbalstot atvērtā koda garu, Programme.lv pirmkods ir brīvi pieejams vietnē <a
                        href={"https://github.com/orgs/programme-lv"}
                        className={"text-blue-69"}>github.com/orgs/programme-lv</a> ar GPLv3 licenci. Šī iniciatīva
                        atspoguļo mūsu apņemšanos veicināt sadarbības un iekļaujošu mācību vidi visiem Latvijā
                        topošajiem programmētājiem. Pievienojieties mūsu ceļojumam, lai paaugstinātu Latvijas statusu
                        globālajā programmēšanas kopienā! 😊
                    </p>
                    <p className={"mb-4"}>
                        Mūsu komanda: Krišjānis Petručeņa; Veronika Lohmanova; Raivis Ieviņš; Milana Timoņina.
                    </p>
                </div>
                <div className={"flex gap-4 justify-end"}>
                    <Link href={"/tasks"}
                          className={"no-underline bg-green-600 hover:bg-green-500 transition-all duration-75 text-white p-1.5 px-3 rounded-lg"}>Skatīt
                        Uzdevumus</Link>
                </div>
            </div>
        </div>
    )
}