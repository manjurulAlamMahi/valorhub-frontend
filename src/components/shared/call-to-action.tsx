import { Link } from "react-router";

export default function CallToAction() {
  return (
    <div className="bg-primary flex items-center space-x-2.5 rounded-xl p-1.5 max-md:w-fit">
      <Link
        to="/join"
        className="text-primary-foreground block h-8.5 w-24.25 p-1.5 text-sm leading-6 font-medium text-nowrap"
      >
        Join as a Pro
      </Link>

      <Link
        to="/dashboard"
        className="text-primary-foreground bg-accent flex h-8.5 w-24.25 items-center justify-center rounded-md text-center text-sm leading-6 font-medium text-nowrap"
      >
        Log In
      </Link>
    </div>
  );
}
