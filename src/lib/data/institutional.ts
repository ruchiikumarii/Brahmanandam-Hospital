/**
 * Institutional content sourced from the live hospital site
 * (sonari.brahmanandamhospital.in) — leadership messages, patient-care
 * policies, CSR, careers and FAQs.
 */

export type ContentBlock = {
  heading?: string;
  paragraphs?: string[];
  points?: string[];
  /** Rendered as a numbered list instead of bullets. */
  numbered?: boolean;
};

/* ------------------------------------------------------------- Leadership */

export const chairmanMessage = {
  name: "Mr. Monu Bhattacharya",
  role: "Chairman",
  organisation: "Brahmanandam Hospital, Sonari",
  initials: "MB",
  paragraphs: [
    "At Brahmanandam Hospital, Sonari, we believe healthcare is not just a service but a responsibility toward society. Our institution was founded on the principles of compassion, integrity, and dedication to human well-being.",
    "Our core mission is to make quality medical care accessible to everyone, supported by ethical medical practices, advanced healthcare facilities, and a patient-centered approach. Every doctor, nurse and healthcare professional here is committed to delivering treatment that meets the highest standards.",
    "Beyond clinical operations, we engage in community-focused activities including health camps and awareness initiatives designed to enhance societal wellness.",
    "I extend my sincere gratitude to our patients and the community for the confidence they place in us. We reaffirm our commitment to compassionate healthcare and to building a healthier future for all.",
  ],
};

export const ceoMessage = {
  name: "M. Srinivas Rao",
  role: "Chief Executive Officer",
  organisation: "Brahmanandam Hospital, Sonari",
  initials: "SR",
  paragraphs: [
    "Our mission at Brahmanandam Hospital, Sonari is to deliver compassionate, reliable, and high-quality healthcare. Healthcare is not only about treatment - it is about building trust, and about the comfort and dignity of every person who walks through our doors.",
    "Our physicians and staff provide patient-centered care backed by continuous facility upgrades, the adoption of modern technology, and steadily improving clinical practices.",
    "Beyond hospital operations, we focus on community health awareness, preventive care initiatives, and quality medical support for the region we serve.",
    "I thank every patient and family for the trust and support they have placed in Brahmanandam Hospital, Sonari.",
  ],
};

export const leadership = [
  {
    name: chairmanMessage.name,
    role: "Chairman",
    initials: chairmanMessage.initials,
    summary:
      "Guides the hospital's founding principles of compassion, integrity and dedication to human well-being, with a focus on making quality medical care accessible to everyone.",
    href: "/chairmans-message",
  },
  {
    name: ceoMessage.name,
    role: "Chief Executive Officer",
    initials: ceoMessage.initials,
    summary:
      "Leads day-to-day operations, clinical quality and technology adoption, alongside community health awareness and preventive care initiatives.",
    href: "/ceo-message",
  },
];

/* ------------------------------------------------ Mission, vision, values */

export const mission =
  "To deliver high-quality, patient-centered healthcare with compassion and professionalism, ensuring that the people of Sonari and surrounding regions receive reliable and advanced medical care close to home.";

export const vision =
  "To become a trusted healthcare institution known for excellence in medical services, modern facilities, and a commitment to improving the health and well-being of the community through continuous advancement and innovation.";

export const coreValues = [
  {
    name: "Quality",
    text: "Delivering safe, effective, and high-standard healthcare services.",
    icon: "shield-check",
  },
  {
    name: "Compassion",
    text: "Treating every patient with kindness, empathy, and respect.",
    icon: "hand-heart",
  },
  {
    name: "Integrity",
    text: "Maintaining honesty, transparency, and ethical medical practices.",
    icon: "scale",
  },
  {
    name: "Teamwork",
    text: "Working together as healthcare professionals to provide the best care.",
    icon: "users",
  },
  {
    name: "Service",
    text: "Dedicated to serving patients and the community with commitment.",
    icon: "heart",
  },
  {
    name: "Innovation",
    text: "Continuously improving through modern medical practices and technology.",
    icon: "sparkle",
  },
  {
    name: "Responsibility",
    text: "Ensuring responsible use of resources for the benefit of patients and society.",
    icon: "clipboard-check",
  },
];

