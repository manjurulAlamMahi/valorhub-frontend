import { useAuth } from "@/hooks/use-auth";
import { homePathFor } from "@/services/auth";
import { Link } from "react-router";

export default function CallToAction() {
  const { user, logout } = useAuth();

  return (
    <div className="bg-primary flex items-center space-x-2.5 rounded-xl p-1.5 max-md:w-fit">
      {user ? (
        <button
          type="button"
          onClick={() => void logout()}
          className="text-primary-foreground block h-8.5 w-24.25 p-1.5 text-sm leading-6 font-medium text-nowrap"
        >
          Log Out
        </button>
      ) : (
        <Link
          to="/join"
          className="text-primary-foreground block h-8.5 w-24.25 p-1.5 text-sm leading-6 font-medium text-nowrap"
        >
          Join as a Pro
        </Link>
      )}

      <Link
        to={user ? homePathFor(user) : "/login"}
        className="text-primary-foreground bg-accent flex h-8.5 w-24.25 items-center justify-center rounded-md text-center text-sm leading-6 font-medium text-nowrap"
      >
        {user ? "Dashboard" : "Log In"}
      </Link>
    </div>
  );
}
