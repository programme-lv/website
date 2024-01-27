'use client';
import { Welcome } from '../components/Welcome/Welcome';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import Link from 'next/link';

export default function HomePage() {
	return (
		<>
			<Welcome />
			<Link href="/dashboard">
				hello
			</Link>
			<ColorSchemeToggle />
		</>
	);
}

/*
programme.lv
[Pieslēgties] [Reģistrēties]

Jauna Pasaule informātikas un matemātikas cienītājiem!
[Ieiet portālā]

Šobrīd strādājam pie:
- kvalitatīvi uzdevumi
- automātiska novērtēšana
- integrēts redaktors
- uzdevumu veidošana

Nākotnē ceram uz:
- interaktīva teorija
- uzlabota meklēšana
- regulāras sacensības
- lietotāju grupēšana

Atbalstot atvērtā koda garu,
Programme.lv pirmkods ir brīvi pieejams vietnē
github.com/orgs/programme-lv ar GPLv3 licenci.

Šī iniciatīva atspoguļo mūsu apņemšanos veicināt sadarbību
ar visiem topošajiem programmēšanas interesentiem.

Projekta draugi:
- Latvijas Informātikas olimpiāde
- Pirmā Programmēšanas skola
- Neklātienes matemātikas skola
- Start(IT) izglītības fonds

PRO versija:
- palīdzība no ekspertiem
- neierobežoti atrisinājumi
- nerindotu uzdevumu izveide
- piekļuve PRO kursiem

Mūsu komanda
- Krišjānis Petručeņa
- Veronika Lohmanova
- Raivis Ieviņš

Paldies Jānim Gruzim par ieguldījumu projekta attīstībā.

Sociālie mēdiji:
- discord
- instagram

Kontakti:
- info@programme.lv
*/