/* --------------------------------------------------------- Quality & safety */

export const qualityFocusAreas = [
  {
    title: "Regulatory Compliance and Standards",
    text: "Following healthcare guidelines and regulations applicable to hospital practice.",
    icon: "clipboard-check",
  },
  {
    title: "Clinical Risk Management",
    text: "Identifying and reducing potential risks in patient care before they cause harm.",
    icon: "shield-check",
  },
  {
    title: "Data and Information Management",
    text: "Maintaining accurate, complete and confidential medical records.",
    icon: "scan",
  },
  {
    title: "Environmental Health and Safety",
    text: "Creating secure, clean spaces for patients, visitors and staff.",
    icon: "wind",
  },
  {
    title: "Infection Prevention and Control",
    text: "Implementing strict protocols across wards, theatres and critical care.",
    icon: "droplet",
  },
  {
    title: "Patient Safety",
    text: "Protecting patient well-being at every step of the care pathway.",
    icon: "heart",
  },
  {
    title: "Quality Training and Education",
    text: "Regular professional development programmes for clinical and support teams.",
    icon: "graduation-cap",
  },
  {
    title: "Continuous Quality Improvement",
    text: "Regular audits and process enhancements based on measured outcomes.",
    icon: "activity",
  },
];

/* ------------------------------------------------------- Admission process */

export const admissionProcess: ContentBlock[] = [
  {
    paragraphs: [
      "At Brahmanandam Hospital, Sonari, compassionate service and ethical healthcare are the foundation of good medical practice. Our objective is to ensure a smooth experience for patients and their families, with clear medical guidance at every step.",
    ],
  },
  {
    heading: "Registration",
    paragraphs: [
      "Patients must complete registration at the Reception Desk on the ground floor before receiving consultation or treatment. This applies to both outpatient and inpatient services.",
      "The reception operates around the clock. Please bring your registration documents to each visit.",
    ],
  },
  {
    heading: "Admission Procedure",
    paragraphs: [
      "Admissions recommended by a doctor require completion of formalities at the Admission Counter. Emergency situations may involve admission directly through the Emergency Department.",
      "Basic medical and personal information is collected during this process, which takes approximately 30 minutes. An advance deposit may be requested, and your doctor will communicate the expected duration of hospitalisation.",
    ],
  },
  {
    heading: "Corporate & Insurance Patients",
    paragraphs: ["Please carry the following documentation:"],
    points: [
      "Authorization letter from your employer or insurer",
      "Valid identification and insurance documents",
      "Third Party Administrator (TPA) approvals",
    ],
  },
  {
    heading: "Room Types Available",
    paragraphs: [
      "Room assignment depends on availability and medical requirement.",
    ],
    points: [
      "General Ward",
      "Semi-Private Room",
      "Private Room",
      "ICU / Critical Care Units",
      "Deluxe Rooms",
    ],
  },
  {
    heading: "Billing and Payment",
    paragraphs: [
      "The final bill covers hospital stay, medicines, consumables, diagnostic tests, medical procedures and doctor consultation fees. We recommend requesting regular payment updates during hospitalisation.",
    ],
    points: [
      "Cash",
      "Debit Cards",
      "Credit Cards",
      "Online Payment / Bank Transfer",
      "Demand Draft",
    ],
  },
  {
    heading: "Medical Treatment & Team",
    paragraphs: [
      "Your treatment involves specialist doctors, resident medical officers, nursing staff, laboratory professionals and support personnel. Doctors will recommend appropriate tests, diagnostics, medication, treatment and a recovery plan.",
    ],
  },
  {
    heading: "Additional Policies",
    points: [
      "Patient consent is required for certain procedures",
      "Fresh linen and bedding are provided",
      "The hospital is not responsible for valuables",
      "Mobile phone usage is limited in critical care areas",
      "Medicines are supplied through the hospital pharmacy",
      "No smoking anywhere on the premises",
      "Designated parking areas are available",
    ],
  },
];

