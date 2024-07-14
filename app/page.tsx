import { Link } from "@nextui-org/link";
import { button as buttonStyles } from "@nextui-org/theme";

import { title, subtitle } from "@/components/primitives";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <>
    <Navbar/>
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-4xl text-center justify-center">
        <h1 className={title()}>Apgūsti </h1>
        <h1 className={title({ color: "blue" })}>programmēšanu</h1>
        <h1 className={title()}> interaktīvi!</h1>
        <br />
        <h2 className={subtitle({ class: "mt-4" })}>
          Lasi teoriju, pildi uzdevumus un saņem atsauksmes.
        </h2>
      </div>

      <div className="flex gap-3">
        <Link
        // isDisabled
          // isExternal
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
          href="/auth/register"
          // href={siteConfig.links.docs}
        >
          Reģistrēties
        </Link>
        <Link
        // isDisabled
          // isExternal
          className={buttonStyles({ variant: "bordered", radius: "full" })}
          // href={siteConfig.links.github}
          href="/auth/login"
        >
          {/* <GithubIcon size={20} /> */}
          Ieiet portālā
        </Link>
      </div>

      <div className="mt-8 text-center">
        {/* <Snippet hideCopyButton hideSymbol variant="bordered" > */}
          <span className={"bg-gradient-to-br from-rose-400 to-orange-300 bg-clip-text text-transparent"}>
            programme.lv šobrīd tiek aktīvi izstrādāts
          </span>
        {/* </Snippet> */}
      </div>
    </section></>
  );
}
