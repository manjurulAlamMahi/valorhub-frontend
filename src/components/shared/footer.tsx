import { Link } from "react-router";
import { footer } from "@/data/footer";
import Container from "./container";

export default function Footer() {
  return (
    <footer className="bg-white">
      <Container className="pt-15! pb-5!">
        <div className="grid gap-6 pb-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <div className="mb-6 max-w-xs space-y-6 max-sm:col-span-2">
            <Link to="/" aria-label="ValorHub home" className="block w-fit">
              <img
                src={footer.logo}
                alt="ValorHub"
                className="h-20.5 w-31.5 object-contain"
              />
            </Link>
            <p className="text-xs leading-5 text-black/60">
              {footer.description}
            </p>
          </div>

          {footer.footerLinks.map((column) => (
            <div key={column.title} className="space-y-2">
              <h3 className="text-lg font-bold text-black">{column.title}</h3>
              <ul className="space-y-4">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.link}
                      className="text-sm text-black/60 hover:text-blue-500"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-black/10 py-6 text-center text-sm text-black/60 sm:flex sm:items-center sm:justify-between">
          <p>{footer.copyright}</p>
          <ul className="flex space-x-4 max-sm:mt-4 max-sm:justify-center">
            {footer.socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black/60 hover:text-blue-500"
                >
                  <img src={link.icon} alt={link.label} className="size-5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