/* ------------------------------------------------------- Discharge process */

export const dischargeProcess: ContentBlock[] = [
  {
    paragraphs: [
      "Once your treating doctor gives medical clearance, the discharge procedure begins with documentation in your medical records and notification to the Billing Department. Please allow approximately 2 hours for the hospital to complete the discharge formalities.",
    ],
  },
  {
    heading: "Before You Leave",
    paragraphs: ["Patients or relatives should:"],
    points: [
      "Finalise payment and obtain the receipt",
      "Collect the discharge summary and medical reports",
      "Collect prescribed medication and post-care instructions",
      "Review the physician's guidance on recovery, diet and medication adherence",
    ],
  },
  {
    heading: "Medico-Legal Cases (MLC)",
    paragraphs: [
      "The hospital adheres to Government of India regulations for cases classified as medico-legal matters, which may involve police documentation and formal procedures.",
    ],
  },
  {
    heading: "Birth & Death Certificates",
    paragraphs: [
      "The hospital can issue temporary certificates for immediate use. The official birth or death certificate must be obtained from the respective municipal authority as per government regulations.",
    ],
  },
  {
    heading: "Medical Certificates",
    paragraphs: [
      "Treating physicians issue medical certificates during working hours (9:00 AM – 5:00 PM) on regular weekdays, based on clinical documentation.",
    ],
  },
  {
    heading: "Wheelchairs & Patient Assistance",
    paragraphs: [
      "Mobility equipment and staff support are available for outpatient and in-hospital navigation.",
    ],
  },
  {
    heading: "Patient Feedback",
    paragraphs: [
      "We welcome patient and family input through feedback forms distributed by our staff. Guardians are welcome to provide feedback on behalf of children or elderly patients.",
    ],
  },
  {
    heading: "Our Commitment",
    paragraphs: [
      "The institution prioritises compassionate healthcare, transparent processes, and a comfortable experience for every patient.",
    ],
  },
];

/* ----------------------------------------------------- Visitor guidelines */

export const visitorGuidelines = [
  "Smoking is strictly prohibited anywhere within the hospital premises.",
  "Visitors are requested not to operate medical equipment such as oxygen or vacuum units.",
  "Washing of personal clothes within the hospital premises is not permitted.",
  "Visitors are kindly requested not to offer tips or gifts to hospital staff.",
  "All hospital payments and billing transactions must be made only at the official billing or cash counter against a valid receipt.",
  "Payments can be made through cash, bank draft, debit cards, or credit cards. Personal cheques are not accepted.",
  "Visitors are requested to maintain silence inside the hospital premises to ensure a peaceful healing environment.",
  "Visitors must strictly follow hospital visiting hours and regulations to avoid disturbing patient care.",
  "Vehicles should be parked only in the designated visitor parking area.",
  "Visitors should not sit or lie on patient beds or rest on patient room floors.",
  "Entry into restricted areas such as nursing stations, utility rooms, kitchens, and other operational departments is not allowed.",
  "Visitors should avoid bringing outside food or beverages into patient rooms unless permitted by the treating doctor.",
  "To prevent infections or allergic reactions, flowers are not allowed inside patient rooms.",
  "Visitors are not permitted to administer medicines or medical treatments to patients.",
  "Consumption of alcohol, tobacco, or illegal substances is strictly prohibited inside the hospital.",
  "Children below the age of 13 years are generally not allowed to visit patients.",
  "For infection control and patient safety, only one attendant may stay with the patient at a time, except during official visiting hours.",
  "Visitors are requested to switch off or silence mobile phones in patient areas and critical care units such as ICU or emergency zones, as they may interfere with sensitive medical equipment.",
  "Please avoid bringing valuable items such as jewellery, large amounts of cash, or expensive devices. The hospital will not be responsible for any loss or misplacement.",
  "Use of candles, incense sticks, matchboxes, lighters, or similar items is strictly prohibited due to fire safety regulations.",
  "Visitors entering isolation wards must follow the infection control guidelines provided by nursing staff.",
  "Nursing staff may limit the number of visitors depending on the medical condition of the patient.",
  "Visitors are requested to cooperate with hospital security staff and lift operators for smooth movement within the premises.",
  "For safety reasons, visitors are encouraged to use staircases while coming down whenever possible.",
];

