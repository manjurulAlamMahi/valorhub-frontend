export type ContactFormValues = {
  full_name: string;
  email: string;
  subject: string;
  message: string;
};

export const initialValues: ContactFormValues = {
  full_name: "",
  email: "",
  subject: "",
  message: "",
};

export const contact = {
  title: "Get in touch",
  description: "Questions about ValorHub? Our support team is here to help.",
  form: {
    title: "Send us a message",
    submit: "Send message",
    submitting: "Sending...",
    success:
      "Your message has been sent successfully. Our support team will get back to you shortly.",
    fields: {
      full_name: { label: "Full name", placeholder: "Sarah Johnson", max: 255 },
      email: {
        label: "Email address",
        placeholder: "sarah.j@email.com",
        max: 255,
      },
      subject: { label: "Subject", placeholder: "How can we help?", max: 255 },
      message: {
        label: "Message",
        placeholder: "Tell us more about your question or issue...",
        max: 5000,
      },
    },
  },
  details: [
    {
      label: "Email",
      value: "support@valorhub.com",
      href: "mailto:support@valorhub.com",
    },
    { label: "Phone", value: "(800) 555-0199", href: "tel:+18005550199" },
    { label: "Address", value: "1200 Liberty Way, Dallas, TX 75201" },
    { label: "Support hours", value: "Mon–Sat 7am–7pm CST" },
  ],
  map: {
    image: "/images/contact/map.jpg",
    label: "Dallas, TX",
    href: "https://www.google.com/maps/search/?api=1&query=1200+Liberty+Way,+Dallas,+TX+75201",
  },
};
