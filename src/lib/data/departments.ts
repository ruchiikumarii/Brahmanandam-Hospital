export type DepartmentCategory =
  | "critical-care"
  | "surgical"
  | "medical"
  | "diagnostic";

export type Department = {
  slug: string;
  name: string;
  shortName: string;
  badge: string;
  category: DepartmentCategory;
  icon: string;
  tone: "primary" | "secondary";
  summary: string;
  lead: { label: string; name: string; meta: string; doctorSlug?: string };
  capabilities: string[];
  capabilityLabel: string;
  primaryAction: { label: string; href: string };
  secondaryAction: { label: string; href: string };
  hotline?: string;
  hotlineNote?: string;
  overview?: string[];
  procedures?: string[];
  equipment?: { title: string; text: string }[];
  opd: { label: string; value: string }[];
};

export const departmentCategories: {
  id: DepartmentCategory | "all";
  label: string;
}[] = [
  { id: "all", label: "All Departments" },
  { id: "critical-care", label: "Critical Care & Trauma" },
  { id: "surgical", label: "Surgical Specialties" },
  { id: "medical", label: "Medical Sciences" },
  { id: "diagnostic", label: "Diagnostic Wings" },
];

export const departments: Department[] = [
  {
    slug: "cardiology",
    name: "Cardiology & Cardiac Sciences",
    shortName: "Cardiology",
    badge: "Cath Lab 24×7",
    category: "critical-care",
    icon: "heart-pulse",
    tone: "secondary",
    summary:
      "Comprehensive coronary interventional suites and continuous hemodynamics monitoring for acute heart conditions.",
    lead: {
      label: "Lead Specialist",
      name: "Dr. Rajeev Ranjan",
      meta: "MD, DM Cardiology • Interventional Cardiologist",
      doctorSlug: "rajeev-ranjan",
    },
    capabilityLabel: "Key Clinical Capabilities",
    capabilities: [
      "24×7 Flat-Panel Cath Lab & Stenting",
      "Coronary Angioplasty & Pacemaker Clinic",
      "Cardiac ICU, Echocardiography & TMT",
    ],
    primaryAction: { label: "Book Department OPD", href: "/appointment?department=cardiology" },
    secondaryAction: { label: "View Details", href: "/departments/cardiology" },
    overview: [
      "The Department of Cardiology & Cardiac Sciences at Brahmanandam Hospital, Sonari operates a digital flat-panel catheterisation laboratory with round-the-clock primary angioplasty readiness for acute myocardial infarction.",
      "Our cardiac team combines non-invasive diagnostics — echocardiography, treadmill testing, Holter and ambulatory BP monitoring — with a full interventional programme covering angioplasty, stenting, and device implantation.",
      "Post-procedure patients are monitored in a dedicated cardiac intensive care unit with multi-parameter telemetry and a structured cardiac rehabilitation pathway.",
    ],
    procedures: [
      "Coronary Angiography & Angioplasty (PTCA)",
      "Drug-Eluting Stent & Bifurcation Stenting",
      "Permanent Pacemaker, ICD & CRT Implantation",
      "2D / 3D Echocardiography & Transesophageal Echo",
      "Treadmill Test (TMT) & Holter Monitoring",
      "Heart Failure & Cardiac Rehabilitation Clinic",
    ],
    equipment: [
      { title: "Digital Flat-Panel Cath Lab", text: "High-resolution imaging with low radiation dose for coronary interventions." },
      { title: "Cardiac ICU", text: "Multi-parameter telemetry beds with invasive hemodynamic monitoring." },
      { title: "Non-Invasive Cardiac Lab", text: "Echo, TMT, Holter and ambulatory blood pressure monitoring." },
    ],
    opd: [
      { label: "OPD Days", value: "Monday to Saturday" },
      { label: "Morning OPD", value: "10:00 AM – 01:30 PM" },
      { label: "Evening OPD", value: "04:00 PM – 07:00 PM" },
      { label: "Chamber", value: "Chamber #4, Block A" },
    ],
  },
  {
    slug: "obstetrics-gynaecology",
    name: "Obstetrics & Gynaecology",
    shortName: "Obs & Gynae",
    badge: "High-Risk Suite",
    category: "surgical",
    icon: "baby",
    tone: "primary",
    summary:
      "Holistic maternal care, painless labor suites, and advanced minimally invasive gynecological interventions.",
    lead: {
      label: "Lead Specialist",
      name: "Dr. Shreya Singh",
      meta: "MS Obs & Gynae • High-Risk Obstetrician",
      doctorSlug: "shreya-singh",
    },
    capabilityLabel: "Key Clinical Capabilities",
    capabilities: [
      "Comprehensive Antenatal & Painless Delivery",
      "Laparoscopic Hysterectomy & Myomectomy",
      "Infertility Workup & PCOD Management",
    ],
    primaryAction: { label: "Book Department OPD", href: "/appointment?department=obstetrics-gynaecology" },
    secondaryAction: { label: "View Details", href: "/departments/obstetrics-gynaecology" },
    overview: [
      "The maternity wing at Brahmanandam Hospital, Sonari provides complete antenatal, intrapartum, and postnatal care supported by dedicated labour suites and 24×7 anaesthesia cover for painless delivery.",
      "High-risk pregnancies — hypertensive disorders, gestational diabetes, twin gestation, and previous caesarean — are managed with structured monitoring and immediate neonatal intensive care backup.",
      "Our gynaecology service covers minimally invasive keyhole surgery, infertility evaluation, adolescent health, and menopause care in a private, unhurried clinic setting.",
    ],
    procedures: [
      "Normal & Painless (Epidural) Delivery",
      "Elective and Emergency Caesarean Section",
      "Laparoscopic Hysterectomy & Myomectomy",
      "Infertility Evaluation & Ovulation Induction",
      "Colposcopy, Pap Smear & HPV Screening",
      "Menopause & Bone Health Clinic",
    ],
    equipment: [
      { title: "Dedicated Labour Suites", text: "Private birthing rooms with continuous fetal monitoring." },
      { title: "Level-II NICU", text: "Adjacent neonatal intensive care for immediate newborn support." },
      { title: "Laparoscopic Tower", text: "Ultra-HD imaging for minimally invasive gynaecological surgery." },
    ],
    opd: [
      { label: "OPD Days", value: "Monday to Saturday" },
      { label: "Morning OPD", value: "10:00 AM – 02:00 PM" },
      { label: "Maternity Rounds", value: "05:00 PM – 06:30 PM" },
      { label: "Chamber", value: "Chamber #2, Block B (Maternity)" },
    ],
  },
  {
    slug: "orthopaedics-trauma-surgery",
    name: "Orthopaedics & Trauma Surgery",
    shortName: "Orthopaedics",
    badge: "Joint Center",
    category: "surgical",
    icon: "bone",
    tone: "primary",
    summary:
      "Pioneering joint replacement protocols, computer-assisted reconstructive trauma, and spine surgery.",
    lead: {
      label: "Lead Specialist",
      name: "Dr. Amit Kumar",
      meta: "MS Ortho • Joint Replacement & Spine Surgeon",
      doctorSlug: "amit-kumar",
    },
    capabilityLabel: "Key Clinical Capabilities",
    capabilities: [
      "Total Knee & Total Hip Arthroplasty",
      "Keyhole Arthroscopy & Sports Injury Care",
      "Complex Pelvi-Acetabular Fracture Fixation",
    ],
    primaryAction: { label: "Book Department OPD", href: "/appointment?department=orthopaedics-trauma-surgery" },
    secondaryAction: { label: "View Details", href: "/departments/orthopaedics-trauma-surgery" },
    overview: [
      "The Orthopaedics & Trauma Surgery department delivers joint replacement, arthroscopy, and complex trauma fixation in laminar airflow modular operation theatres with a zero-infection standard.",
      "A rehabilitation-first pathway begins on the first post-operative day, with supervised physiotherapy and structured load progression toward independent mobility.",
      "The trauma service is integrated with the 24×7 emergency wing, on-site C-arm imaging, and immediate orthopaedic surgeon availability for road traffic and fragility injuries.",
    ],
    procedures: [
      "Total Knee & Total Hip Replacement",
      "ACL / PCL Reconstruction & Meniscal Repair",
      "Shoulder Arthroscopy & Rotator Cuff Repair",
      "Intramedullary Nailing & Plate Osteosynthesis",
      "Pelvi-Acetabular Fracture Fixation",
      "Spine & Disc Pain Interventions",
    ],
    equipment: [
      { title: "Laminar Airflow Modular OT", text: "HEPA-filtered theatre engineered for implant surgery." },
      { title: "C-Arm Image Intensifier", text: "Real-time intra-operative fracture imaging." },
      { title: "Arthroscopy Tower", text: "High-definition keyhole surgery system." },
    ],
    opd: [
      { label: "OPD Days", value: "Monday to Saturday" },
      { label: "Morning OPD", value: "11:00 AM – 03:00 PM" },
      { label: "Evening OPD", value: "05:00 PM – 08:00 PM" },
      { label: "Chamber", value: "Chamber #6, Ground Floor" },
    ],
  },
  {
    slug: "paediatrics-neonatal-care",
    name: "Paediatrics & Neonatal Care",
    shortName: "Paediatrics",
    badge: "NICU & PICU",
    category: "medical",
    icon: "smile",
    tone: "primary",
    summary:
      "Compassionate, specialized paediatric ward with incubator facilities and pediatric emergency management.",
    lead: {
      label: "Lead Specialist",
      name: "Dr. Neha Kumari",
      meta: "DNB Paediatrics • Consultant Neonatologist",
      doctorSlug: "neha-kumari",
    },
    capabilityLabel: "Key Clinical Capabilities",
    capabilities: [
      "Dedicated Level-II Neonatal ICU (NICU)",
      "Universal Immunization & Well-Baby Clinic",
      "Adolescent Health & Paediatric Pulmonology",
    ],
    primaryAction: { label: "Book Department OPD", href: "/appointment?department=paediatrics-neonatal-care" },
    secondaryAction: { label: "View Details", href: "/departments/paediatrics-neonatal-care" },
    overview: [
      "The child care wing at Brahmanandam Hospital, Sonari runs a Level-II neonatal intensive care unit with incubators, phototherapy units, CPAP support, and a dedicated neonatal nursing team.",
      "Preterm and low-birth-weight babies receive structured thermal, nutritional, and respiratory support, with delivery-room resuscitation cover for every high-risk birth.",
      "Outpatient paediatrics covers growth and developmental surveillance, IAP-schedule immunisation, childhood asthma, and seasonal infectious illness.",
    ],
    procedures: [
      "Neonatal Intensive Care & Phototherapy",
      "Delivery-Room Neonatal Resuscitation",
      "IAP-Schedule Immunisation & Catch-Up Vaccination",
      "Growth & Developmental Milestone Assessment",
      "Paediatric Nebulisation & Asthma Care",
      "Adolescent Health & Nutrition Clinic",
    ],
    equipment: [
      { title: "Level-II NICU", text: "Incubators, radiant warmers, CPAP and phototherapy units." },
      { title: "Paediatric HDU", text: "High-dependency beds with paediatric monitoring." },
      { title: "Well-Baby Clinic", text: "Growth charting, vaccination cold chain and counselling room." },
    ],
    opd: [
      { label: "OPD Days", value: "Monday to Saturday" },
      { label: "Morning OPD", value: "10:00 AM – 02:00 PM" },
      { label: "Evening OPD", value: "05:00 PM – 07:30 PM" },
      { label: "Chamber", value: "Chamber #5, Child Care Wing" },
    ],
  },
  {
    slug: "general-laparoscopic-surgery",
    name: "General & Laparoscopic Surgery",
    shortName: "General Surgery",
    badge: "Modular OT",
    category: "surgical",
    icon: "scalpel",
    tone: "primary",
    summary:
      "Advanced HEPA-filtered laminar airflow surgical suites equipped with ultra-HD laparoscopic towers.",
    lead: {
      label: "Lead Specialist",
      name: "Dr. S. K. Mukherjee & Team",
      meta: "Senior Laparoscopic & GI Surgeons",
      doctorSlug: "sk-mukherjee",
    },
    capabilityLabel: "Key Clinical Capabilities",
    capabilities: [
      "Laparoscopic Cholecystectomy & Appendectomy",
      "Inguinal & Ventral Hernia Repairs",
      "Day-Care Laser Proctology (Piles, Fissure)",
    ],
    primaryAction: { label: "Book Department OPD", href: "/appointment?department=general-laparoscopic-surgery" },
    secondaryAction: { label: "View Details", href: "/departments/general-laparoscopic-surgery" },
    overview: [
      "The surgical services at Brahmanandam Hospital cover general, gastrointestinal, laparoscopic, and urological surgery in HEPA-filtered laminar airflow modular operation theatres.",
      "Minimally invasive keyhole techniques are the default wherever clinically appropriate, reducing hospital stay, post-operative pain, and infection risk.",
      "A dedicated day-care surgical pathway allows several procedures — laser proctology, hernia repair, and endourology — to be completed with same-day discharge.",
    ],
    procedures: [
      "Laparoscopic Cholecystectomy (Gall Bladder)",
      "Laparoscopic Appendectomy",
      "Inguinal, Umbilical & Ventral Hernia Mesh Repair",
      "Laser Proctology — Piles, Fissure, Fistula",
      "Endourology — RIRS, URSL, PCNL & TURP",
      "Breast, Thyroid & Soft Tissue Surgery",
    ],
    equipment: [
      { title: "Ultra-HD Laparoscopic Tower", text: "High-definition imaging for keyhole abdominal surgery." },
      { title: "Modular Operation Theatres", text: "Laminar airflow with HEPA filtration and zero-infection standard." },
      { title: "Surgical Laser System", text: "Day-care laser proctology and endourology laser lithotripsy." },
    ],
    opd: [
      { label: "OPD Days", value: "Monday to Saturday" },
      { label: "Surgical OPD", value: "11:00 AM – 02:00 PM" },
      { label: "Super Specialty OPD", value: "02:00 PM – 06:00 PM (Tue, Thu, Sat)" },
      { label: "Chamber", value: "Chamber #7, Block A" },
    ],
  },
  {
    slug: "general-medicine-diabetology",
    name: "General Medicine & Diabetology",
    shortName: "General Medicine",
    badge: "Internal Medicine",
    category: "medical",
    icon: "stethoscope",
    tone: "primary",
    summary:
      "Management of multi-system clinical illnesses, chronic lifestyle disorders, and endemic infectious diseases.",
    lead: {
      label: "Lead Specialist",
      name: "Dr. Pankaj Verma",
      meta: "MD Medicine • Consultant Physician",
      doctorSlug: "pankaj-verma",
    },
    capabilityLabel: "Key Clinical Capabilities",
    capabilities: [
      "Type 1 & Type 2 Diabetes Management",
      "Tropical Infections (Dengue, Malaria, Typhoid)",
      "Hypertension, Dyslipidemia & Geriatric Care",
    ],
    primaryAction: { label: "Book Department OPD", href: "/appointment?department=general-medicine-diabetology" },
    secondaryAction: { label: "View Details", href: "/departments/general-medicine-diabetology" },
    overview: [
      "The Department of General Medicine manages the full breadth of adult internal medicine — from acute febrile illness and infection to long-term metabolic and cardiovascular risk control.",
      "A structured diabetes clinic combines HbA1c-guided therapy titration, renal and retinal screening referral, and diabetic foot surveillance under one follow-up plan.",
      "Acute medical admissions are supported by high-dependency beds, 24×7 in-house pathology, and immediate intensivist escalation when required.",
    ],
    procedures: [
      "Structured Diabetes & Insulin Titration Clinic",
      "Hypertension & Cardiovascular Risk Assessment",
      "Dengue, Malaria, Typhoid & Scrub Typhus Care",
      "Thyroid & Metabolic Syndrome Evaluation",
      "Geriatric Medicine & Polypharmacy Review",
      "Preventive Health Check-up Packages",
    ],
    equipment: [
      { title: "24×7 In-House Pathology", text: "Automated biochemistry and haematology with 60-minute routine reporting." },
      { title: "High-Dependency Unit", text: "Monitored beds for acute medical admissions." },
      { title: "Diabetes Care Suite", text: "HbA1c analysis, foot screening and dietary counselling." },
    ],
    opd: [
      { label: "OPD Days", value: "Monday to Saturday" },
      { label: "Morning OPD", value: "09:00 AM – 01:00 PM" },
      { label: "Diabetes Clinic", value: "04:00 PM – 05:30 PM (Tue & Fri)" },
      { label: "Chamber", value: "Chamber #1, Block A" },
    ],
  },
  {
    slug: "emergency-trauma-care",
    name: "Emergency & Trauma Care (24×7)",
    shortName: "Emergency",
    badge: "Always Active 24×7",
    category: "critical-care",
    icon: "siren",
    tone: "secondary",
    summary:
      "Golden Hour intervention unit equipped for critical road trauma, stroke triage, toxicological crises, and acute cardiopulmonary arrest.",
    lead: {
      label: "Emergency Dispatch Hotline",
      name: "8271827999",
      meta: "Sonari Red-Zone Triage • Zero Admission Delay",
    },
    capabilityLabel: "Immediate Emergency Capabilities",
    capabilities: [
      "Immediate Multi-Bed Resuscitation Bay",
      "24×7 Advanced Life Support (ALS) Ambulance Fleet",
      "On-Site Emergency Medical Officers & Surgeons",
    ],
    primaryAction: { label: "Call 24×7 Desk", href: "tel:+918271827999" },
    secondaryAction: { label: "Trauma Protocol", href: "/departments/emergency-trauma-care" },
    hotline: "8271827999",
    hotlineNote: "Sonari Red-Zone Triage • Zero Admission Delay",
    overview: [
      "The Emergency & Trauma Care unit at Brahmanandam Hospital, Sonari operates continuously with on-site emergency medical officers, trauma surgeons, and immediate access to operation theatres and the cath lab.",
      "A multi-bed resuscitation bay handles poly-trauma, acute stroke, cardiac arrest, poisoning, and obstetric emergencies with defined golden-hour protocols and zero admission delay.",
      "Advanced Life Support ambulances equipped with oxygen, defibrillators, portable suction, and trained EMT paramedics service the Jamshedpur region round the clock.",
    ],
    procedures: [
      "Poly-Trauma Resuscitation & Damage Control",
      "Acute Stroke Triage & Thrombolysis Pathway",
      "Primary Angioplasty Activation for Heart Attack",
      "Advanced Cardiac Life Support (ACLS)",
      "Poisoning, Snake Bite & Toxicology Management",
      "Emergency Obstetric & Paediatric Stabilisation",
    ],
    equipment: [
      { title: "Resuscitation Bay", text: "Multi-bed critical bay with ventilators and defibrillators." },
      { title: "ALS Ambulance Fleet", text: "Oxygen, defibrillator, suction and trained EMT paramedics." },
      { title: "Red-Zone Triage Desk", text: "Immediate severity sorting with zero admission delay." },
    ],
    opd: [
      { label: "Availability", value: "24 hours × 7 days" },
      { label: "Emergency Hotline", value: "8271827999" },
      { label: "Ambulance", value: "24×7 ALS Dispatch" },
      { label: "Location", value: "Ground Floor, Triage & Emergency Entrance" },
    ],
  },
  {
    slug: "diagnostic-imaging-pathology",
    name: "Diagnostic Imaging & Pathology",
    shortName: "Diagnostics",
    badge: "NABL Standard Lab",
    category: "diagnostic",
    icon: "microscope",
    tone: "primary",
    summary:
      "Fully automated in-house hematology, clinical biochemistry analyzers, and high-frequency digital radiology suite.",
    lead: {
      label: "Laboratory Wing",
      name: "Central Pathology Services",
      meta: "Turnaround < 2 Hours for Routine Investigations",
    },
    capabilityLabel: "Key Clinical Capabilities",
    capabilities: [
      "Digital High-Definition X-Ray & Portable Imaging",
      "2D/3D Colour Doppler & Obstetric Ultrasound",
      "Automated Immunoassays & Fast-Track Online Reports",
    ],
    primaryAction: { label: "Book Lab Test", href: "/appointment?department=diagnostic-imaging-pathology" },
    secondaryAction: { label: "View Diagnostics", href: "/departments/diagnostic-imaging-pathology" },
    overview: [
      "The diagnostic wing integrates radiology and pathology under one roof, allowing immediate clinical correlation between imaging findings and laboratory results.",
      "Automated biochemistry, haematology, and immunoassay analysers deliver routine investigation reports with a turnaround of under two hours.",
      "Digital radiography, portable bedside X-ray, and high-frequency colour Doppler ultrasound support both outpatient diagnostics and critical-care imaging.",
    ],
    procedures: [
      "Digital X-Ray & Portable Bedside Imaging",
      "2D / 3D Colour Doppler Ultrasonography",
      "Obstetric & Anomaly Scan",
      "Automated Biochemistry & Haematology Profiles",
      "Hormonal & Immunoassay Testing",
      "Computerised ECG & Cardiac Marker Panels",
    ],
    equipment: [
      { title: "Digital Radiography Suite", text: "High-definition X-Ray with low-dose digital detectors." },
      { title: "Colour Doppler Ultrasound", text: "High-frequency probes for vascular and obstetric imaging." },
      { title: "Automated Analysers", text: "Biochemistry, haematology and immunoassay platforms." },
    ],
    opd: [
      { label: "Sample Collection", value: "07:00 AM – 08:00 PM" },
      { label: "Emergency Lab", value: "24 hours × 7 days" },
      { label: "Routine Reports", value: "Within 60 minutes" },
      { label: "Location", value: "Ground Floor, Clinical Pathology Lab" },
    ],
  },
  {
    slug: "icu-critical-care",
    name: "ICU & Critical Care Unit",
    shortName: "Critical Care",
    badge: "Tertiary ICU",
    category: "critical-care",
    icon: "activity",
    tone: "primary",
    summary:
      "High-dependency step-down and intensive therapy beds supported by non-invasive and invasive mechanical ventilation.",
    lead: {
      label: "Unit Directorship",
      name: "Intensivist Team & Anaesthesia",
      meta: "1:1 Nurse-to-Patient Ratio in Critical Bed Bays",
    },
    capabilityLabel: "Key Clinical Capabilities",
    capabilities: [
      "Multiparameter Hemodynamic Central Stations",
      "Arterial Blood Gas (ABG) & Bedside Ultrasound",
      "Isolation Negative-Pressure Infection Pods",
    ],
    primaryAction: { label: "Transfer Inpatient", href: "/contact?subject=ICU%20Transfer" },
    secondaryAction: { label: "View Facility", href: "/departments/icu-critical-care" },
    overview: [
      "The Intensive Care Unit at Brahmanandam Hospital provides tertiary-level critical care with invasive and non-invasive mechanical ventilation, vasoactive support, and continuous hemodynamic monitoring.",
      "Critical bed bays maintain a 1:1 nurse-to-patient ratio, with a resident intensivist team present around the clock and structured daily family briefings.",
      "Negative-pressure isolation pods allow safe management of infective and immunocompromised patients without cross-contamination.",
    ],
    procedures: [
      "Invasive & Non-Invasive Mechanical Ventilation",
      "Central Line & Arterial Line Insertion",
      "Vasopressor & Inotrope Titration",
      "Arterial Blood Gas & Bedside Point-of-Care Ultrasound",
      "Sepsis Bundle & Infection Control Protocols",
      "High-Dependency Step-Down Care",
    ],
    equipment: [
      { title: "Multi-Para Monitors", text: "Central-station hemodynamic monitoring for every bed." },
      { title: "ICU Ventilators", text: "Invasive and non-invasive ventilatory support." },
      { title: "Isolation Pods", text: "Negative-pressure bays for infection containment." },
    ],
    opd: [
      { label: "Availability", value: "24 hours × 7 days" },
      { label: "Nursing Ratio", value: "1:1 in critical bed bays" },
      { label: "Family Briefing", value: "Daily, 11:00 AM & 06:00 PM" },
      { label: "Location", value: "First Floor, Critical Care Block" },
    ],
  },
  /* ------------------------------------------------------------------------
     Departments from the hospital's OPD schedule board. Capabilities come from
     the printed facility lists (Dialysis; PFT & Bronchoscopy; Modern NICU), so
     nothing clinical here is unsourced. Consulting hours are as displayed.
     --------------------------------------------------------------------- */
  {
    slug: "nephrology",
    name: "Nephrology & Dialysis",
    shortName: "Nephrology",
    badge: "Dialysis Unit",
    category: "medical",
    icon: "droplet",
    tone: "primary",
    summary:
      "Consultant-led kidney care with an in-house dialysis unit at the Sonari campus.",
    lead: {
      label: "Consultant",
      name: "Dr Sujit Kumar",
      meta: "Consultant Nephrologist",
      doctorSlug: "sujit-kumar",
    },
    capabilityLabel: "Available Here",
    capabilities: ["Dialysis", "Renal OPD consultation"],
    primaryAction: {
      label: "Book Department OPD",
      href: "/appointment?department=nephrology",
    },
    secondaryAction: { label: "View Details", href: "/departments/nephrology" },
    opd: [
      { label: "OPD Days", value: "Monday to Saturday" },
      { label: "OPD Timing", value: "11:00 AM - 6:00 PM" },
      { label: "Chamber", value: "OPD 3" },
    ],
  },
  {
    slug: "chest-pulmonology",
    name: "Chest & Pulmonology",
    shortName: "Chest",
    badge: "PFT & Bronchoscopy",
    category: "medical",
    icon: "wind",
    tone: "primary",
    summary:
      "Interventional pulmonology for asthma, allergy and chest disease, with pulmonary function testing and bronchoscopy.",
    lead: {
      label: "Consultant",
      name: "Dr Vinayak Agarwal",
      meta: "MBBS, DNB - Interventional Pulmonologist",
      doctorSlug: "vinayak-agarwal",
    },
    capabilityLabel: "Available Here",
    capabilities: ["Pulmonary Function Test (PFT)", "Bronchoscopy"],
    primaryAction: {
      label: "Book Department OPD",
      href: "/appointment?department=chest-pulmonology",
    },
    secondaryAction: {
      label: "View Details",
      href: "/departments/chest-pulmonology",
    },
    opd: [
      { label: "OPD Days", value: "Monday to Saturday" },
      { label: "OPD Timing", value: "11:00 AM - 4:00 PM" },
      { label: "Chamber", value: "OPD 4" },
    ],
  },
  {
    slug: "gastroenterology",
    name: "Gastroenterology",
    shortName: "Gastro",
    badge: "Gastric Surgery",
    category: "surgical",
    icon: "activity",
    tone: "primary",
    summary: "Consultant gastric surgery and digestive care OPD.",
    lead: {
      label: "Consultant",
      name: "Dr A. R. Basu",
      meta: "Gastric Surgeon",
      doctorSlug: "a-r-basu",
    },
    capabilityLabel: "Available Here",
    capabilities: ["Gastric surgery consultation"],
    primaryAction: {
      label: "Book Department OPD",
      href: "/appointment?department=gastroenterology",
    },
    secondaryAction: {
      label: "View Details",
      href: "/departments/gastroenterology",
    },
    opd: [
      { label: "OPD Days", value: "Monday to Saturday" },
      { label: "OPD Timing", value: "10:00 AM - 11:00 AM" },
      { label: "Chamber", value: "OPD 1" },
    ],
  },
  {
    slug: "urology",
    name: "Urology",
    shortName: "Urology",
    badge: "DNB Urology",
    category: "surgical",
    icon: "droplets",
    tone: "primary",
    summary: "Consultant urology OPD for kidney, bladder and prostate concerns.",
    lead: {
      label: "Consultant",
      name: "Dr Ajay Agarwal",
      meta: "MBBS, MS, DNB (Urology)",
      doctorSlug: "ajay-agarwal",
    },
    capabilityLabel: "Available Here",
    capabilities: ["Urology consultation"],
    primaryAction: {
      label: "Book Department OPD",
      href: "/appointment?department=urology",
    },
    secondaryAction: { label: "View Details", href: "/departments/urology" },
    opd: [
      { label: "OPD Days", value: "Monday to Saturday" },
      { label: "OPD Timing", value: "12:00 PM - 1:00 PM" },
      { label: "Chamber", value: "OPD 2" },
    ],
  },
  {
    slug: "neurology",
    name: "Neurology",
    shortName: "Neurology",
    badge: "3 Consultants",
    category: "medical",
    icon: "brain",
    tone: "primary",
    summary: "Neuro physician OPD with on-call cover through the week.",
    lead: {
      label: "Consultant",
      name: "Dr S. Narayan",
      meta: "Consultant Neuro Physician",
      doctorSlug: "s-narayan",
    },
    capabilityLabel: "Available Here",
    capabilities: ["Neuro physician consultation", "On-call neurology cover"],
    primaryAction: {
      label: "Book Department OPD",
      href: "/appointment?department=neurology",
    },
    secondaryAction: { label: "View Details", href: "/departments/neurology" },
    opd: [
      { label: "OPD Days", value: "Monday to Saturday" },
      { label: "OPD Timing", value: "3:30 PM - 4:30 PM" },
      { label: "Chamber", value: "OPD 2" },
    ],
  },
  {
    slug: "plastic-surgery",
    name: "Plastic & Cosmetic Surgery",
    shortName: "Plastic Surgery",
    badge: "On Call",
    category: "surgical",
    icon: "scalpel",
    tone: "primary",
    summary: "Plastic, cosmetic and reconstructive surgery consultation on call.",
    lead: {
      label: "Consultant",
      name: "Dr V. S. P. Sinha",
      meta: "Consultant Plastic Surgeon",
      doctorSlug: "v-s-p-sinha",
    },
    capabilityLabel: "Available Here",
    capabilities: ["Plastic & cosmetic surgery consultation"],
    primaryAction: {
      label: "Book Department OPD",
      href: "/appointment?department=plastic-surgery",
    },
    secondaryAction: {
      label: "View Details",
      href: "/departments/plastic-surgery",
    },
    opd: [
      { label: "OPD Days", value: "Monday to Saturday (on call)" },
      { label: "OPD Timing", value: "On call, from 10:00 AM" },
      { label: "Chamber", value: "Assigned at reception" },
    ],
  },
  {
    slug: "psychiatry",
    name: "Psychiatry",
    shortName: "Psychiatry",
    badge: "On Call",
    category: "medical",
    icon: "brain",
    tone: "primary",
    summary: "Consultant psychiatry OPD, available on call each evening.",
    lead: {
      label: "Consultant",
      name: "Dr D. K. Giri",
      meta: "Consultant Psychiatrist",
      doctorSlug: "d-k-giri",
    },
    capabilityLabel: "Available Here",
    capabilities: ["Psychiatry consultation"],
    primaryAction: {
      label: "Book Department OPD",
      href: "/appointment?department=psychiatry",
    },
    secondaryAction: { label: "View Details", href: "/departments/psychiatry" },
    opd: [
      { label: "OPD Days", value: "Monday to Saturday (on call)" },
      { label: "OPD Timing", value: "On call, from 7:00 PM" },
      { label: "Chamber", value: "Assigned at reception" },
    ],
  },
  {
    slug: "pain-management",
    name: "Pain Management & Anaesthesia",
    shortName: "Pain Management",
    badge: "On Call",
    category: "medical",
    icon: "hand-heart",
    tone: "primary",
    summary:
      "Pain management and anaesthesia consultation for chronic and post-operative pain.",
    lead: {
      label: "Consultant",
      name: "Dr Ashok Jadon",
      meta: "Pain Management & Consultant Anaesthetist",
      doctorSlug: "ashok-jadon",
    },
    capabilityLabel: "Available Here",
    capabilities: ["Pain management consultation", "Anaesthesia services"],
    primaryAction: {
      label: "Book Department OPD",
      href: "/appointment?department=pain-management",
    },
    secondaryAction: {
      label: "View Details",
      href: "/departments/pain-management",
    },
    opd: [
      { label: "OPD Days", value: "Monday to Saturday (on call)" },
      { label: "OPD Timing", value: "On call, from 2:00 PM" },
      { label: "Chamber", value: "OPD 1" },
    ],
  },
  {
    slug: "neonatology",
    name: "NICU & Neonatology",
    shortName: "NICU",
    badge: "Modern NICU",
    category: "critical-care",
    icon: "baby",
    tone: "primary",
    summary:
      "Neonatal intensive care with a four-consultant team on call around the clock.",
    lead: {
      label: "Consultants",
      name: "Neonatology Team",
      meta: "Dr Mohan Thakur, Dr Navin Kumar, Dr Subhendhu Mandal, Dr Esther Nimisha",
    },
    capabilityLabel: "Available Here",
    capabilities: ["Modern NICU", "On-call neonatology cover"],
    primaryAction: {
      label: "Book Department OPD",
      href: "/appointment?department=neonatology",
    },
    secondaryAction: { label: "View Details", href: "/departments/neonatology" },
    opd: [
      { label: "Availability", value: "Monday to Saturday (on call)" },
      { label: "Cover", value: "24x7 NICU" },
      { label: "Chamber", value: "Assigned at reception" },
    ],
  },
];

export function getDepartment(slug: string): Department | undefined {
  return departments.find((d) => d.slug === slug);
}

export const departmentOptions = departments.map((d) => ({
  value: d.slug,
  label: d.name,
}));