/* -------------------------------------------------------- Patient rights */

export const patientRights = [
  {
    title: "Respect and Dignity",
    text: "Every patient is treated with respect, compassion, and dignity in a safe and clean environment, without regard to background or circumstance.",
    icon: "hand-heart",
  },
  {
    title: "Identification of Healthcare Providers",
    text: "Patients may know the names and roles of the doctors, nurses, and other healthcare professionals involved in their care.",
    icon: "stethoscope",
  },
  {
    title: "Privacy and Confidentiality",
    text: "Full protection of privacy during medical examinations, with medical information kept confidential.",
    icon: "shield-check",
  },
  {
    title: "Clear Medical Information",
    text: "Doctors provide clear and understandable explanations regarding diagnosis, treatment options, risks, benefits and expected outcomes.",
    icon: "clipboard-check",
  },
  {
    title: "Safety and Protection",
    text: "Patients are protected from any form of physical abuse, neglect, or discrimination.",
    icon: "heart",
  },
  {
    title: "Information About Treatment Costs",
    text: "Transparent information about the expected cost of treatment, hospital charges, and payment policies.",
    icon: "credit-card",
  },
  {
    title: "Access to Medical Records",
    text: "Patients may request and receive copies of medical records and treatment documents.",
    icon: "scan",
  },
];

/* ------------------------------------------------------ Patient services */

export const patientSupportServices = [
  {
    title: "Pharmacy (24×7 Chemist Shop)",
    text: "A round-the-clock pharmacy offering medications and medical supplies for patients and residents.",
    icon: "pill",
    note: "Open 24 hours",
  },
  {
    title: "Blood Bank Services",
    text: "The hospital coordinates with blood banking to provide safe and screened blood and blood components whenever needed.",
    icon: "droplet",
    note: "Screened & safe",
  },
  {
    title: "Ambulance Services",
    text: "Emergency transportation equipped with critical care capabilities, with a team trained for urgent situations.",
    icon: "ambulance",
    note: "Call 8271827999",
  },
  {
    title: "Laundry Services",
    text: "Professional laundry management handles patient clothing and linen; personal washing on the premises is not permitted.",
    icon: "wind",
    note: "In-house",
  },
  {
    title: "Patient Assistance & Support",
    text: "Wheelchairs, stretchers and bedding arrangements are available for patient comfort throughout the stay.",
    icon: "person-standing",
    note: "On request",
  },
  {
    title: "Safe Drinking Water",
    text: "Purified drinking water is available throughout the hospital for patients and attendants.",
    icon: "droplets",
    note: "All floors",
  },
  {
    title: "Cafeteria",
    text: "Food service for attendants and visitors, with limited late-night availability.",
    icon: "clipboard-check",
    note: "7:30 AM – 10:00 PM",
  },
];

/* ------------------------------------------------------------------- CSR */

export const csrVision =
  "To build a healthier and more aware society by delivering accessible healthcare, supporting underprivileged communities, and promoting preventive care.";

export const csrInitiatives = [
  {
    title: "Free Health Check-Up Camps",
    text: "Regular complimentary medical camps in nearby areas providing health screenings, consultations and medical advice to underserved populations.",
    icon: "stethoscope",
  },
  {
    title: "Community Health Awareness Programs",
    text: "Educational drives addressing heart health, diabetes management, women's health, child healthcare, and hygiene and sanitation practices.",
    icon: "graduation-cap",
  },
  {
    title: "Women & Child Health Support",
    text: "Specialised programmes offering consultations, screenings and awareness initiatives targeting women's and children's well-being.",
    icon: "baby",
  },
  {
    title: "Support for Underprivileged Patients",
    text: "Affordable treatment options and participation in charitable healthcare initiatives for economically disadvantaged groups.",
    icon: "hand-heart",
  },
  {
    title: "Emergency & Social Support Services",
    text: "Active participation in community emergency response and timely medical assistance during crises.",
    icon: "siren",
  },
];

