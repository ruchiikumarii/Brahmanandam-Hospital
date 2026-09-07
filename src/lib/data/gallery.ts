export type GalleryCategory =
  | "campus"
  | "critical-care"
  | "diagnostics"
  | "consultation";

export type GalleryItem = {
  src: string;
  alt: string;
  caption: string;
  category: GalleryCategory;
  /** Native pixel size — keeps the grid from shifting while images load. */
  width: number;
  height: number;
};

export const galleryCategories: { id: GalleryCategory | "all"; label: string }[] =
  [
    { id: "all", label: "All Photos" },
    { id: "campus", label: "Campus & Emergency" },
    { id: "critical-care", label: "Critical Care & OT" },
    { id: "diagnostics", label: "Diagnostics & Pharmacy" },
    { id: "consultation", label: "OPD & Consultation" },
  ];

export const galleryItems: GalleryItem[] = [
  {
    src: "/images/facilities/ambulance.jpg",
    alt: "Brahmanandam Hospital main entrance with an ambulance parked outside",
    caption: "Hospital Entrance & 24×7 Ambulance - Kagal Nagar",
    category: "campus",
    width: 900,
    height: 428,
  },
  {
    src: "/images/facilities/emergency.jpg",
    alt: "Triage and emergency entrance with medical staff and resuscitation trolleys",
    caption: "Triage & Emergency Entrance (24×7)",
    category: "campus",
    width: 900,
    height: 428,
  },
  {
    src: "/images/facilities/icu.jpg",
    alt: "Intensive care unit with monitored beds and nursing station",
    caption: "ICU & Critical Care Unit",
    category: "critical-care",
    width: 900,
    height: 428,
  },
  {
    src: "/images/facilities/operation-theatre.jpg",
    alt: "Modular operation theatre with surgical team and laminar airflow",
    caption: "Modular Operation Theatre",
    category: "critical-care",
    width: 900,
    height: 428,
  },
  {
    src: "/images/facilities/diagnostics.jpg",
    alt: "Clinical pathology laboratory with automated analysers and technicians",
    caption: "Clinical Pathology & Biochemistry Lab",
    category: "diagnostics",
    width: 900,
    height: 428,
  },
  {
    src: "/images/facilities/pharmacy.jpg",
    alt: "In-house hospital pharmacy counter with pharmacists serving patients",
    caption: "In-House Pharmacy - Open 24 Hours",
    category: "diagnostics",
    width: 900,
    height: 428,
  },
  {
    src: "/images/blog/heart-health.jpg",
    alt: "Cardiologist explaining a heart model to a patient during consultation",
    caption: "Cardiology OPD Consultation",
    category: "consultation",
    width: 900,
    height: 438,
  },
  {
    src: "/images/blog/diabetes-care.jpg",
    alt: "Physician counselling a patient on diet and blood sugar monitoring",
    caption: "Diabetes & General Medicine Clinic",
    category: "consultation",
    width: 900,
    height: 438,
  },
  {
    src: "/images/blog/child-health.jpg",
    alt: "Paediatrician examining a child with a stethoscope in the child care wing",
    caption: "Paediatrics & Child Care Wing",
    category: "consultation",
    width: 900,
    height: 438,
  },
  {
    src: "/images/doctors/rajeev-ranjan-profile.jpg",
    alt: "Senior interventional cardiologist at the Sonari cardiac unit",
    caption: "Cardiac Sciences - Senior Consultant",
    category: "consultation",
    width: 720,
    height: 727,
  },
  {
    src: "/images/general/sonari-map.jpg",
    alt: "Map showing the location of Brahmanandam Hospital Centre in Sonari, Jamshedpur",
    caption: "Central Sonari Location - Near Road No. 3",
    category: "campus",
    width: 1200,
    height: 524,
  },
];
