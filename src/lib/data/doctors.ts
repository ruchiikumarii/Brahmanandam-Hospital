export type OpdWindow = "morning" | "evening" | "both";

export type Doctor = {
  slug: string;
  name: string;
  shortName: string;
  photo: string;
  profilePhoto?: string;
  specialty: string;
  specialtyLabel: string;
  departmentSlug: string;
  qualification: string;
  qualificationShort: string;
  roleLabel: string;
  designation: string;
  headline: string;
  experienceYears: number;
  rating: number;
  reviews: number;
  days: string[];
  daysLabel: string;
  opdWindow: OpdWindow;
  opdTiming: string;
  opdShort: string;
  chamber: string;
  chamberShort: string;
  nextSlot: string;
  tags: string[];
  about: string[];
  highlights: { title: string; text: string }[];
  expertise: { title: string; text: string }[];
  education: {
    code: string;
    degree: string;
    institute: string;
    note: string;
    accent?: boolean;
  }[];
  schedule: {
    label: string;
    time: string;
    days: string;
    badge: string;
    tone: "primary" | "secondary" | "muted";
  }[];
  testimonials: {
    initials: string;
    name: string;
    location: string;
    when: string;
    text: string;
  }[];
  metrics: { value: string; label: string; tone: "primary" | "secondary" }[];
  emergency: { title: string; text: string; cta: string };
};