/* --------------------------------------------------------------- Careers */

export const careers = {
  heading: "Careers at Brahmanandam Hospital, Sonari",
  intro:
    "Brahmanandam Hospital, Sonari offers a supportive and professional environment where medical and non-medical professionals can develop their abilities.",
  invitation:
    "Interested candidates are invited to send their updated resume to the contact details below.",
  applyEmail: "care@brahmanandamhospital.com",
  applyPhone: "+91 82718 27999",
};

/* ------------------------------------------------------------------ FAQs */

export const faqs = [
  {
    q: "Where is Brahmanandam Hospital located?",
    a: "Brahmanandam Hospital is located at 184, Near Road No. 3, Kagal Nagar, Sonari, Jamshedpur, Jharkhand – 831011.",
  },
  {
    q: "What are the hospital's working hours?",
    a: "The hospital operates 24×7 emergency services, with OPD consultations available during standard hours.",
  },
  {
    q: "How can I book an appointment?",
    a: "Patients may schedule visits by calling +91 82718 27999, visiting reception, or using the website's online booking system.",
  },
  {
    q: "What medical services are available at the hospital?",
    a: "The hospital provides multi-speciality services including General Medicine, Cardiology, Orthopedics, Gynecology, Pediatrics, Radiology, Pathology, and Emergency Care.",
  },
  {
    q: "Do you have specialist doctors available?",
    a: "Yes, experienced specialists operate across multiple departments to deliver comprehensive medical care.",
  },
  {
    q: "Is online doctor consultation available?",
    a: "Yes, we offer online consultation services for selected specialties. Please contact our team for details.",
  },
];

/* -------------------------------------------- TPA & insurance empanelment */

export const tpaPartners = [
  "Bajaj Allianz General Insurance",
  "Star Health and Allied Insurance",
  "ICICI Lombard General Insurance",
  "HDFC ERGO General Insurance",
  "Medi Assist India TPA Pvt. Ltd.",
  "MDIndia Healthcare Services",
  "Paramount Health Services TPA",
  "TTK Healthcare TPA Pvt. Ltd.",
  "Raksha TPA Pvt. Ltd.",
  "Vipul MedCorp TPA",
  "Family Health Plan Ltd.",
  "Heritage Health TPA Pvt. Ltd.",
  "Reliance General Insurance",
  "National Insurance Company Ltd.",
  "United India Insurance Company Ltd.",
  "Oriental Insurance Company Ltd.",
  "Universal Sompo General Insurance",
];

export const cashlessProcess: ContentBlock[] = [
  {
    heading: "Cashless Mediclaim Facility",
    paragraphs: [
      "Brahmanandam Hospital, Sonari provides cashless treatment facilities through various insurance companies and Third Party Administrators (TPAs). Cashless treatment is offered to patients holding a valid health insurance policy, subject to insurance company approval and policy coverage limits.",
    ],
  },
  {
    heading: "Pre-Admission & Cashless Authorization",
    paragraphs: [
      "For planned admissions, a Pre-Authorization Request Form is submitted to the insurance company or TPA for approval before treatment begins.",
    ],
  },
  {
    heading: "Emergency Hospitalization",
    paragraphs: [
      "Emergency treatment will never be delayed for insurance approval when the patient's life or health is at risk. A temporary deposit may be required pending authorisation.",
    ],
  },
  {
    heading: "Documents Required at Discharge",
    points: [
      "Pre-authorization form",
      "Approval letter from the insurer or TPA",
      "Medical reports and investigation records",
      "Prescriptions",
      "Discharge summary",
      "Billing receipts",
    ],
  },
];

/* -------------------------------------------------- Full clinical roster */

