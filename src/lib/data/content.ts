export const specialities = [
  { name: "Cardiology", caption: "Heart & Vascular Care", icon: "heart-pulse", href: "/departments/cardiology" },
  { name: "Neurology", caption: "Brain & Spine Triage", icon: "brain", href: "/departments" },
  { name: "Orthopaedics", caption: "Joint & Trauma Surgery", icon: "bone", href: "/departments/orthopaedics-trauma-surgery" },
  { name: "Gynaecology", caption: "Maternity & Women Care", icon: "person-standing", href: "/departments/obstetrics-gynaecology" },
  { name: "General Surgery", caption: "Laparoscopic Center", icon: "activity", href: "/departments/general-laparoscopic-surgery" },
  { name: "Paediatrics", caption: "Neonatal & Child Health", icon: "smile", href: "/departments/paediatrics-neonatal-care" },
  { name: "Urology", caption: "Kidney Stones & Bladder", icon: "droplet", href: "/departments/general-laparoscopic-surgery" },
  { name: "Nephrology", caption: "Renal Care & Dialysis", icon: "droplets", href: "/departments" },
  { name: "ENT", caption: "Ear, Nose & Throat", icon: "ear", href: "/departments" },
] as const;

export const whyChooseUs = [
  {
    title: "Advanced Technology",
    text: "Equipped with high-precision laparoscopy towers, digital X-rays, multi-para patient monitors, and fully sterile modular OT setups.",
    icon: "microscope",
    tone: "secondary",
  },
  {
    title: "Expert Doctors",
    text: "Renowned physicians and experienced surgeons with decades of collective experience across tier-1 medical colleges and institutes.",
    icon: "graduation-cap",
    tone: "primary",
  },
  {
    title: "Patient First",
    text: "Transparent treatment protocols, compassionate bedside nursing, zero hidden charges, and structured post-operative recovery guidance.",
    icon: "hand-heart",
    tone: "primary",
  },
  {
    title: "24×7 Care",
    text: "Round-the-clock casualty room with emergency doctors, ICU beds, in-house lab testing, and dedicated ALS ambulance dispatch.",
    icon: "ambulance",
    tone: "secondary",
  },
] as const;

export const facilities = [
  {
    slug: "emergency",
    eyebrow: "Trauma Center",
    title: "Emergency Care (24×7)",
    text: "Equipped for acute poly-trauma, stroke protocols, cardiac arrest triage, and immediate bedside life support by emergency medical officers.",
    image: "/images/facilities/emergency.jpg",
    note: "Always Active • Zero Delay Desk",
    noteIcon: "dot",
    noteTone: "success",
    eyebrowTone: "secondary",
  },
  {
    slug: "icu",
    eyebrow: "Critical Care",
    title: "ICU & Critical Care Unit",
    text: "Dedicated intensive care beds monitored 24×7 by intensivists and certified critical care nursing teams with invasive arterial lines.",
    image: "/images/facilities/icu.jpg",
    note: "1:1 Nursing Ratio for Critical Beds",
    noteIcon: "shield",
    noteTone: "primary",
    eyebrowTone: "primary",
  },
  {
    slug: "ot",
    eyebrow: "Surgical Suite",
    title: "Advanced Operation Theatres",
    text: "Laminar airflow modular theatres designed for complex orthopaedic arthroplasty, laparoscopic interventions, and caesarean deliveries.",
    image: "/images/facilities/operation-theatre.jpg",
    note: "HEPA Filtration & Zero Infection Standard",
    noteIcon: "wind",
    noteTone: "primary",
    eyebrowTone: "primary",
  },
  {
    slug: "diagnostics",
    eyebrow: "Diagnostics",
    title: "Modern Diagnostics & Lab",
    text: "Automated biochemistry, haematology, digital X-Ray, ultrasonography, and computerized ECG with fast-track report delivery.",
    image: "/images/facilities/diagnostics.jpg",
    note: "Fast 60-Minute Routine Reports",
    noteIcon: "check",
    noteTone: "success",
    eyebrowTone: "primary",
  },
  {
    slug: "pharmacy",
    eyebrow: "24x7 Pharmacy",
    title: "In-House Pharmacy",
    text: "Stocking 100% verified genuine emergency medications, critical care injectables, post-op dressings, and daily patient prescriptions.",
    image: "/images/facilities/pharmacy.jpg",
    note: "Open 24 Hours Every Day",
    noteIcon: "dot",
    noteTone: "success",
    eyebrowTone: "primary",
  },
  {
    slug: "ambulance",
    eyebrow: "Fast Response",
    title: "24×7 Ambulance Fleet",
    text: "Equipped with transport oxygen, portable suction, defibrillators, and trained EMT paramedics for immediate patient transit across Jamshedpur.",
    image: "/images/facilities/ambulance.jpg",
    note: "Call Ambulance: 8271827999",
    noteIcon: "phone",
    noteTone: "secondary",
    eyebrowTone: "secondary",
  },
] as const;