export const doctors: Doctor[] = [
  {
    slug: "rajeev-ranjan",
    name: "Dr. Rajeev Ranjan",
    shortName: "Dr. R. Ranjan",
    photo: "/images/doctors/rajeev-ranjan.jpg",
    profilePhoto: "/images/doctors/rajeev-ranjan-profile.jpg",
    specialty: "Cardiology",
    specialtyLabel: "Cardiology",
    departmentSlug: "cardiology",
    qualification: "MBBS, MD (General Medicine), DM (Cardiology), FESC",
    qualificationShort: "MBBS, MD, DM (Cardiology)",
    roleLabel: "Cardiologist",
    designation:
      "Senior Consultant Interventional Cardiologist & Head of Cardiac Sciences",
    headline: "Senior Consultant Interventional Cardiologist",
    experienceYears: 15,
    rating: 4.9,
    reviews: 142,
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    daysLabel: "Mon - Sat",
    opdWindow: "both",
    opdTiming: "10:00 AM - 01:30 PM • 04:00 PM - 07:00 PM",
    opdShort: "Mon – Sat (10 AM – 2 PM)",
    chamber: "Chamber #4, Block A",
    chamberShort: "Chamber #04 (First Floor)",
    nextSlot: "Today, 04:30 PM",
    tags: [
      "AIIMS Alumnus",
      "Fellow of European Society (FESC)",
      "Cashless Insurance Accepted",
    ],
    about: [
      "Dr. Rajeev Ranjan is a renowned interventional cardiologist with over fifteen years of advanced clinical experience spanning complex adult interventions, heart failure management, and acute coronary emergencies in Eastern India. He serves as the Head of Cardiac Sciences at Brahmanandam Multi Specialty Centre, Sonari.",
      "Prior to his leadership role at Brahmanandam Hospital, Dr. Ranjan held academic and clinical responsibilities as an Assistant Professor of Cardiology at premier tertiary teaching institutes. He has pioneered transradial interventional procedures in Jamshedpur, allowing patients minimal invasiveness, reduced bleeding risk, and significantly accelerated discharge cycles.",
      "His clinical philosophy emphasizes evidence-based, compassionate care: prioritizing preventive measures, thorough diagnostic precision, and meticulous therapeutic follow-ups for each heart patient.",
    ],
    highlights: [
      {
        title: "Transradial Access",
        text: "Same-day mobilization for 90%+ angiographies.",
      },
      {
        title: "Door-to-Balloon",
        text: "Under 55-minute primary PCI emergency benchmark.",
      },
      {
        title: "Preventive Care",
        text: "Holistic cardiac rehabilitation protocols.",
      },
    ],
    expertise: [
      {
        title: "Coronary Angiography & PTCA",
        text: "Diagnostic angiography, drug-eluting stent (DES) placement, and balloon angioplasty with instant hemodynamic monitoring.",
      },
      {
        title: "Bifurcation Stenting & Rotablation",
        text: "Specialized handling of heavily calcified arteries, chronic total occlusions (CTO), and critical left main branch stenoses.",
      },
      {
        title: "Pacemakers & ICD Implants",
        text: "Single/dual chamber pacing, cardiac resynchronization therapy (CRT-D), and automated defibrillator implantation.",
      },
      {
        title: "Heart Failure & Rehabilitation",
        text: "Refractory heart failure protocols, guideline-directed medical therapy (GDMT), and phased exercise rehab.",
      },
      {
        title: "Hypertension & Lipid Control",
        text: "Specialized assessment for resistant secondary hypertension, dyslipidemia, and metabolic cardiovascular syndromes.",
      },
      {
        title: "2D/3D & Transesophageal Echo",
        text: "High-resolution echocardiography, TEE analysis for valvular anomalies, intracardiac thrombi, and congenital shunt detection.",
      },
    ],
    education: [
      {
        code: "DM",
        degree: "Doctorate of Medicine (DM) in Cardiology",
        institute: "All India Institute of Medical Sciences (AIIMS)",
        note: "Specialized in interventional coronary hemodynamics and pediatric congenital evaluations.",
      },
      {
        code: "MD",
        degree: "Doctor of Medicine (MD) in General Medicine",
        institute: "Patna Medical College & Hospital",
        note: "Graduated with University Honours; Gold Medal in Internal Medicine Therapeutics.",
      },
      {
        code: "MBBS",
        degree: "Bachelor of Medicine & Bachelor of Surgery (MBBS)",
        institute: "Ranchi University",
        note: "Distinction in Physiology, Pathology, and General Surgery modules.",
      },
      {
        code: "FESC",
        degree: "Fellow of the European Society of Cardiology (FESC)",
        institute: "European Society of Cardiology",
        note: "Conferred for significant professional contributions to clinical research and coronary interventions.",
        accent: true,
      },
    ],
    schedule: [
      {
        label: "Morning OPD",
        time: "10:00 AM – 01:30 PM",
        days: "Monday to Saturday",
        badge: "Walk-in & Priority Appt",
        tone: "primary",
      },
      {
        label: "Evening OPD",
        time: "04:00 PM – 07:00 PM",
        days: "Monday to Saturday",
        badge: "Fastest Slot Available",
        tone: "secondary",
      },
      {
        label: "Sunday Schedule",
        time: "Emergency On-Call",
        days: "Cardiac ICU & In-Patient Care",
        badge: "Emergency Only",
        tone: "muted",
      },
    ],
    testimonials: [
      {
        initials: "AK",
        name: "Alok K. Sharma",
        location: "Resident • Kagal Nagar, Sonari",
        when: "3 weeks ago",
        text: "Dr. Rajeev Ranjan handled my father's acute angioplasty when admitted through Sonari emergency. His calm guidance and swift stent procedure saved his life. Extremely grateful to Brahmanandam Hospital.",
      },
      {
        initials: "SM",
        name: "Sunita Mukherjee",
        location: "Resident • Kadma, Jamshedpur",
        when: "1 month ago",
        text: "Very thorough doctor. He explained the echocardiogram report in plain language without causing panic, and streamlined my BP medications. Minimal wait time at Chamber 4.",
      },
    ],
    metrics: [
      { value: "15+ Yrs", label: "Clinical Experience", tone: "primary" },
      { value: "6,500+", label: "Cath Lab Procedures", tone: "primary" },
      { value: "99.2%", label: "Interventional Efficacy", tone: "secondary" },
    ],
    emergency: {
      title: "Equipped with 24×7 Digital Flat-Panel Cath Lab & Cardiac ICU",
      text: "Dr. Rajeev Ranjan heads an advanced emergency team ready around the clock for primary angioplasties, acute cardiac arrest response, and multi-parameter cardiac ICU telemetry at our Sonari facility.",
      cta: "Cath Lab Hotline",
    },
  },
  {
    slug: "shreya-singh",
    name: "Dr. Shreya Singh",
    shortName: "Dr. S. Singh",
    photo: "/images/doctors/shreya-singh.jpg",
    specialty: "Obs & Gynae",
    specialtyLabel: "Obstetrics & Gynaecology",
    departmentSlug: "obstetrics-gynaecology",
    qualification: "MBBS, MS (Obs & Gynae), FICOG",
    qualificationShort: "MBBS, MS (Obs & Gynae)",
    roleLabel: "Gynaecologist",
    designation: "Senior Consultant Gynaecologist",
    headline: "Senior Consultant Gynaecologist & High-Risk Obstetrician",
    experienceYears: 12,
    rating: 4.8,
    reviews: 118,
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    daysLabel: "Mon - Sat",
    opdWindow: "morning",
    opdTiming: "10:00 AM - 02:00 PM (Morning Specialty Slot)",
    opdShort: "Mon – Sat (11 AM – 4 PM)",
    chamber: "Chamber #2, Block B (Maternity)",
    chamberShort: "Chamber #02 (Maternity Block)",
    nextSlot: "Today, 11:30 AM",
    tags: ["FICOG", "High-Risk Pregnancy Care", "Cashless Insurance Accepted"],
    about: [
      "Dr. Shreya Singh is a senior consultant gynaecologist and high-risk obstetrician with twelve years of dedicated experience in maternal-fetal medicine, painless delivery protocols, and minimally invasive gynaecological surgery at Brahmanandam Multi Specialty Centre, Sonari.",
      "She leads the maternity programme in Sonari, supported by a dedicated labour suite, round-the-clock anaesthesia cover, and a Level-II neonatal unit for immediate newborn stabilisation.",
      "Her practice centres on informed, unhurried counselling for every expectant mother, with transparent treatment plans and structured antenatal follow-up.",
    ],
    highlights: [
      {
        title: "Painless Delivery",
        text: "24×7 epidural analgesia cover in labour suites.",
      },
      {
        title: "Level-II NICU Backup",
        text: "Immediate neonatal stabilisation on-site.",
      },
      {
        title: "Laparoscopic Care",
        text: "Day-care minimally invasive gynae surgery.",
      },
    ],
    expertise: [
      {
        title: "Comprehensive Antenatal Care",
        text: "Structured trimester-wise monitoring, growth scans, and nutrition-led maternal wellness planning.",
      },
      {
        title: "Painless & High-Risk Delivery",
        text: "Epidural labour analgesia, twin gestation, and hypertensive pregnancy management.",
      },
      {
        title: "Laparoscopic Hysterectomy",
        text: "Keyhole hysterectomy and myomectomy with faster recovery and minimal scarring.",
      },
      {
        title: "Infertility Workup & PCOD",
        text: "Ovulation induction, hormonal profiling, and structured polycystic ovarian disease management.",
      },
      {
        title: "Adolescent & Menopause Clinic",
        text: "Menstrual disorder correction, bone health screening, and hormone replacement counselling.",
      },
      {
        title: "Colposcopy & Cancer Screening",
        text: "Pap smear, HPV testing, and early detection protocols for cervical pathology.",
      },
    ],
    education: [
      {
        code: "MS",
        degree: "Master of Surgery (MS) in Obstetrics & Gynaecology",
        institute: "Rajendra Institute of Medical Sciences",
        note: "Thesis on maternal outcomes in hypertensive disorders of pregnancy.",
      },
      {
        code: "MBBS",
        degree: "Bachelor of Medicine & Bachelor of Surgery (MBBS)",
        institute: "Patna Medical College & Hospital",
        note: "Distinction in Obstetrics and Clinical Pathology.",
      },
      {
        code: "FICOG",
        degree: "Fellow, Indian College of Obstetricians & Gynaecologists",
        institute: "FOGSI",
        note: "Recognised for clinical contribution to safe motherhood programmes.",
        accent: true,
      },
    ],
    schedule: [
      {
        label: "Morning OPD",
        time: "10:00 AM – 02:00 PM",
        days: "Monday to Saturday",
        badge: "Antenatal Priority",
        tone: "primary",
      },
      {
        label: "Maternity Rounds",
        time: "05:00 PM – 06:30 PM",
        days: "Monday to Saturday",
        badge: "In-Patient Only",
        tone: "secondary",
      },
      {
        label: "Sunday Schedule",
        time: "Emergency On-Call",
        days: "Labour Room & Obstetric Emergencies",
        badge: "Emergency Only",
        tone: "muted",
      },
    ],
    testimonials: [
      {
        initials: "PS",
        name: "Pooja Sharma",
        location: "Resident • Kadma, Jamshedpur",
        when: "2 weeks ago",
        text: "Dr. Shreya Singh handled my high-risk delivery with absolute calm and expertise. The post-operative cleanliness of rooms and transparent cashless insurance settlement made our stay worry-free.",
      },
      {
        initials: "RD",
        name: "Ritika Das",
        location: "Resident • Sonari, Jamshedpur",
        when: "1 month ago",
        text: "Every antenatal visit was unhurried and clearly explained. The painless delivery protocol worked exactly as she counselled us through.",
      },
    ],
    metrics: [
      { value: "12+ Yrs", label: "Clinical Experience", tone: "primary" },
      { value: "3,200+", label: "Deliveries Conducted", tone: "primary" },
      { value: "98.6%", label: "Maternal Safety Index", tone: "secondary" },
    ],
    emergency: {
      title: "24×7 Labour Suite, Obstetric ICU & Level-II Neonatal Unit",
      text: "Our maternity wing runs a round-the-clock labour suite with on-call anaesthetists, emergency caesarean readiness, and neonatal intensivist support at the Sonari campus.",
      cta: "Maternity Helpline",
    },
  },
  {
    slug: "amit-kumar",
    name: "Dr. Amit Kumar",
    shortName: "Dr. A. Kumar",
    photo: "/images/doctors/amit-kumar.jpg",
    specialty: "Orthopaedics",
    specialtyLabel: "Orthopaedics & Trauma",
    departmentSlug: "orthopaedics-trauma-surgery",
    qualification: "MBBS, MS (Ortho), Fellowship Arthroscopy",
    qualificationShort: "MBBS, MS (Ortho), Fellowship Arthroscopy",
    roleLabel: "Orthopaedic Surgeon",
    designation: "Joint Replacement Surgeon",
    headline: "Joint Replacement & Arthroscopy Surgeon",
    experienceYears: 10,
    rating: 4.9,
    reviews: 96,
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    daysLabel: "Mon - Sat",
    opdWindow: "both",
    opdTiming: "11:00 AM - 03:00 PM • 05:00 PM - 08:00 PM",
    opdShort: "Mon – Sat (4 PM – 7 PM)",
    chamber: "Chamber #6, Ground Floor",
    chamberShort: "Chamber #06 (Ground Floor)",
    nextSlot: "Today, 05:30 PM",
    tags: [
      "Arthroscopy Fellowship",
      "Joint Replacement",
      "Cashless Insurance Accepted",
    ],
    about: [
      "Dr. Amit Kumar is a joint replacement and arthroscopy surgeon with a decade of operative experience in computer-assisted arthroplasty, sports injury reconstruction, and complex trauma fixation at Brahmanandam Multi Specialty Centre, Sonari.",
      "He completed a dedicated arthroscopy fellowship and has since built a structured rehabilitation-first pathway, allowing most knee replacement patients to mobilise within twenty-four hours of surgery.",
      "His trauma practice covers polytrauma stabilisation, pelvi-acetabular fixation, and geriatric fragility fractures managed through the hospital's 24×7 emergency wing.",
    ],
    highlights: [
      {
        title: "Day-1 Mobilisation",
        text: "Structured rehab from the first post-op day.",
      },
      {
        title: "Keyhole Arthroscopy",
        text: "Ligament reconstruction with minimal scarring.",
      },
      { title: "Modular OT", text: "Laminar airflow theatre for arthroplasty." },
    ],
    expertise: [
      {
        title: "Total Knee & Hip Arthroplasty",
        text: "Computer-assisted primary and revision joint replacement with accelerated recovery pathways.",
      },
      {
        title: "Keyhole Arthroscopy",
        text: "ACL/PCL reconstruction, meniscal repair, and shoulder rotator cuff surgery.",
      },
      {
        title: "Complex Trauma Fixation",
        text: "Pelvi-acetabular fractures, intramedullary nailing, and polytrauma stabilisation.",
      },
      {
        title: "Spine & Disc Care",
        text: "Non-operative management of lumbar disc disease and targeted interventional pain relief.",
      },
      {
        title: "Sports Injury Rehabilitation",
        text: "Return-to-sport protocols with supervised physiotherapy and load progression.",
      },
      {
        title: "Geriatric Fracture Care",
        text: "Fragility fracture fixation with osteoporosis correction and fall-risk assessment.",
      },
    ],
    education: [
      {
        code: "MS",
        degree: "Master of Surgery (MS) in Orthopaedics",
        institute: "Institute of Medical Sciences, BHU",
        note: "Thesis on functional outcomes after primary total knee arthroplasty.",
      },
      {
        code: "MBBS",
        degree: "Bachelor of Medicine & Bachelor of Surgery (MBBS)",
        institute: "Ranchi University",
        note: "Distinction in Anatomy and Orthopaedic Surgery modules.",
      },
      {
        code: "FELL",
        degree: "Fellowship in Arthroscopy & Sports Medicine",
        institute: "Indian Arthroscopy Society",
        note: "Advanced training in ligament reconstruction and shoulder arthroscopy.",
        accent: true,
      },
    ],
    schedule: [
      {
        label: "Morning OPD",
        time: "11:00 AM – 03:00 PM",
        days: "Monday to Saturday",
        badge: "Walk-in & Priority Appt",
        tone: "primary",
      },
      {
        label: "Evening OPD",
        time: "05:00 PM – 08:00 PM",
        days: "Monday to Saturday",
        badge: "Fastest Slot Available",
        tone: "secondary",
      },
      {
        label: "Sunday Schedule",
        time: "Trauma On-Call",
        days: "Emergency Fracture & Trauma Care",
        badge: "Emergency Only",
        tone: "muted",
      },
    ],
    testimonials: [
      {
        initials: "RM",
        name: "Rakesh Mohan",
        location: "Resident • Bistupur, Jamshedpur",
        when: "3 weeks ago",
        text: "My knee arthroscopic surgery was done by Dr. Amit Kumar. I was back walking without support within weeks. Excellent in-house diagnostics, clean OT, and straightforward consultation fees.",
      },
      {
        initials: "BP",
        name: "Bipin Prasad",
        location: "Resident • Sonari, Jamshedpur",
        when: "2 months ago",
        text: "Total knee replacement for my mother went smoothly. The physiotherapy team started her on day one exactly as promised.",
      },
    ],
    metrics: [
      { value: "10+ Yrs", label: "Clinical Experience", tone: "primary" },
      { value: "2,400+", label: "Joint Procedures", tone: "primary" },
      { value: "98.4%", label: "Implant Survivorship", tone: "secondary" },
    ],
    emergency: {
      title: "24×7 Trauma Theatre, C-Arm Imaging & Fracture Clinic",
      text: "Our orthopaedic trauma team responds around the clock for road traffic injuries, fragility fractures, and emergency fixation supported by on-site imaging and modular operation theatres.",
      cta: "Trauma Hotline",
    },
  },
  {
    slug: "pankaj-verma",
    name: "Dr. Pankaj Verma",
    shortName: "Dr. P. Verma",
    photo: "/images/doctors/pankaj-verma.jpg",
    specialty: "General Medicine",
    specialtyLabel: "General Medicine",
    departmentSlug: "general-medicine-diabetology",
    qualification: "MBBS, MD (General Medicine)",
    qualificationShort: "MBBS, MD (General Medicine)",
    roleLabel: "General Physician",
    designation: "Senior Consultant Physician & Diabetologist",
    headline: "Senior Consultant Physician & Diabetologist",
    experienceYears: 10,
    rating: 4.7,
    reviews: 84,
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    daysLabel: "Mon - Sat",
    opdWindow: "morning",
    opdTiming: "09:00 AM - 01:00 PM (Morning Slot)",
    opdShort: "Mon – Sat (9 AM – 1 PM)",
    chamber: "Chamber #1, Block A",
    chamberShort: "Chamber #01 (Ground Floor)",
    nextSlot: "Tomorrow, 09:30 AM",
    tags: ["Diabetology", "Tropical Infections", "Cashless Insurance Accepted"],
    about: [
      "Dr. Pankaj Verma is a senior consultant physician and diabetologist managing multi-system clinical illness, chronic lifestyle disorders, and endemic infectious disease across Jamshedpur.",
      "He runs the hospital's structured diabetes clinic, combining HbA1c-led therapy titration, renal screening, and diabetic foot surveillance under a single follow-up plan.",
      "His practice also covers acute medical admissions — dengue, malaria, typhoid, and severe electrolyte disturbance — supported by the in-house pathology lab and critical care unit.",
    ],
    highlights: [
      {
        title: "Diabetes Clinic",
        text: "HbA1c-guided therapy with renal surveillance.",
      },
      {
        title: "Fast-Track Labs",
        text: "Routine reports delivered within 60 minutes.",
      },
      {
        title: "Chronic Care Plans",
        text: "Structured long-term follow-up scheduling.",
      },
    ],
    expertise: [
      {
        title: "Type 1 & Type 2 Diabetes",
        text: "Insulin initiation, oral therapy optimisation, and continuous glucose interpretation.",
      },
      {
        title: "Hypertension & Dyslipidemia",
        text: "Resistant hypertension workup, lipid correction, and cardiovascular risk scoring.",
      },
      {
        title: "Tropical Infectious Disease",
        text: "Dengue, malaria, typhoid, and scrub typhus management with in-patient monitoring.",
      },
      {
        title: "Thyroid & Endocrine Care",
        text: "Hypothyroidism, thyrotoxicosis, and metabolic syndrome evaluation.",
      },
      {
        title: "Geriatric Medicine",
        text: "Polypharmacy rationalisation, frailty screening, and preventive vaccination.",
      },
      {
        title: "Preventive Health Check",
        text: "Age-appropriate screening packages with consolidated physician review.",
      },
    ],
    education: [
      {
        code: "MD",
        degree: "Doctor of Medicine (MD) in General Medicine",
        institute: "Rajendra Institute of Medical Sciences",
        note: "Thesis on glycaemic variability in newly diagnosed type 2 diabetes.",
      },
      {
        code: "MBBS",
        degree: "Bachelor of Medicine & Bachelor of Surgery (MBBS)",
        institute: "Patna Medical College & Hospital",
        note: "Distinction in Internal Medicine and Microbiology.",
      },
      {
        code: "CCEBDM",
        degree: "Certificate Course in Evidence Based Diabetes Management",
        institute: "Public Health Foundation of India",
        note: "Structured national certification in ambulatory diabetes care.",
        accent: true,
      },
    ],
    schedule: [
      {
        label: "Morning OPD",
        time: "09:00 AM – 01:00 PM",
        days: "Monday to Saturday",
        badge: "Walk-in & Priority Appt",
        tone: "primary",
      },
      {
        label: "Diabetes Clinic",
        time: "04:00 PM – 05:30 PM",
        days: "Tuesday & Friday",
        badge: "Appointment Only",
        tone: "secondary",
      },
      {
        label: "Sunday Schedule",
        time: "Emergency On-Call",
        days: "Acute Medical Admissions",
        badge: "Emergency Only",
        tone: "muted",
      },
    ],
    testimonials: [
      {
        initials: "SK",
        name: "Sanjay Kumar",
        location: "Resident • Sonari, Jamshedpur",
        when: "1 month ago",
        text: "My HbA1c came down from 9.8 to 6.6 in seven months on his plan. He explains every medicine change and never rushes the consultation.",
      },
      {
        initials: "MD",
        name: "Meera Devi",
        location: "Resident • Kagal Nagar, Sonari",
        when: "2 months ago",
        text: "Admitted with severe dengue. Daily platelet monitoring and clear updates to the family every morning. Recovered without complications.",
      },
    ],
    metrics: [
      { value: "10+ Yrs", label: "Clinical Experience", tone: "primary" },
      { value: "18,000+", label: "OPD Consultations", tone: "primary" },
      { value: "4.7★", label: "Patient Care Index", tone: "secondary" },
    ],
    emergency: {
      title: "Acute Medical Admissions, HDU & 24×7 In-House Pathology",
      text: "Our general medicine unit supports round-the-clock acute admissions with high-dependency beds, fast-track blood investigations, and intensivist escalation when required.",
      cta: "Medical Helpline",
    },
  },
  {
    slug: "neha-kumari",
    name: "Dr. Neha Kumari",
    shortName: "Dr. N. Kumari",
    photo: "/images/doctors/neha-kumari.jpg",
    specialty: "Paediatrics",
    specialtyLabel: "Paediatrics & Neonatology",
    departmentSlug: "paediatrics-neonatal-care",
    qualification: "MBBS, DNB (Paediatrics)",
    qualificationShort: "MBBS, DNB (Paediatrics)",
    roleLabel: "Paediatrician",
    designation: "Consultant Paediatrician & Neonatologist",
    headline: "Consultant Paediatrician & Neonatologist",
    experienceYears: 8,
    rating: 4.9,
    reviews: 105,
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    daysLabel: "Mon - Sat",
    opdWindow: "both",
    opdTiming: "10:00 AM - 02:00 PM • 05:00 PM - 07:30 PM",
    opdShort: "Mon – Sat (3 PM – 7 PM)",
    chamber: "Chamber #5, Child Care Wing",
    chamberShort: "Chamber #05 (Child Care Wing)",
    nextSlot: "Today, 05:00 PM",
    tags: ["Neonatology", "Level-II NICU", "Cashless Insurance Accepted"],
    about: [
      "Dr. Neha Kumari is a consultant paediatrician and neonatologist leading the Level-II neonatal intensive care unit and well-baby programme at Brahmanandam Multi Specialty Centre, Sonari.",
      "She manages preterm and low-birth-weight newborns with incubator care, phototherapy, and respiratory support, working alongside the maternity team for immediate delivery-room stabilisation.",
      "Her outpatient practice covers growth and developmental surveillance, universal immunisation, paediatric asthma, and seasonal infectious illness in children.",
    ],
    highlights: [
      {
        title: "Level-II NICU",
        text: "Incubator, phototherapy and CPAP support.",
      },
      {
        title: "Well-Baby Clinic",
        text: "Growth charts and universal immunisation.",
      },
      {
        title: "Delivery-Room Cover",
        text: "Neonatal resuscitation team on call.",
      },
    ],
    expertise: [
      {
        title: "Neonatal Intensive Care",
        text: "Preterm and low-birth-weight care with incubators, CPAP, and phototherapy support.",
      },
      {
        title: "Universal Immunisation",
        text: "IAP-schedule vaccination, catch-up dosing, and travel vaccine counselling.",
      },
      {
        title: "Growth & Development",
        text: "Milestone surveillance, nutrition correction, and early developmental intervention.",
      },
      {
        title: "Paediatric Pulmonology",
        text: "Childhood asthma, recurrent wheeze, and nebulisation protocols.",
      },
      {
        title: "Seasonal Infection Care",
        text: "Dengue, viral fever, gastroenteritis, and hydration management in children.",
      },
      {
        title: "Adolescent Health",
        text: "Puberty counselling, anaemia screening, and nutritional assessment.",
      },
    ],
    education: [
      {
        code: "DNB",
        degree: "Diplomate of National Board (DNB) in Paediatrics",
        institute: "National Board of Examinations",
        note: "Trained in neonatal intensive care and paediatric emergency medicine.",
      },
      {
        code: "MBBS",
        degree: "Bachelor of Medicine & Bachelor of Surgery (MBBS)",
        institute: "Rajendra Institute of Medical Sciences",
        note: "Distinction in Paediatrics and Community Medicine.",
      },
      {
        code: "NRP",
        degree: "Neonatal Resuscitation Programme – Provider & Instructor",
        institute: "Indian Academy of Paediatrics",
        note: "Certified instructor for delivery-room neonatal resuscitation.",
        accent: true,
      },
    ],
    schedule: [
      {
        label: "Morning OPD",
        time: "10:00 AM – 02:00 PM",
        days: "Monday to Saturday",
        badge: "Well-Baby & Vaccination",
        tone: "primary",
      },
      {
        label: "Evening OPD",
        time: "05:00 PM – 07:30 PM",
        days: "Monday to Saturday",
        badge: "Fastest Slot Available",
        tone: "secondary",
      },
      {
        label: "Sunday Schedule",
        time: "NICU On-Call",
        days: "Neonatal & Paediatric Emergencies",
        badge: "Emergency Only",
        tone: "muted",
      },
    ],
    testimonials: [
      {
        initials: "AN",
        name: "Anjali Nayak",
        location: "Resident • Sonari, Jamshedpur",
        when: "3 weeks ago",
        text: "Our baby was born at 34 weeks and spent eleven days in the NICU. Dr. Neha updated us twice daily and the nursing care was exceptional.",
      },
      {
        initials: "VS",
        name: "Vikash Singh",
        location: "Resident • Kadma, Jamshedpur",
        when: "1 month ago",
        text: "She is wonderful with anxious children. My son's recurrent wheezing is finally under control with a clear inhaler plan.",
      },
    ],
    metrics: [
      { value: "8+ Yrs", label: "Clinical Experience", tone: "primary" },
      { value: "1,900+", label: "Neonates Managed", tone: "primary" },
      { value: "4.9★", label: "Parent Care Index", tone: "secondary" },
    ],
    emergency: {
      title: "Level-II NICU, Paediatric HDU & 24×7 Child Emergency",
      text: "The child care wing runs a dedicated neonatal intensive care unit with incubators, ventilatory support, and an on-call paediatric emergency team at the Sonari campus.",
      cta: "Child Care Helpline",
    },
  },
  {
    slug: "sk-mukherjee",
    name: "Dr. S. K. Mukherjee",
    shortName: "Dr. S. K. Mukherjee",
    photo: "/images/doctors/sk-mukherjee.jpg",
    specialty: "Urology & Andrology",
    specialtyLabel: "Urology & Andrology",
    departmentSlug: "general-laparoscopic-surgery",
    qualification: "MS (General Surgery), MCh (Urology)",
    qualificationShort: "MS (General Surgery), MCh (Urology)",
    roleLabel: "Urologist",
    designation: "Senior Consultant Urologist",
    headline: "Senior Consultant Urologist & Laparoscopic Surgeon",
    experienceYears: 14,
    rating: 4.8,
    reviews: 73,
    days: ["Tue", "Thu", "Sat"],
    daysLabel: "Tue, Thu, Sat",
    opdWindow: "evening",
    opdTiming: "02:00 PM - 06:00 PM (Super Specialty Slot)",
    opdShort: "Tue, Thu, Sat (2 PM – 6 PM)",
    chamber: "Chamber #7, Block A",
    chamberShort: "Chamber #07 (First Floor)",
    nextSlot: "Thursday, 02:30 PM",
    tags: ["MCh Urology", "Endourology", "Cashless Insurance Accepted"],
    about: [
      "Dr. S. K. Mukherjee is a senior consultant urologist with fourteen years of super-specialty experience in endourology, stone disease, and minimally invasive urological surgery.",
      "He leads the hospital's laparoscopic and endourology programme, performing laser stone clearance, prostate surgery, and reconstructive urological procedures at the Sonari campus.",
      "His clinic also covers andrology, male infertility evaluation, and structured management of lower urinary tract symptoms in older men.",
    ],
    highlights: [
      {
        title: "Laser Stone Clearance",
        text: "Day-care RIRS and URSL procedures.",
      },
      {
        title: "Endourology Suite",
        text: "Ultra-HD laparoscopic and cysto towers.",
      },
      { title: "Prostate Clinic", text: "Structured LUTS and BPH management." },
    ],
    expertise: [
      {
        title: "Kidney & Ureteric Stones",
        text: "RIRS, URSL, PCNL, and laser lithotripsy with same-day discharge protocols.",
      },
      {
        title: "Prostate & BPH Surgery",
        text: "TURP, bipolar enucleation, and long-term lower urinary tract symptom management.",
      },
      {
        title: "Laparoscopic Urology",
        text: "Nephrectomy, pyeloplasty, and reconstructive minimally invasive urological surgery.",
      },
      {
        title: "Andrology & Male Infertility",
        text: "Semen analysis interpretation, varicocele surgery, and hormonal evaluation.",
      },
      {
        title: "Urinary Tract Infection Care",
        text: "Recurrent UTI workup, urodynamics, and bladder dysfunction management.",
      },
      {
        title: "Uro-Oncology Screening",
        text: "PSA-led prostate screening, haematuria evaluation, and cystoscopic surveillance.",
      },
    ],
    education: [
      {
        code: "MCh",
        degree: "Magister Chirurgiae (MCh) in Urology",
        institute: "Institute of Post Graduate Medical Education & Research",
        note: "Super-specialty training in endourology and reconstructive urology.",
      },
      {
        code: "MS",
        degree: "Master of Surgery (MS) in General Surgery",
        institute: "Calcutta National Medical College",
        note: "Distinction in operative surgery and surgical pathology.",
      },
      {
        code: "MBBS",
        degree: "Bachelor of Medicine & Bachelor of Surgery (MBBS)",
        institute: "Calcutta National Medical College",
        note: "Graduated with honours in Anatomy and Surgery.",
      },
      {
        code: "USI",
        degree: "Member, Urological Society of India",
        institute: "Urological Society of India",
        note: "Active contributor to national endourology workshops.",
        accent: true,
      },
    ],
    schedule: [
      {
        label: "Super Specialty OPD",
        time: "02:00 PM – 06:00 PM",
        days: "Tuesday, Thursday, Saturday",
        badge: "Appointment Priority",
        tone: "primary",
      },
      {
        label: "Endourology OT",
        time: "09:00 AM – 01:00 PM",
        days: "Wednesday & Friday",
        badge: "Scheduled Procedures",
        tone: "secondary",
      },
      {
        label: "Sunday Schedule",
        time: "Emergency On-Call",
        days: "Acute Retention & Colic",
        badge: "Emergency Only",
        tone: "muted",
      },
    ],
    testimonials: [
      {
        initials: "TR",
        name: "Tapan Roy",
        location: "Resident • Bistupur, Jamshedpur",
        when: "1 month ago",
        text: "Laser treatment for an 11mm kidney stone. Admitted in the morning, discharged the same evening, and completely pain-free within two days.",
      },
      {
        initials: "HS",
        name: "Harish Sahu",
        location: "Resident • Sonari, Jamshedpur",
        when: "2 months ago",
        text: "Very senior and patient doctor. He explained the prostate surgery options clearly before we decided anything.",
      },
    ],
    metrics: [
      { value: "14+ Yrs", label: "Clinical Experience", tone: "primary" },
      { value: "4,100+", label: "Endourology Procedures", tone: "primary" },
      { value: "4.8★", label: "Patient Care Index", tone: "secondary" },
    ],
    emergency: {
      title: "Emergency Urology, Laser Suite & 24×7 Catheterisation Cover",
      text: "Acute urinary retention, obstructive uropathy, and renal colic are managed round the clock with immediate imaging, catheterisation, and emergency laser intervention.",
      cta: "Urology Helpline",
    },
  },
];

export const homepageDoctorSlugs = [
  "rajeev-ranjan",
  "shreya-singh",
  "amit-kumar",
  "pankaj-verma",
  "neha-kumari",
];

export function getDoctor(slug: string): Doctor | undefined {
  return doctors.find((d) => d.slug === slug);
}

export function doctorsByDepartment(departmentSlug: string): Doctor[] {
  return doctors.filter((d) => d.departmentSlug === departmentSlug);
}

export const specialtyFilters = Array.from(
  new Set(doctors.map((d) => d.specialtyLabel)),
).sort();

export const dayFilters = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