/** Every speciality listed on the hospital's live site. */
export const clinicalDirectory: {
  name: string;
  href?: string;
  badge?: "Trending" | "New";
}[] = [
  { name: "Orthopedic", href: "/departments/orthopaedics-trauma-surgery" },
  { name: "Neuro Physician", badge: "Trending" },
  { name: "Pulmonology" },
  { name: "Nephrology", badge: "New" },
  { name: "General Surgeon", href: "/departments/general-laparoscopic-surgery" },
  { name: "Gynecologist", href: "/departments/obstetrics-gynaecology" },
  { name: "ENT", badge: "Trending" },
  { name: "Neuro Surgeon" },
  { name: "Urology", href: "/departments/general-laparoscopic-surgery" },
  {
    name: "Ortho & Spine Surgeon",
    href: "/departments/orthopaedics-trauma-surgery",
    badge: "Trending",
  },
  { name: "Emergency Medicine", href: "/departments/emergency-trauma-care" },
  { name: "Radiology", href: "/departments/diagnostic-imaging-pathology", badge: "New" },
  { name: "Plastic, Cosmetic & Hair Transplant Surgeon" },
  {
    name: "Gastro & Laparoscopic Surgery",
    href: "/departments/general-laparoscopic-surgery",
    badge: "Trending",
  },
  { name: "Pediatrician", href: "/departments/paediatrics-neonatal-care" },
  { name: "Anesthesia & Pain Relief" },
  { name: "Dentist", badge: "Trending" },
  { name: "Nuclear Medicine" },
  { name: "X-ray, Ultrasound", href: "/departments/diagnostic-imaging-pathology" },
  { name: "Positron Emission Tomography" },
];

/* ---------------------------------------------- Homepage service blurbs */

export const coreServiceBlurbs = [
  {
    title: "General Medicine",
    text: "Our General Medicine department provides comprehensive care for a wide range of health conditions, including fever, infections, diabetes, hypertension, and lifestyle-related diseases.",
    icon: "stethoscope",
    href: "/departments/general-medicine-diabetology",
  },
  {
    title: "Emergency & Critical Care",
    text: "Our Emergency and Critical Care unit operates 24×7 to provide immediate medical attention during life-threatening situations, cardiac arrest, trauma, and critical illnesses.",
    icon: "siren",
    href: "/departments/emergency-trauma-care",
  },
  {
    title: "Cardiology & Heart Care",
    text: "The Cardiology department at Brahmanandam Hospital offers specialized care for heart-related conditions such as chest pain, hypertension, heart attacks, and cardiac disorders.",
    icon: "heart-pulse",
    href: "/departments/cardiology",
  },
  {
    title: "Orthopedics",
    text: "Our Orthopedics department specializes in the diagnosis and treatment of bone, joint, and musculoskeletal conditions. We manage fractures, arthritis, back pain, sports injuries, and other orthopedic issues with precision and care.",
    icon: "bone",
    href: "/departments/orthopaedics-trauma-surgery",
  },
  {
    title: "Gynecology & Women's Health",
    text: "We provide comprehensive healthcare services for women at every stage of life. Our Gynecology department offers care for pregnancy, menstrual disorders, infertility issues, and overall reproductive health.",
    icon: "baby",
    href: "/departments/obstetrics-gynaecology",
  },
  {
    title: "Radiology & Diagnostics",
    text: "Our Radiology and Diagnostics department is equipped with modern technology to provide accurate and timely diagnostic services. We offer imaging and testing services that help doctors identify health conditions effectively.",
    icon: "scan",
    href: "/departments/diagnostic-imaging-pathology",
  },
];

export const aboutHospital =
  "Brahmanandam Hospital, Sonari is a trusted multi-speciality healthcare provider dedicated to delivering quality, affordable, and compassionate medical care to the people of Jamshedpur and surrounding regions. With a strong commitment to patient well-being, our hospital combines modern medical technology, experienced doctors, and a patient-first approach to ensure the best possible treatment outcomes.";

/* ------------------------------------------------- About Us page (verbatim) */

export const aboutUsHeadline = "We're Setting the New Standards";

export const aboutKeyPoints = [
  "Equipped for all stages of care, from prevention to rehabilitation",
  "Quality assessment program helps ensure smooth, effective operation",
  "Prepared to treat a high volume of trauma patients 24/7",
];

