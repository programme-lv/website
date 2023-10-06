import Image from "next/image";
import Logo from ".//../../public/P_logo_simple.png"
import ReversedLogo from "@/../public/reverse_logo.png"
import Hills from "@/../public/hills.png"

export default function Home() {
    return (
        <>
            <nav className={"flex bg-white p-4 px-10 justify-between items-center gap-4"}>
                <div className={"flex justify-center items-center gap-4"}>
                    <Image src={ReversedLogo} alt={"Logo"} width={40}/>
                    <div className={"flex gap-2 items-baseline"}>
                        <span className={"text-2xl font-semibold"}>Programme.lv</span>
                        <span className={"font-light"}>( Alpha )</span>
                    </div>
                </div>
                <div>
                    <span
                        className={"p-2 px-4 font-medium border border-gray-420 border-solid rounded-lg"}>Pieslēgties</span>
                </div>
            </nav>
            <div className={"px-10 mt-5 flex justify-center"}>
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
                                Jauna <span className={"text-green-69 font-medium"}>Pasaule</span> informātikas un matemātikas
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
            </div>
        </>
    )
}
