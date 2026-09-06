export const site = {
  name: "Brahmanandam Hospital",
  legalName: "Brahmanandam Hospital, Sonari",
  tagline: "Multi Specialty Centre Sonari",
  phone: "8271827999",
  phoneDisplay: "+91 82718 27999",
  phoneHref: "tel:+918271827999",
  whatsapp: "https://wa.me/918271827999",
  email: "care@sonari.brahmanandamhospital.in",
  emailAlt: "info@sonari.brahmanandamhospital.in",
  careersEmail: "care@brahmanandamhospital.com",
  address: {
    line1: "184, Near Road No. 3, Kagal Nagar",
    line2: "Sonari, Jamshedpur, Jharkhand - 831011",
    full: "184, Near Road No. 3, Kagal Nagar, Sonari, Jamshedpur, Jharkhand - 831011",
  },
  /* Verified from the hospital's own Google Business listing. */
  google: {
    name: "Brahmanandam Hospital Sonari | Best Multi speciality Health Care",
    cid: "7692677784331814544",
    lat: 22.8234999,
    lng: 86.1667012,
    /** Opens the listing (reviews tab included). */
    listingUrl: "https://www.google.com/maps?cid=7692677784331814544",
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=22.8234999,86.1667012&destination_place_id=ChIJsc8lM7Xl9TkRkAaj8q_hwWo",
    embedUrl:
      "https://www.google.com/maps?q=22.8234999,86.1667012&z=17&hl=en&output=embed",
    /**
     * Rating and reviews are intentionally empty: they must be copied from the
     * live Google Business Profile (or pulled from the Places API) rather than
     * guessed. The review section hides itself until these are filled in.
     */
    rating: null as number | null,
    reviewCount: null as number | null,
    /** Quoted reviews — paste real ones from the listing to show them here. */
    reviews: [] as { name: string; rating: number; when: string; text: string }[],
  },
  mapsUrl: "https://www.google.com/maps?cid=7692677784331814544",
  hours: "Emergency & IPD: 24x7 Open",
} as const;

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About Us",
    href: "/about",
    children: [
      { label: "About the Hospital", href: "/about" },
      { label: "Chairman's Message", href: "/chairmans-message" },
      { label: "CEO Message", href: "/ceo-message" },
      { label: "Our Directors", href: "/our-directors" },
      { label: "Mission, Vision & Values", href: "/mission-vision-values" },
      { label: "Quality & Safety", href: "/quality-and-safety" },
      { label: "CSR", href: "/csr" },
      { label: "Careers", href: "/careers" },
    ],
  },
  { label: "Departments", href: "/departments" },
  { label: "Doctors", href: "/doctors" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Clinical Services", href: "/services" },
      { label: "Patient Services", href: "/patient-services" },
      { label: "Admission Process", href: "/admission-process" },
      { label: "Discharge Process", href: "/discharge-process" },
      { label: "Guidelines for Visitors", href: "/visitor-guidelines" },
      { label: "Patient & Attendant Rights", href: "/patient-rights" },
      { label: "TPA & Insurance", href: "/insurance" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    label: "Facilities",
    href: "/facilities",
    children: [
      { label: "Hospital Facilities", href: "/facilities" },
      { label: "Hospital Gallery", href: "/gallery" },
    ],
  },
  { label: "Health Packages", href: "/health-packages" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
];

/** Second footer column — institutional and patient-care pages. */
export const patientCareNav = [
  { label: "Patient Services", href: "/patient-services" },
  { label: "Admission Process", href: "/admission-process" },
  { label: "Discharge Process", href: "/discharge-process" },
  { label: "Guidelines for Visitors", href: "/visitor-guidelines" },
  { label: "Patient & Attendant Rights", href: "/patient-rights" },
  { label: "Mission, Vision & Values", href: "/mission-vision-values" },
  { label: "Quality & Safety", href: "/quality-and-safety" },
  { label: "Health Packages", href: "/health-packages" },
  { label: "Hospital Gallery", href: "/gallery" },
  { label: "CSR", href: "/csr" },
  { label: "Careers", href: "/careers" },
  { label: "FAQ", href: "/faq" },
] as const;

export const clinicalServiceLinks = [
  { label: "Emergency Care (24x7)", href: "/services#emergency" },
  { label: "ICU & Critical Care Unit", href: "/services#icu" },
  { label: "Operation Theatre (OT)", href: "/services#ot" },
  { label: "Diagnostic Imaging", href: "/services#imaging" },
  { label: "Clinical Pathology & Lab", href: "/services#lab" },
  { label: "24x7 Pharmacy", href: "/services#pharmacy" },
  { label: "Ambulance Services", href: "/services#ambulance" },
  { label: "Preventive Health Check-up", href: "/services#preventive" },
] as const;

export const hospitalStats = [
  { value: "22+", label: "TPA & Insurance", caption: "Direct Cashless Partners", accent: "primary" },
  { value: "50+", label: "Doctors & Specialists", caption: "Board-Certified Clinicians", accent: "primary" },
  { value: "100+", label: "Healthcare Staff", caption: "Dedicated Nurses & Technicians", accent: "primary" },
  { value: "10,000+", label: "Happy Patients", caption: "Treated in Sonari Centre", accent: "secondary" },
] as const;
