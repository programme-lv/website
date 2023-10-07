import Image from "next/image";
import FirstNavBar from "@/components/FirstNavBar";
import Footer from "@/components/Footer";
import Krisjanis_photo from "@/../public/team_photo/krisjanis.png"
import Veronika_photo from "@/../public/team_photo/veronika.png"
import Milana_photo from "@/../public/team_photo/milana.png"
import Raivis_photo from "@/../public/team_photo/raivis.png"

export default function About() {
    return (
        <>
            <FirstNavBar/>
            <div className={"flex justify-center p-5"}>
                <div className={"w-3/4 bg-white rounded p-5"}>
                    <h2 className={"text-logoblue-69 font-semibold"}>Par projektu</h2>
                    <section>
                        <p>
                            <span className={"text-logoblue-69 font-semibold"}>Programme.lv </span>
                            ir jauna programmēšanas apguves platforma ar mērķi darīt Latviju par programmēšanas
                            lielvalsti. :)
                        </p>
                        <p>
                            Platforma palīdzēs skolēniem un studentiem apgūt programmēšanu,
                            nodrošinot tās lietotājus ar bāgātību teorijas klāstu, kā arī risināmiem uzdevumiem dažādos
                            līmeņus.
                            <span className={"text-logoblue-69 font-semibold"}> Programme.lv</span> arī nodrošina iespēju
                            pasniedzējiem veidot savus uzdevumus,
                            sekot līdzi grupas aktivitātei un piemeklēt tēmai atbilstošus programmēšanas uzdevumus.
                        </p>
                        <p>
                            <span className={"text-logoblue-69 font-semibold"}>Programme.lv</span> pirmkods ir
                            pieejams <a
                            href="https://github.com/orgs/programme-lv/repositories"
                            className={"text-logoblue-420"}>github.com/orgs/programme-lv</a> ar
                            GPLv3 licenci.
                        </p>
                    </section>
                    <h2 className={"text-logoblue-69 font-semibold"}>Iecerētā funkcionalitāte</h2>
                    <ul className={"list-disc"}>
                        <li>Automātiska risinājumu testēšana ar reāllaika atgriezenisko saiti;</li>
                        <li>Modernu programmēšanas valodu atbalsts;</li>
                        <li>Integrēta programmēšanas vide ar zemu latentumu;</li>
                        <li>Iespēja iegūt daļēju punktu skaitu par risinājumu;</li>
                        <li>Latvijas informātiaks olimpiādes udevumu arhīvs;</li>
                        <li>NP, kā arī interaktīvo un citu uzdevumu veidu atbalsts;</li>
                        <li>Iespēja veidot savus uzdevumus un dalīties ar time;</li>
                        <li>Iespēja skatīt citu cilvēku risinājumus pēc uzd. atrisināšanas;</li>
                        <li>Uzdevumu filtrēšana pēc avota, nepieciešamajām zināšanām;</li>
                        <li>Augošs klāsts ar algoritmu, datu struktūru un matemātikas teoriju;</li>
                    </ul>
                    <h2 className={"text-logoblue-69 font-semibold"}>Mūsu komanda</h2>
                    <div className={"grid grid-cols-4 "}>
                        <div className={"columns-1 flex-col justify-center"}>
                            <div className={"flex justify-center"}>
                            <Image src={Krisjanis_photo} alt={"Krišjānis Petručeņa"} className={"rounded-full"} style={{
                                width: "auto",
                                height: "auto",
                                maxWidth: "100px",
                                objectPosition: "center"
                            }}/>
                            </div>
                            <div className={"text-center p-3"}>Krišjānis Petručeņa</div>
                        </div>
                        <div className={"grid-cols-1 justify-center"}>
                            <div className={"flex justify-center"}>
                            <Image src={Veronika_photo} alt={"Veronika Lohmanova"} className={"rounded-full"} style={{
                                width: "auto",
                                height: "auto",
                                maxWidth: "100px",
                            }}/>
                            </div>
                            <div className={"text-center p-3"}>Veronika Lohmanova</div>
                        </div>
                        <div className={"grid-cols-1 justify-center"}>
                            <div className={"flex justify-center"}>
                            <Image src={Milana_photo} alt={"Milana Timoņina"} className={"rounded-full"} style={{
                                width: "auto",
                                height: "auto",
                                maxWidth: "100px",
                            }}/>
                            </div>
                            <div className={"text-center p-3"}>Milana Timoņina</div>
                        </div>
                        <div className={"grid-cols-1 justify-center"}>
                            <div className={"flex justify-center"}>
                            <Image src={Raivis_photo} alt={"Raivis Ieviņš"} className={"rounded-full"} style={{
                                width: "auto",
                                height: "auto",
                                maxWidth: "100px",
                            }}/>
                            </div>
                            <div className={"text-center p-3"}>Raivis Ieviņš</div>
                        </div>
                    </div>

                </div>
            </div>
            <Footer/>
        </>
    )
}