import { Link } from "react-router";
import { useMediaQuery } from "usehooks-ts";
import CallToAction from "./call-to-action";
import Container from "./container";
import MobileMenu from "./mobile-menu";
import NavBar from "./nav-bar";

export default function Header() {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <header className="bg-background sticky top-0 z-50 w-full">
      <Container className="sm:py-5 md:py-5 lg:py-5">
        <div className="flex items-center justify-between">
          <Link to="/" aria-label="ValorHub home">
            <img
              src="/images/logo.png"
              className="h-8 w-32 object-contain md:h-10 md:w-43.25 lg:h-[61.893px] lg:w-[273.837px]"
            />
          </Link>

          <p className="text-secondary-foreground text-center font-medium tracking-[2.56px] max-lg:hidden md:text-xs xl:text-base">
            They Served Their Country. Now, They're Here To Serve You.
          </p>

          {isMobile ? <MobileMenu /> : <CallToAction />}
        </div>
      </Container>
      <NavBar />
    </header>
  );
}