export const insurancePartners = [
  { name: "Star Health", status: "Cashless Active" },
  { name: "ICICI Lombard", status: "Instant Approval" },
  { name: "HDFC ERGO", status: "Cashless Active" },
  { name: "Medi Assist", status: "Pre-Auth Desk" },
  { name: "Bajaj Allianz", status: "Cashless Active" },
  { name: "Care Health", status: "Fast Settlement" },
] as const;

export const insuranceExtended = [
  "Star Health",
  "HDFC ERGO",
  "ICICI Lombard",
  "Care Health",
  "Medi Assist TPA",
  "Paramount TPA",
  "Bajaj Allianz",
  "Niva Bupa",
  "New India Assurance",
  "Oriental Insurance",
  "United India Insurance",
  "National Insurance",
  "Vidal Health TPA",
  "MD India TPA",
  "Raksha TPA",
  "Heritage Health TPA",
  "Good Health TPA",
  "Ericson TPA",
  "Safeway TPA",
  "Health India TPA",
  "Family Health Plan TPA",
  "Aditya Birla Health",
] as const;

export const testimonials = [
  {
    name: "Anand Swaroop",
    location: "Sonari, Jamshedpur",
    badge: "Verified Patient",
    rating: 5,
    text: "We rushed my father during late evening with intense chest pain. The casualty desk and Dr. Rajeev Ranjan attended to him within 4 minutes. The ICU care is world-class and nursing staff in Sonari are genuinely empathetic.",
  },
  {
    name: "Pooja Sharma",
    location: "Kadma, Jamshedpur",
    badge: "Maternity Care",
    rating: 5,
    text: "Dr. Shreya Singh handled my high-risk delivery with absolute calm and expertise. The post-operative cleanliness of rooms and transparent cashless insurance settlement through Star Health made our stay worry-free.",
  },
  {
    name: "Rakesh Mohan",
    location: "Bistupur, Jamshedpur",
    badge: "Orthopaedics",
    rating: 5,
    text: "My knee arthroscopic surgery was done by Dr. Amit Kumar. I was back walking without support within weeks. Excellent in-house diagnostics, clean OT, and straightforward consultation fees.",
  },
  {
    name: "Sandeep Singh",
    location: "Jamshedpur",
    badge: "Emergency Care",
    rating: 5,
    text: "I had a medical emergency late at night, and Brahmanandam Hospital, Sonari provided immediate treatment. The doctors were highly professional and staff very supportive.",
  },
  {
    name: "Partha Mandal",
    location: "Jamshedpur",
    badge: "Verified Patient",
    rating: 5,
    text: "The hospital is very clean and well-maintained. Hygiene and patient safety are clearly priorities here.",
  },
  {
    name: "Jyoti Gari",
    location: "Jamshedpur",
    badge: "Verified Patient",
    rating: 5,
    text: "The doctors are knowledgeable, and the staff is very cooperative.",
  },
] as const;

