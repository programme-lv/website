import { Metadata } from "next";

import Layout from "@/components/layout";

export const metadata: Metadata = {
	title: "Interaktīvie uzdevumi",
};

const flushExamples: [string, string, string?][] = [
	["C++", "std::cout << x << std::endl;", "std::endl nodrošina sinhronizāciju"],
	["Go", "fmt.Println(x)", "standarta izvade nav īpaši jāsinhronizē"],
	["Java", "System.out.println(x); System.out.flush();"],
	["Pascal", "writeln(x); flush(output);"],
	["Python", "print(x, flush=True)"],
];

function Content() {
	return (
		<div className="mx-auto flex w-full max-w-[75ch] flex-col gap-3 py-4 leading-relaxed">
			<h1 className="text-xl font-semibold">Darbs ar interaktīvajiem uzdevumiem</h1>

			<p>
				Interaktīvajos uzdevumos risinājums darbības laikā sazinās ar vērtēšanas
				sistēmu. Atšķirībā no parastajiem uzdevumiem, kuros risinājums nolasa
				ievaddatus un izvada atbildi vienā piegājienā, šeit risinājums un sistēma
				apmainās ar vairākām ziņām, līdz tiek atrasta atbilde vai risinājums tiek
				noraidīts.
			</p>

			<h2 className="mt-2 text-base font-semibold">Kā notiek saziņa</h2>
			<ul className="flex list-disc flex-col gap-1 pl-5">
				<li>
					Risinājums lasa sistēmas ziņas no standarta ievades plūsmas (
					<code className="rounded bg-gray-100 px-1">stdin</code>), bet savus
					vaicājumus raksta uz standarta izvades plūsmu (
					<code className="rounded bg-gray-100 px-1">stdout</code>).
				</li>
				<li>
					Precīzais ziņu formāts un secība ir aprakstīta uzdevuma sadaļā
					&quot;Komunikācija&quot; — tā ir jāievēro burtiski.
				</li>
				<li>
					Sarunu var uzsākt gan sistēma, gan risinājums; to nosaka konkrētais
					uzdevums.
				</li>
				<li>
					Kad sistēma apstiprina atbildi (piemēram, atbildot ar{" "}
					<code className="rounded bg-gray-100 px-1">0</code>), risinājumam ir
					jābeidz darbība. Sistēma neatbildēs uz tālākiem vaicājumiem.
				</li>
				<li>
					Uzdevuma lapas sadaļā &quot;Piemēri&quot; ir redzams saziņas piemērs —
					tur vari apskatīt, kā izskatās konkrētā uzdevuma ziņu apmaiņa.
				</li>
			</ul>

			<h2 className="mt-2 text-base font-semibold">Izvades sinhronizācija</h2>
			<p>
				Pēc katra vaicājuma izvades plūsma ir jāsinhronizē (jāiztīra jeb{" "}
				<em>flush</em>). Pretējā gadījumā sistēma var nesaņemt vaicājumu, un
				risinājums var iestrēgt, gaidot atbildi, kas nekad nepienāks.
			</p>

			<div className="overflow-x-auto">
				<table className="w-full text-left text-sm">
					<thead>
						<tr className="border-b border-divider">
							<th className="py-1 pr-4 font-semibold">Valoda</th>
							<th className="py-1 font-semibold">Piemērs</th>
						</tr>
					</thead>
					<tbody>
						{flushExamples.map(([language, example, note]) => (
							<tr
								key={language}
								className="border-b border-divider/60 align-top last:border-0"
							>
								<td className="whitespace-nowrap py-1 pr-4">{language}</td>
								<td className="py-1">
									<code className="rounded bg-gray-100 px-1">{example}</code>
									{note && <> — {note}</>}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<h2 className="mt-2 text-base font-semibold">
				Vaicājumu ierobežojumi un statusi
			</h2>
			<ul className="flex list-disc flex-col gap-1 pl-5">
				<li>
					Katram interaktīvajam uzdevumam ir noteikts maksimālais vaicājumu
					skaits vienā testā. Ja tas tiek pārsniegts, testa statuss pēc
					pārbaudes būs &quot;Nepareiza atbilde&quot;.
				</li>
				<li>
					Risinājumam joprojām ir spēkā uzdevumā norādītie laika un atmiņas
					ierobežojumi, un tie attiecas uz visu saziņas laiku.
				</li>
				<li>
					Ja saziņa ieilgst (piemēram, risinājums un sistēma gaida viens otru),
					risinājums tiek pārtraukts.
				</li>
				<li>
					Kļūdas ziņas vari rakstīt uz kļūdu plūsmu (
					<code className="rounded bg-gray-100 px-1">stderr</code>) —
					interaktīvajos uzdevumos tās tiek ignorētas un ir domātas atkļūdošanai.
				</li>
			</ul>
		</div>
	);
}

export default function InteractiveTaskHelpPage() {
	return (
		<Layout active="help" background="white" readingWidth>
			<Content />
		</Layout>
	);
}
