import { title, subtitle } from "@/components/primitives";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sākums",
};

export default function Home() {
  const primaryLinkClasses =
    "inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700";
  const secondaryLinkClasses =
    "inline-flex items-center justify-center rounded-full border border-default-300 px-5 py-2.5 text-sm font-medium text-default-800 transition-colors hover:bg-gray-50";

  return (
    <>
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
            className={primaryLinkClasses}
            href="/auth/register"
          >
            Reģistrēties
          </Link>
          <Link
            className={secondaryLinkClasses}
            href="/auth/login"
          >
            Ieiet portālā
          </Link>
        </div>

        <div className="mt-8 text-center">
          {/* <Snippet hideCopyButton hideSymbol variant="bordered" > */}
          <span
            className={
              "bg-gradient-to-br from-rose-400 to-orange-300 bg-clip-text text-transparent"
            }
          >
            programme.lv šobrīd tiek aktīvi izstrādāts
          </span>
          {/* </Snippet> */}
        </div>
      </section>
    </>
  );
}