export const blogPosts = [
  {
    slug: "why-choose-brahmanandam-hospital",
    category: "Hospital",
    categoryTone: "primary",
    date: "November 25, 2021",
    image: "/images/general/hospital-exterior.jpg",
    title:
      "Why Choose Brahmanandam Hospital - Best Hospital in Jamshedpur for Quality Healthcare",
    excerpt:
      "Known for its commitment to quality, compassion, and patient-centered care, the hospital has become a trusted healthcare destination for thousands of patients in the region.",
  },
  {
    slug: "best-hospital-in-jamshedpur",
    category: "Hospital",
    categoryTone: "secondary",
    date: "November 25, 2021",
    image: "/images/facilities/emergency.jpg",
    title:
      "Best Hospital in Jamshedpur - How to Choose the Right One for Your Family",
    excerpt:
      "A guide to the key factors to consider while selecting the best hospital in Jamshedpur, and why making the right choice can significantly impact your health outcomes.",
  },
  {
    slug: "heart-health-tips",
    category: "Cardiology",
    categoryTone: "secondary",
    date: "April 10, 2026",
    image: "/images/blog/heart-health.jpg",
    title: "Heart Health: Tips for a Stronger Heart & Vitality",
    excerpt:
      "Key dietary modifications, BP monitoring protocols, and warning symptoms that require immediate cardiology consultation in Sonari.",
  },
  {
    slug: "understanding-diabetes",
    category: "General Medicine",
    categoryTone: "primary",
    date: "April 04, 2026",
    image: "/images/blog/diabetes-care.jpg",
    title: "Understanding Diabetes: Early Symptoms & Clinical Care",
    excerpt:
      "Managing HbA1c levels, recognizing peripheral neuropathy signs, and regular renal screening routines for adults over 35.",
  },
  {
    slug: "child-health-seasonal-care",
    category: "Paediatrics",
    categoryTone: "secondary",
    date: "March 28, 2026",
    image: "/images/blog/child-health.jpg",
    title: "Child Health: Seasonal Infection Care & Prevention",
    excerpt:
      "Crucial immunization calendars, hydration guidelines during summer months, and identifying severe fever spikes in infants.",
  },
] as const;

export const quickActions = [
  {
    title: "Find a Doctor",
    text: "Browse experienced, trusted senior consultants & specialists.",
    icon: "user-search",
    href: "/doctors",
    variant: "default",
  },
  {
    title: "Book Appointment",
    text: "Book your OPD slot online in less than 60 seconds.",
    icon: "calendar-plus",
    href: "/appointment",
    variant: "default",
  },
  {
    title: "24×7 Emergency",
    text: "Immediate trauma care, cardiac emergency & ambulance triage.",
    icon: "siren",
    href: "tel:+918271827999",
    variant: "emergency",
  },
  {
    title: "Direct Helpline",
    text: "Tap to speak directly with Sonari front desk.",
    icon: "phone",
    href: "tel:+918271827999",
    variant: "helpline",
  },
] as const;

export const trustPoints = [
  { title: "24×7", caption: "Emergency", icon: "asterisk", tone: "secondary" },
  { title: "Expert", caption: "Doctors", icon: "stethoscope", tone: "primary" },
  { title: "Advanced", caption: "Technology", icon: "microscope", tone: "primary" },
  { title: "Patient", caption: "Centered", icon: "heart", tone: "success" },
] as const;

export const clinicalStandards = [
  {
    title: "NABH-Aligned Protocols",
    text: "Strict infection control, standardized clinical pathways, and transparent diagnostic reporting adhering to modern medical quality guidelines.",
    icon: "shield-check",
  },
  {
    title: "Integrated Diagnostics",
    text: "Immediate correlation with in-house 24×7 pathology, digital X-Ray, high-resolution ultrasound, and round-the-clock intensive care backup.",
    icon: "microscope",
  },
  {
    title: "Cashless & TPA Empanelment",
    text: "Seamless coverage with major health insurers, government schemes, and corporate packages handled by our dedicated patient facilitation desk.",
    icon: "credit-card",
  },
] as const;

