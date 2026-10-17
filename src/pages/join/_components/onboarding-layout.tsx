import Footer from "@/components/shared/footer";
import { Link, Outlet, ScrollRestoration } from "react-router";

// Signup runs without the site navigation so contractors stay in the flow
export default function OnboardingLayout() {
  return (
    <>
      <header className="flex h-20 items-center justify-center border-b border-black/8 bg-white md:h-25.5">
        <Link to="/" aria-label="ValorHub home">
          <img
            src="/images/logo.png"
            alt="ValorHub"
            className="h-10 w-44 object-contain md:h-[61.893px] md:w-[273.837px]"
          />
        </Link>
      </header>
      <ScrollRestoration />
      <Outlet />
      <Footer />
    </>
  );
}