/* ------------------------------------------------- Our Directors (verbatim) */

export const directorsIntro =
  "At Brahmanandam Hospital, Sonari, our leadership team is driven by a shared vision of delivering compassionate, ethical, and high-quality healthcare.";

/* ------------------------------------------------------- Homepage (verbatim) */

export const homeHeadline =
  "Dedicated Medicare with Leading Doctors Diagnostic Center";

export const emergencyHeadline =
  "Your Trusted Multi-Speciality Hospital in Sonari, Jamshedpur";

export const emergencySubhead =
  "Delivering Expert Care with Compassion - 24×7";

export const openingHours = [
  { days: "Monday – Friday", hours: "Open 24 Hours" },
  { days: "Saturday – Sunday", hours: "Open 24 Hours" },
];

/* --------------------------------------------------------- Footer (verbatim) */

export const footerAbout =
  "We offer 24×7 emergency services, OPD consultations, diagnostic facilities, and preventive healthcare under one roof.";

export const footerCompanyLinks = [
  { label: "Our Directors", href: "/our-directors" },
  { label: "CSR", href: "/csr" },
  { label: "Doctors", href: "/doctors" },
  { label: "Book Appointment", href: "/appointment" },
];

export const footerQuickLinks = [
  { label: "About us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Careers", href: "/careers" },
  { label: "Insurance", href: "/insurance" },
  { label: "FAQ", href: "/faq" },
];

/* ------------------------------------------------- Preventive health checks */

/**
 * Package *scope* only. The hospital has not published prices, so every card
 * routes the visitor to the helpdesk rather than showing an invented figure.
 */
export const healthPackages = [
  {
    name: "Basic Health Check",
    forWhom: "Adults 18+, first-time screening",
    icon: "clipboard-check",
    includes: [
      "Complete Blood Count (CBC)",
      "Blood Sugar - Fasting",
      "Urine Routine Examination",
      "Blood Pressure & BMI assessment",
      "Physician consultation & report review",
    ],
  },
  {
    name: "Diabetes Care Package",
    forWhom: "Known diabetics & anyone with a family history",
    icon: "droplet",
    includes: [
      "HbA1c (3-month glucose average)",
      "Fasting & Post-Prandial Blood Sugar",
      "Kidney Function Test (KFT)",
      "Lipid Profile",
      "Diabetic foot screening",
      "Diabetologist consultation",
    ],
  },
  {
    name: "Cardiac Screening",
    forWhom: "Adults 35+, or with chest pain / hypertension",
    icon: "heart-pulse",
    includes: [
      "Electrocardiogram (ECG)",
      "2D Echocardiography",
      "Treadmill Test (TMT)",
      "Lipid Profile",
      "Blood Pressure evaluation",
      "Cardiologist consultation",
    ],
  },
  {
    name: "Women's Health Package",
    forWhom: "Women of all ages",
    icon: "person-standing",
    includes: [
      "Complete Blood Count & Haemoglobin",
      "Thyroid Profile",
      "Pap Smear (cervical screening)",
      "Pelvic Ultrasound",
      "Calcium & Vitamin D",
      "Gynaecologist consultation",
    ],
  },
  {
    name: "Senior Citizen Check-up",
    forWhom: "Adults 60+",
    icon: "hand-heart",
    includes: [
      "Complete Blood Count & Blood Sugar",
      "Kidney & Liver Function Tests",
      "Lipid Profile & Thyroid Profile",
      "ECG and Chest X-Ray",
      "Bone health & fall-risk assessment",
      "Physician consultation with priority assistance",
    ],
  },
  {
    name: "Executive Health Check",
    forWhom: "Working professionals, annual corporate screening",
    icon: "graduation-cap",
    includes: [
      "Comprehensive blood panel",
      "Liver & Kidney Function Tests",
      "Lipid Profile & Thyroid Profile",
      "ECG, Chest X-Ray and Ultrasound Abdomen",
      "Vision and BMI assessment",
      "Consolidated physician review",
    ],
  },
];