export const services = [
  {
    id: "emergency",
    title: "Emergency Care (24x7)",
    text: "Round-the-clock casualty and trauma response with on-site emergency medical officers, resuscitation bay, and zero admission delay triage.",
    icon: "siren",
    points: ["Golden-hour trauma protocol", "Stroke & cardiac arrest pathway", "Red-zone triage desk"],
  },
  {
    id: "icu",
    title: "ICU & Critical Care Unit",
    text: "Tertiary intensive therapy beds with invasive and non-invasive ventilation, 1:1 critical nursing, and negative-pressure isolation pods.",
    icon: "activity",
    points: ["Multi-para hemodynamic monitoring", "Intensivist-led rounds", "Sepsis bundle protocols"],
  },
  {
    id: "ot",
    title: "Operation Theatre (OT)",
    text: "Laminar airflow modular theatres with HEPA filtration for orthopaedic arthroplasty, laparoscopic surgery, and obstetric procedures.",
    icon: "scalpel",
    points: ["Zero infection standard", "Ultra-HD laparoscopic towers", "C-Arm intra-op imaging"],
  },
  {
    id: "imaging",
    title: "Diagnostic Imaging",
    text: "Digital high-definition X-Ray, portable bedside radiography, and 2D/3D colour Doppler ultrasound with obstetric anomaly scanning.",
    icon: "scan",
    points: ["Low-dose digital detectors", "Portable ICU imaging", "Same-day reporting"],
  },
  {
    id: "lab",
    title: "Clinical Pathology & Lab",
    text: "Automated biochemistry, haematology, and immunoassay analysers delivering fast-track routine reports with online delivery.",
    icon: "microscope",
    points: ["60-minute routine turnaround", "24×7 emergency lab", "Online report access"],
  },
  {
    id: "pharmacy",
    title: "24x7 Pharmacy",
    text: "In-house pharmacy stocking verified emergency medication, critical care injectables, post-operative dressings, and daily prescriptions.",
    icon: "pill",
    points: ["100% genuine stock", "Critical care injectables", "Open every day, all night"],
  },
  {
    id: "ambulance",
    title: "Ambulance Services",
    text: "Advanced Life Support ambulances with transport oxygen, defibrillators, portable suction, and trained EMT paramedics across Jamshedpur.",
    icon: "ambulance",
    points: ["ALS-equipped fleet", "Trained EMT paramedics", "Rapid city-wide dispatch"],
  },
  {
    id: "preventive",
    title: "Preventive Health Check-up",
    text: "Age-appropriate screening packages combining laboratory profiles, imaging, and consolidated physician review in a single visit.",
    icon: "clipboard-check",
    points: ["Executive & senior packages", "Cardiac risk screening", "Consolidated physician review"],
  },
] as const;

export const aboutMilestones = [
  { year: "Mission", title: "Clinically authoritative care", text: "Deliver tertiary-level clinical outcomes to Sonari and greater Jamshedpur without patients needing to travel to metro centres." },
  { year: "Vision", title: "Patient-centred excellence", text: "Be the most trusted multi specialty centre in East Singhbhum for emergency readiness, surgical precision, and ethical practice." },
  { year: "Values", title: "Transparency & compassion", text: "Transparent pricing, unhurried consultation, structured follow-up, and dignified nursing care for every patient family." },
] as const;

export const campusWayfinding = [
  {
    title: "Counter 1 & 2 (Ground Floor Lobby)",
    text: "General Medicine, Paediatrics, and Rapid Blood Sample Collection.",
  },
  {
    title: "First Floor Speciality Suites",
    text: "Cardiology OPD, Orthopaedics Consultation, Gynaecology Clinics, and Ultrasound.",
  },
] as const;

export const popularSearches = [
  "Interventional Cardiology",
  "Joint Replacement",
  "Neonatology",
  "Urology",
] as const;
