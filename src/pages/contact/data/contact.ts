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
  map: {
    image: "/images/contact/map.jpg",
  },
};
