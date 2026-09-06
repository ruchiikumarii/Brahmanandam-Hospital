import { Suspense, lazy, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { BackToTop } from "@/components/layout/BackToTop";
import { AppointmentProvider } from "@/lib/appointment-context";
import { useScrollReveal } from "@/lib/use-scroll-reveal";

/* The landing page ships in the main bundle; the rest load on demand. */
import HomePage from "@/pages/Home";

const AboutPage = lazy(() => import("@/pages/About"));
const DoctorsPage = lazy(() => import("@/pages/Doctors"));
const DoctorProfilePage = lazy(() => import("@/pages/DoctorProfile"));
const DepartmentsPage = lazy(() => import("@/pages/Departments"));
const DepartmentDetailPage = lazy(() => import("@/pages/DepartmentDetail"));
const ServicesPage = lazy(() => import("@/pages/Services"));
const FacilitiesPage = lazy(() => import("@/pages/Facilities"));
const InsurancePage = lazy(() => import("@/pages/Insurance"));
const AppointmentPage = lazy(() => import("@/pages/Appointment"));
const ConfirmationPage = lazy(() => import("@/pages/AppointmentConfirmation"));
const ContactPage = lazy(() => import("@/pages/Contact"));
const BlogPage = lazy(() => import("@/pages/Blog"));
const BlogArticlePage = lazy(() => import("@/pages/BlogArticle"));
const PrivacyPolicyPage = lazy(() => import("@/pages/PrivacyPolicy"));
const TermsPage = lazy(() => import("@/pages/Terms"));
const PatientCharterPage = lazy(() => import("@/pages/PatientCharter"));
const ChairmansMessagePage = lazy(() => import("@/pages/ChairmansMessage"));
const CeoMessagePage = lazy(() => import("@/pages/CeoMessage"));
const LeadershipPage = lazy(() => import("@/pages/Leadership"));
const MissionVisionValuesPage = lazy(() => import("@/pages/MissionVisionValues"));
const QualityAndSafetyPage = lazy(() => import("@/pages/QualityAndSafety"));
const AdmissionProcessPage = lazy(() => import("@/pages/AdmissionProcess"));
const DischargeProcessPage = lazy(() => import("@/pages/DischargeProcess"));
const VisitorGuidelinesPage = lazy(() => import("@/pages/VisitorGuidelines"));
const PatientRightsPage = lazy(() => import("@/pages/PatientRights"));
const PatientServicesPage = lazy(() => import("@/pages/PatientServices"));
const CareersPage = lazy(() => import("@/pages/Careers"));
const CsrPage = lazy(() => import("@/pages/Csr"));
const FaqPage = lazy(() => import("@/pages/Faq"));
const GalleryPage = lazy(() => import("@/pages/Gallery"));
const HealthPackagesPage = lazy(() => import("@/pages/HealthPackages"));
const NotFoundPage = lazy(() => import("@/pages/NotFound"));

/** Keeps the header/footer in place while a route chunk streams in. */
function RouteFallback() {
  return (
    <div className="shell flex min-h-[60vh] items-center justify-center py-24">
      <span className="flex items-center gap-3 text-[0.9375rem] font-semibold text-muted">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
        Loading…
      </span>
    </div>
  );
}

/** Restores the scroll position on navigation, honouring in-page anchors. */
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, hash]);

  return null;
}

export default function App() {
  useScrollReveal();

  return (
    <AppointmentProvider>
      <ScrollToTop />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>

      <Header />

      <main id="main" className="pb-[3.75rem] xl:pb-0">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            {/* legacy slug from the previous site */}
            <Route path="/about-us" element={<AboutPage />} />
            <Route path="/chairmans-message" element={<ChairmansMessagePage />} />
            <Route path="/ceo-message" element={<CeoMessagePage />} />
            <Route path="/leadership" element={<LeadershipPage />} />
            <Route path="/our-directors" element={<LeadershipPage />} />
            <Route
              path="/mission-vision-values"
              element={<MissionVisionValuesPage />}
            />
            <Route
              path="/mission-vision-and-values"
              element={<MissionVisionValuesPage />}
            />
            <Route path="/quality-and-safety" element={<QualityAndSafetyPage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/doctors/:slug" element={<DoctorProfilePage />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/departments/:slug" element={<DepartmentDetailPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/facilities" element={<FacilitiesPage />} />
            <Route path="/insurance" element={<InsurancePage />} />
            <Route path="/tpa-insurance" element={<InsurancePage />} />
            <Route path="/patient-services" element={<PatientServicesPage />} />
            <Route path="/admission-process" element={<AdmissionProcessPage />} />
            <Route path="/discharge-process" element={<DischargeProcessPage />} />
            <Route path="/visitor-guidelines" element={<VisitorGuidelinesPage />} />
            <Route
              path="/guidelines-for-visitors"
              element={<VisitorGuidelinesPage />}
            />
            <Route path="/patient-rights" element={<PatientRightsPage />} />
            <Route
              path="/patient-and-attendant-rights"
              element={<PatientRightsPage />}
            />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/career" element={<CareersPage />} />
            <Route path="/csr" element={<CsrPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/health-packages" element={<HealthPackagesPage />} />
            <Route path="/appointment" element={<AppointmentPage />} />
            <Route
              path="/appointment/confirmation"
              element={<ConfirmationPage />}
            />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogArticlePage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/patient-charter" element={<PatientCharterPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
      <BackToTop />
      <MobileTabBar />
    </AppointmentProvider>
  );
}
