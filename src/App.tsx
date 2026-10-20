import { createBrowserRouter, RouterProvider } from "react-router";
import { GuestOnly, RequireAuth } from "./components/auth/route-guards";
import RootLayout from "./components/shared/root-layout";
import ForgotPassword from "./pages/auth/forgot-password";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import ResetPassword from "./pages/auth/reset-password";
import BrowseProducts from "./pages/browse-products";
import Category from "./pages/category";
import Contact from "./pages/contact";
import DashboardOverview from "./pages/dashboard";
import DashboardLayout from "./pages/dashboard/_components/dashboard-layout";
import Inbox from "./pages/dashboard/inbox";
import InvoiceDetails from "./pages/dashboard/invoice-details";
import Invoices from "./pages/dashboard/invoices";
import Notifications from "./pages/dashboard/notifications";
import Payments from "./pages/dashboard/payments";
import QuoteDetails from "./pages/dashboard/quote-details";
import Quotes from "./pages/dashboard/quotes";
import MyRequests from "./pages/dashboard/requests";
import Reviews from "./pages/dashboard/reviews";
import SavedContractors from "./pages/dashboard/saved";
import Settings from "./pages/dashboard/settings";
import Faq from "./pages/faq";
import GivingBack from "./pages/giving-back";
import NominateVeteran from "./pages/giving-back/nominate";
import ContractorList from "./pages/contractor-list";
import ContractorDashboard from "./pages/contractor-dashboard";
import ComingSoon from "./pages/contractor-dashboard/_components/coming-soon";
import ContractorLayout from "./pages/contractor-dashboard/_components/contractor-layout";
import ContractorBanner from "./pages/contractor-dashboard/banner";
import ContractorBusinessProfile from "./pages/contractor-dashboard/business-profile";
import ContractorGallery from "./pages/contractor-dashboard/gallery";
import ContractorInvoices from "./pages/contractor-dashboard/invoices";
import ContractorMessages from "./pages/contractor-dashboard/messages";
import ContractorInvoiceDetails from "./pages/contractor-dashboard/invoice-details";
import NewInvoice from "./pages/contractor-dashboard/new-invoice";
import ContractorProducts from "./pages/contractor-dashboard/products";
import ContractorProjects from "./pages/contractor-dashboard/projects";
import MyServices from "./pages/contractor-dashboard/services";
import ContractorSubscription from "./pages/contractor-dashboard/subscription";
import ContractorReviews from "./pages/contractor-dashboard/reviews";
import ContractorSettings from "./pages/contractor-dashboard/settings";
import ContractorWebsite from "./pages/contractor-dashboard/website";
import QuoteRequests from "./pages/contractor-dashboard/quotes";
import ContractorProfile from "./pages/contractor-profile";
import Home from "./pages/home";
import Join from "./pages/join";
import OnboardingLayout from "./pages/join/_components/onboarding-layout";
import Marketplace from "./pages/marketplace";
import ProductDetails from "./pages/product-details";
import RequestQuote from "./pages/request-quote";
import { NotFound } from "./pages/NotFound";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/category", element: <Category /> },
      { path: "/category/:id", element: <ContractorList /> },
      { path: "/contractors", element: <ContractorList /> },
      { path: "/contractors/:id", element: <ContractorProfile /> },
      { path: "/marketplace", element: <Marketplace /> },
      { path: "/marketplace/products", element: <BrowseProducts /> },
      { path: "/marketplace/products/:id", element: <ProductDetails /> },
      { path: "/giving-back", element: <GivingBack /> },
      { path: "/giving-back/nominate", element: <NominateVeteran /> },
      { path: "/faq", element: <Faq /> },
      { path: "/contact", element: <Contact /> },
      { path: "/request-quote", element: <RequestQuote /> },
      {
        path: "/dashboard",
        element: (
          <RequireAuth role="customer">
            <DashboardLayout />
          </RequireAuth>
        ),
        children: [
          { index: true, element: <DashboardOverview /> },
          { path: "requests", element: <MyRequests /> },
          { path: "quotes", element: <Quotes /> },
          { path: "quotes/:id", element: <QuoteDetails /> },
          { path: "invoices", element: <Invoices /> },
          { path: "invoices/:id", element: <InvoiceDetails /> },
          { path: "payments", element: <Payments /> },
          { path: "saved", element: <SavedContractors /> },
          { path: "reviews", element: <Reviews /> },
          { path: "inbox", element: <Inbox /> },
          { path: "notifications", element: <Notifications /> },
          { path: "settings", element: <Settings /> },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    element: <OnboardingLayout />,
    children: [
      { path: "/join", element: <Join /> },
      {
        path: "/login",
        element: (
          <GuestOnly>
            <Login />
          </GuestOnly>
        ),
      },
      {
        path: "/register",
        element: (
          <GuestOnly>
            <Register />
          </GuestOnly>
        ),
      },
      {
        path: "/forgot-password",
        element: (
          <GuestOnly>
            <ForgotPassword />
          </GuestOnly>
        ),
      },
      // Not guarded: a signed-in user may still follow an emailed reset link
      { path: "/reset-password", element: <ResetPassword /> },
    ],
  },
  {
    path: "/contractor/dashboard",
    element: (
      <RequireAuth role="business">
        <ContractorLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <ContractorDashboard /> },
      { path: "quotes", element: <QuoteRequests /> },
      { path: "projects", element: <ContractorProjects /> },
      { path: "messages", element: <ContractorMessages /> },
      { path: "invoices", element: <ContractorInvoices /> },
      { path: "invoices/new", element: <NewInvoice /> },
      { path: "invoices/:id", element: <ContractorInvoiceDetails /> },
      { path: "invoices/:id/edit", element: <NewInvoice /> },
      { path: "services", element: <MyServices /> },
      { path: "products", element: <ContractorProducts /> },
      { path: "gallery", element: <ContractorGallery /> },
      { path: "banner", element: <ContractorBanner /> },
      { path: "website", element: <ContractorWebsite /> },
      { path: "profile", element: <ContractorBusinessProfile /> },
      { path: "reviews", element: <ContractorReviews /> },
      { path: "subscription", element: <ContractorSubscription /> },
      { path: "settings", element: <ContractorSettings /> },
      { path: "*", element: <ComingSoon /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
