import Image from "next/image";
import Footer from "@/components/Footer";
import FirstNavBar from "@/components/FirstNavBar";
import Hills from "@/../public/hills.png"
import LP_1 from "@/../public/land_page_1.png"
import LP_2 from "@/../public/land_page_2.png"
import LIO_logo from "@/../public/LIO_logo.png"
import PPS_logo from "@/../public/PPS_logo_transparent.png"
import NMS_logo from "@/../public/nms_logo.jpg"
import StartIT_logo from "@/../public/startIT_logo.png"

export default function Home() {
    return (
        <>
            <FirstNavBar/>
            <div className={"container m-auto mt-6"}>
                <Hero/>
            </div>
            <div className={"container m-auto mt-6"}>
                <StudentSection/>
            </div>
            <div className={"px-10 mt-5 flex justify-center"}>
                <div className={"w-full relative"}>
                    <div className={"grid-cols-2 flex justify-center items-center gap-5"}>
                        <div className={"bg-white p-5 rounded-lg flex flex-col gap-5 columns-1 w-1/2"}>
                            <div className={"font-semibold text-lg text-center"}>Skolotājiem un pasniedzējiem</div>
                            <ul className={"list-disc text-left text-base"}>
                                <li>Iespēja veidot savus uzdevumus</li>
                                <li>Iespēja grupēt lietotājus un sekot līdzī grupas aktivitātei</li>
                            </ul>
                        </div>
                        <Image src={LP_1} alt={"Programming student"} style={{
                            width: '25%',
                            height: 'auto',
                            maxHeight: '300px',
                            overflow: 'hidden',
                            objectFit: 'cover',
                        }} className={"rounded-lg transform scale-x-69 items-center justify-center"}/>
                    </div>
                </div>
            </div>
            <div className={"px-10 mt-5 flex justify-center bg-white p-8 rounded"}>
                <div className={"w-full relative"}>
                    <div className={"grid grid-cols-5 gap-5 flex items-center"}>
                        <div className={"text-lg font-semibold"}>Mūs atbalsta</div>
                        <Image src={LIO_logo} alt={"Latvijas Informātikas Olimpiāde"}
                               style={{
                                   width: 'auto',
                                   maxWidth: '100%',
                                   height: 'auto',
                                   maxHeight: '100px',
                               }}/>
                        <Image src={PPS_logo} alt={"Pirmā Programmēšanas Skola"}
                               style={{
                                   width: 'auto',
                                   maxWidth: '100%',
                                   height: 'auto',
                                   maxHeight: '100px',
                               }}/>
                        <Image src={NMS_logo} alt={"Latvijas Universitātes A. Liepas Neklātienes matemātikas skola"}
                               style={{
                                   width: 'auto',
                                   maxWidth: '100%',
                                   height: 'auto',
                                   maxHeight: '100px',
                               }}/>
                        <Image src={StartIT_logo} alt={"IT Izglītības fonds - start(it)"} style={{
                            width: 'auto',
                            maxWidth: '100%',
                            height: 'auto',
                            maxHeight: '100px',
                        }}/>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    )
}

function Hero() {
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
                    <div>
                            <span className={"bg-blue-69 text-white font-semibold text-xl p-2 px-12 rounded-lg"}>
                                Ieiet portālā
                            </span>
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

function StudentSection() {
    return (<div className={"flex"}>
        <Image src={LP_2} alt={"Programming student"} style={{
            width: "400px",
            height: "auto",
            overflow: 'hidden',
            objectFit: 'contain',
        }}/>

        <div className={"bg-white flex-grow p-6"}>
            <div className={"flex flex-col gap-5 justify-between h-full max-w-md m-auto"}>
                <h3 className={"font-semibold text-3xl text-center m-0"}>Skolēniem & Studentiem</h3>
                <ul className={"list-disc text-left text-2xl flex-grow flex flex-col justify-around"}>
                    <li>Apgūsti jaunas zināšanas!</li>
                    <li>Cīnies ar aizraujošiem uzdevumiem!</li>
                    <li>Seko līdzi savai izaugsmei!</li>
                </ul>
                <span className={"bg-green-69 text-white font-semibold text-base text-center p-2 px-4 rounded-lg"}>
                    Skatīt uzdevumus
                </span>
            </div>
        </div>
    </div>)
}