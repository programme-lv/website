import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarBrand,
} from "@nextui-org/navbar";
import NextLink from "next/link";

import LogoWhite from "@/public/logo_white.png";
import Logo from "@/public/logo.png";

import Image from "next/image";

export const Navbar = () => {

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Image src={Logo} alt="programme.lv logo" height={26}/>
            <span className="px-0.5"/>
            <p className="font-bold text-inherit">programme.lv</p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

    </NextUINavbar>
  );
};
