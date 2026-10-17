import { cn } from "@/lib/utils";
import { Link } from "react-router";
import { findByService } from "../data/find-by-service";

export default function BrowByCategoryGrid() {
  return (
    <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {findByService.services.map((service) => (
        <Link
          key={service.slug}
          to={`/category/${service.slug}`}
          className={cn(
            "block overflow-hidden rounded-2xl bg-cover bg-center pt-28 transition-opacity hover:opacity-90",
          )}
          style={{ backgroundImage: `url(${service.image})` }}
        >
          <div className="bg-gradient-fade p-4">
            <h2 className="text-lg font-bold text-white">{service.title}</h2>
            <p className="text-xs leading-4 text-white">
              {service.description}
            </p>
            <p className="text-xs leading-4 font-semibold text-white">
              {service.active}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
