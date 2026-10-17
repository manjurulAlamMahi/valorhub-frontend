// src/components/shared/root-layout.tsx
import { Outlet, ScrollRestoration } from "react-router";
import Footer from "./footer";
import Header from "./header";

export default function RootLayout() {
  return (
    <>
      <Header />
      <ScrollRestoration />
      <Outlet />
      <Footer />
    </>
  );
}
