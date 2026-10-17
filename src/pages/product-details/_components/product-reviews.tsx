import Container from "@/components/shared/container";
import Section from "@/components/shared/section";
import { productDetails } from "../data/product-details";

const { reviews } = productDetails;

export default function ProductReviews() {
  return (
    <Section className="bg-input">
      <Container className="space-y-4 py-10! xl:max-w-310">
        <h2 className="text-lg leading-[normal] font-bold text-[#1e293b]">
          {reviews.title}
        </h2>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.items.map((review) => (
            <li
              key={review.id}
              className="flex min-h-28.75 flex-col justify-between gap-2.5 rounded-xl border border-[#e6eaf2] bg-white p-4.5 leading-[normal]"
            >
              <div className="space-y-2">
                <div
                  className="flex gap-1"
                  role="img"
                  aria-label={`Rated ${review.rating} out of 5`}
                >
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <img
                      key={index}
                      src="/svgs/star-fill.svg"
                      alt=""
                      className="size-[14.333px] object-contain"
                    />
                  ))}
                </div>
                <p className="text-[13px] text-[#64748b]">{review.text}</p>
              </div>
              <p className="text-xs font-medium text-[#1e293b]">
                {review.author}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
