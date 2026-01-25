import Layout from "@/components/layout";
import styles from "./about.module.css";
import { TextLink } from "@/components/text-link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Par mums",
};

function Content() {
	return (
		<>
			<br />
			<h2 className="text-3xl font-medium font-mono">PROGRAMME.LV</h2>
			<br />

			<p className={styles.p}>
				Programme.lv ir tiešsaistes sistēma programmēšanas uzdevumu risināšanai.
				Mūsu mērķis ir sniegt iespēju
				skolēniem un studentiem risināt kvalitatīvus, interesantus uzdevumus,
				kā arī atbalstīt augsti godājamos skolotājus un pasniedzējus.
			</p>
			<br />
			<h3 className={styles.h3}>Mūsu mērķi 🎯</h3>
			<ul className={styles.ul}>
				<li>Samazināt barjeras iesācējiem, spiežot pirmos taustiņus programmēšanā</li>
				<li>Arhivēt, uzturēt un publicēt olimpiāžu uzdevumus</li>
				<li>Atbalstīt skolotājus ar rīkiem uzdevumu veidošanai un meklēšanai</li>
				<li>Veicināt kopienu, organizējot konkursus un pasākumus</li>
			</ul>
			<br />
			<h3 className={styles.h3}>Iecerētās funkcijas 💡</h3>
			<ul className={styles.ul}>
				<li>Atbalsts populārākajām programmēšanas valodām</li>
				<li>Daļēji pareizu risinājumu atbalsts ar apakšuzdevumiem</li>
				<li>Rīki savu uzdevumu veidošanai pasniedzējiem</li>
				<li>Mācību stundas tēmai atbilstošu uzdevumu meklēšana</li>
				<li>Iebūvēts koda redaktors tepat pārlūkprogrammā</li>
			</ul>
			<br />
			<h3 className={styles.h3}>Vēsture 📜</h3>
			<ol className={styles.ol}>
				<li>2001. gadā LIIS (Latvijas Izglītības Informatizācijas Sistēma) ietvaros tapa risinājumu pārbaudes serveris <TextLink href="http://olimps.lio.lv/" target="_blank">olimps.lv</TextLink>!</li>
				<li>2014. gadā Jānis Gruzis izstrādāja <TextLink href="https://clevercode.lv" target="_blank">CleverCode.lv</TextLink> kā bakalaura darbu un to aktīvi uzturēja līdz ~2021. gadam</li>
				<li>2018. gadā programme.lv autors atklāja CleverCode.lv, un patstāvīgi aizrāvās ar programmēšanas uzdevumiem</li>
				{/* <li>2022. gadā autors Krišjānis Petručeņa, strādājot kā skolotājs, saskārās ar grūtībām atrast uzdevumus, ko uzdot skolēniem</li> */}
				<li>2022. gadā autors Krišjānis Petručeņa kopā ar Veroniku Lohmanovu, un Raivi Ieviņu sāka veidot programme.lv</li>
				<li>2025. gadā Krišjānis to prezentēja kā savu kvalifikācijas darbu Latvijas Universitātē, un turpina pie tā strādāt</li>
			</ol>
			<br />
			<h3 className={styles.h3}>Paldies 🎖️</h3>
			<ul className={styles.ul}>
				<li>Jānim Gruzim par CleverCode.lv izveidi un uzturēšanu. Tīmekļa vietne ir bijis milzīgs ieguvums visai Latvijai</li>
				<li>Raivim Ieviņam, <TextLink href="https://pps.lv" target="_blank">PPS</TextLink> direktoram, un Veronikai Lohmanovai par iedvesmošanu, atbalstu un idejām</li>
				<li>Mārtiņam Opmanim par aktīvu Latvijas Informātikas olimpiādēs (<TextLink href="https://lio.lv" target="_blank">LIO</TextLink>) organizēšanu un atļauju publicēt uzdevumus</li>
				<li>Elīzai Bergai par uzdevumu ilustrāciju gleznošanu dzīvīgākai lietotājpieredzei. Tās (gandrīz visas) nav &quot;ģenerētas&quot;</li>
			</ul>
			<br />
			<h3 className={styles.h3}>Saziņa ✉️</h3>
			<p className={styles.p}>
				Ja jums ir jautājumi vai ieteikumi, lūdzu rakstīt.
				Esmu atvērts jaunām idejām un sadarbībai. 🙂
				<br />
				Epasts: krisjanispetrucena at džī mail punkts com
			</p>
			<br />
			<h3 className={styles.h3}>Ieteiktās saites 📚</h3>
			<p className={styles.p}>
				<TextLink href="https://clevercode.lv" target="_blank">clevercode.lv</TextLink>{" | "}
				<TextLink href="https://lio.lv/" target="_blank">lio.lv</TextLink>{" | "}
				<TextLink href="https://codeforces.com/" target="_blank">codeforces.com</TextLink>{" | "}
				<TextLink href="https://usaco.guide/" target="_blank">usaco.guide</TextLink>{" | "}
				<TextLink href="https://www.hackerrank.com/" target="_blank">hackerrank.com</TextLink>{" | "}
				<TextLink href="https://www.nms.lu.lv/" target="_blank">nms.lu.lv</TextLink>{" | "}
				<TextLink href="https://cp-algorithms.com/index.html" target="_blank">cp-algorithms.com</TextLink>
			</p>
			<br />

		</>
	);
}
export default function AboutPage() {
	return (
		<Layout
			active="about"
			breadcrumbs={[
				{ label: "Par mums", href: "/about" }
			]}
		>
			<div className="min-h-screen absolute top-0 left-0 pointer-events-none md:pl-16 w-full pt-14 flex">
				<div className="bg-white flex-grow">
					<div className="max-w-4xl lg:mx-auto py-2 md:mx-2">
						<div className="rounded-sm px-4 pointer-events-auto">
							<Content />
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
} 