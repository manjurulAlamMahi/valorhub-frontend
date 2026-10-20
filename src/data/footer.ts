export const footer = {
  logo: "/images/footer-logo.png",
  description:
    "Connecting America with trusted veteran-owned professionals. home service needs.",
  footerLinks: [
    {
      title: "Quick Links",
      links: [
        {
          label: "Home",
          link: "/",
        },
        {
          label: "Services",
          link: "/category",
        },
        {
          label: "Marketplace",
          link: "/marketplace",
        },
        {
          label: "About",
          link: "/giving-back",
        },
      ],
    },
    {
      title: "Categories",
      // Categories come from the API, so the footer links to the directory pages
      links: [
        {
          label: "All Categories",
          link: "/category",
        },
        {
          label: "Find a Pro",
          link: "/contractors",
        },
        {
          label: "Request a Quote",
          link: "/request-quote",
        },
      ],
    },

    {
      title: "Support",
      links: [
        {
          label: "FAQ",
          link: "/faq",
        },
        {
          label: "Contact",
          link: "/contact",
        },
        {
          label: "Help Center",
          link: "/faq",
        },
        {
          label: "Giving Back",
          link: "/giving-back",
        },
      ],
    },
    {
      title: "Legal",
      links: [
        {
          label: "Privacy Policy",
          link: "/faq",
        },
        {
          label: "Terms of Service",
          link: "/faq",
        },
      ],
    },
  ],
  copyright: `© ${new Date().getFullYear()} ValorHub. All rights reserved.`,
  socialLinks: [
    {
      label: "Facebook",
      link: "https://www.facebook.com/",
      icon: "/images/social/facebook.png",
    },
    {
      label: "Twitter",
      link: "https://x.com/",
      icon: "/images/social/twitter.png",
    },
    {
      label: "Instagram",
      link: "https://www.instagram.com/",
      icon: "/images/social/instagram.png",
    },
    {
      label: "LinkedIn",
      link: "https://www.linkedin.com/",
      icon: "/images/social/linkedin.png",
    },
  ],
};
