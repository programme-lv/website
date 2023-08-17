import Logo from '../../public/logo.png'
import Image from 'next/image'
export default function Home() {
  return (
    <>
      <main className="text-justify container m-auto py-12 text-xl font-sans">
        <Image src={Logo} alt="Programme.lv logo" />
        <h2>Par projektu</h2>
        <section>
          <p>
            Programme.lv ir jauna programmēšanas apguves platforma ar mērķi darīt Latviju par programmēšanas lielvalsti.
          </p>
          <p>
            Platforma palīdzēs skolēniem un studentiem apgūt programmēšanu,
            nodrošinot tās lietotājus ar bāgātību teorijas klāstu, kā arī risināmiem uzdevumiem dažādos līmeņus.
            Programme.lv arī nodrošina iespēju pasniedzējiem veidot savus uzdevumus,
            sekot līdzi grupas aktivitātei un piemeklēt tēmai atbilstošus programmēšanas uzdevumus.
          </p>
          <p>
            Diemžēl projekts joprojām ir izstrādes fāzē. Jaunais plānotais publiskās versijas izlaiduma laiks ir oktobra beigas.
          </p>
          <p>
            Programme.lv pirmkods ir pieejams <a href="https://github.com/orgs/programme-lv/repositories">github.com/orgs/programme-lv</a> ar GPLv3 licenci.
          </p>
        </section>
        <h2>Iecerētā funkcionalitāte</h2>
        <ul>
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
        <h2>Mūsu komanda</h2>
        <ul>
          <li>Krišjānis Petručeņa</li>
          <li>Veronika Lohmanova</li>
          <li>Milana Timoņina</li>
          <li>Raivis Ieviņš</li>
        </ul>
        <h2>Kontakti</h2>
        <p>
          Sazinies ar mums rakstot uz <a href="mailto:programme.lv@gmail.com">programme.lv@gmail.com</a> vai pievienojoties mūsu <a href="https://discord.gg/7rMcjFde">Discord</a>.
        </p>
      </main>
    </>
  )
}
