export interface TenantInstitution {
  _id: string;
  name: string;
  slug: string;
  type: 'high_school' | 'vocational_institution';
  tagline: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  city: string;
  country: string;
  branding: {
    logoUrl: string;
    bannerUrl: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
  subscription: {
    plan: 'starter' | 'standard' | 'enterprise';
    status: 'active' | 'trial' | 'past_due' | 'cancelled';
    billingCycle: 'per_term' | 'annual' | 'monthly';
    termPriceUsd: number;
    maxStudents: number;
    maxTeachers: number;
    startDate: string;
    renewalDate: string;
  };
  curriculaSupported: string[];
  enrolledStudentsCount: number;
  assignedTeachersCount: number;
  classes: {
    id: string;
    name: string; // e.g. 'Form 4 Science A', 'Electrical Level 2'
    gradeLevel: string; // e.g. 'Form 4', 'National Diploma 1'
    classTeacher: string;
    studentCount: number;
    subjects: string[];
  }[];
  announcements: {
    id: string;
    title: string;
    date: string;
    content: string;
  }[];
  isActive: boolean;
  createdAt: string;
}

export interface IndependentTeacher {
  _id: string;
  userId: string;
  name: string;
  email: string;
  avatar: string;
  headline: string;
  bio: string;
  isIndependentTeacher: boolean;
  institutionAffiliation?: string;
  qualifications: {
    degree: string;
    institution: string;
    yearCompleted: number;
  }[];
  teachingExperienceYears: number;
  curriculumSpecialties: string[];
  authorizedSubjects: string[];
  languages: string[];
  hourlyRateUsd: number;
  sessionBookingPriceUsd: number;
  totalStudentsTaught: number;
  rating: number;
  reviewsCount: number;
  safeguardingVetted: boolean;
  availabilitySchedule: {
    dayOfWeek: string;
    slots: string[];
  }[];
  introVideoUrl?: string;
  reviews: {
    id: string;
    studentName: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}

export interface BookingRecord {
  _id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  curriculum: string;
  scheduledDate: string;
  timeSlot: string;
  durationMinutes: number;
  learningGoals: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  meetingUrl: string;
  roomId: string;
  priceUsd: number;
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  createdAt: string;
}

class StoreService {
  private institutions: TenantInstitution[] = [
    // 1. High School Tenant: Redwood College
    {
      _id: 'inst-hs-001',
      name: 'Redwood College',
      slug: 'redwood-college',
      type: 'high_school',
      tagline: 'Academic and Character Excellence in Secondary Education',
      description: 'Premier independent high school delivering Cambridge IGCSE and A-Level curricula with rigorous STEM and humanities streams.',
      contactEmail: 'admissions@redwoodcollege.ac.zw',
      contactPhone: '+263 242 703 501',
      address: 'Borrowdale Road, Hartmann Hill',
      city: 'Harare',
      country: 'Zimbabwe',
      branding: {
        logoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80',
        bannerUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80',
        primaryColor: '#800000', // Maroon
        secondaryColor: '#1e293b', // Deep Slate
        accentColor: '#f59e0b', // Amber/Gold
      },
      subscription: {
        plan: 'enterprise',
        status: 'active',
        billingCycle: 'per_term',
        termPriceUsd: 1200,
        maxStudents: 850,
        maxTeachers: 60,
        startDate: '2026-01-10T00:00:00.000Z',
        renewalDate: '2026-12-31T00:00:00.000Z',
      },
      curriculaSupported: ['cambridge'],
      enrolledStudentsCount: 640,
      assignedTeachersCount: 48,
      classes: [
        { id: 'c-sg-1', name: 'Form 4 Cambridge Science Alpha', gradeLevel: 'Form 4', classTeacher: 'Dr. Chiware', studentCount: 32, subjects: ['Cambridge Mathematics (0580)', 'Physics (0625)', 'Chemistry (0620)', 'Computer Science (0478)'] },
        { id: 'c-sg-2', name: 'Lower 6 A-Level Pure Mathematics', gradeLevel: 'Lower 6', classTeacher: 'Eng. F. Chiware', studentCount: 28, subjects: ['Cambridge Pure Math 9709', 'Mechanics 1', 'Probability & Statistics 1'] },
        { id: 'c-sg-3', name: 'Form 3 IGCSE General Sciences', gradeLevel: 'Form 3', classTeacher: 'Mrs. H. Dube', studentCount: 35, subjects: ['Integrated Sciences', 'Mathematics', 'English Language'] },
        { id: 'c-sg-4', name: 'Upper 6 Advanced Computer Science', gradeLevel: 'Upper 6', classTeacher: 'Mr. T. Ndlovu', studentCount: 24, subjects: ['Algorithm Analysis', 'Python & SQL Project', 'System Architecture'] },
      ],
      announcements: [
        { id: 'a-1', title: 'Term 3 Cambridge Mock Exam Timetable Released', date: '2026-10-15', content: 'Form 4 and Upper 6 candidates can now download their digital timetables and submit revision queries via their portal.' },
        { id: 'a-2', title: 'Inter-School STEM & Robotics Challenge', date: '2026-10-12', content: 'Our computer science cohort secured 1st place in the national digital algorithmic design Olympiad.' },
      ],
      isActive: true,
      createdAt: '2026-01-01T00:00:00.000Z',
    },

    // 2. High School Tenant: Excel High School
    {
      _id: 'inst-hs-002',
      name: 'Excel High School',
      slug: 'excel-high-school',
      type: 'high_school',
      tagline: 'Blended Secondary Academic Leadership & Modern Classrooms',
      description: 'Historical secondary institution empowering students across Zimbabwe through dual academic pathways and digital classrooms.',
      contactEmail: 'admin@excelhigh.ac.zw',
      contactPhone: '+263 242 792 101',
      address: 'Excel Way, Harare',
      city: 'Harare',
      country: 'Zimbabwe',
      branding: {
        logoUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=150&auto=format&fit=crop&q=80',
        bannerUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80',
        primaryColor: '#005a36', // PE Green
        secondaryColor: '#d97706', // Gold
        accentColor: '#0284c7', // Sky
      },
      subscription: {
        plan: 'standard',
        status: 'active',
        billingCycle: 'per_term',
        termPriceUsd: 200,
        maxStudents: 500,
        maxTeachers: 35,
        startDate: '2026-01-15T00:00:00.000Z',
        renewalDate: '2026-12-31T00:00:00.000Z',
      },
      curriculaSupported: ['zimsec', 'cambridge'],
      enrolledStudentsCount: 420,
      assignedTeachersCount: 30,
      classes: [
        { id: 'c-pe-1', name: 'Form 4 ZIMSEC O-Level Math Masterclass', gradeLevel: 'Form 4', classTeacher: 'Mrs. Grace Moyo', studentCount: 40, subjects: ['ZIMSEC 4004 Math', 'Combined Science 4003', 'Geography'] },
        { id: 'c-pe-2', name: 'Lower 6 ZIMSEC Commercial Stream', gradeLevel: 'Lower 6', classTeacher: 'Mr. P. Shumba', studentCount: 35, subjects: ['Accounts', 'Economics', 'Business Studies'] },
      ],
      announcements: [
        { id: 'a-pe-1', title: 'ZIMSEC Paper 2 Revision Weekend Sessions', date: '2026-10-14', content: 'Special Saturday interactive walkthrough sessions for Transformation Geometry and Vectors.' },
      ],
      isActive: true,
      createdAt: '2026-01-05T00:00:00.000Z',
    },

    // 3. Vocational Institution: Harare Polytechnic
    {
      _id: 'inst-voc-001',
      name: 'Harare Polytechnic School of Engineering & Technology',
      slug: 'harare-polytechnic',
      type: 'vocational_institution',
      tagline: 'Technical Competence, Hands-on Mastery and Industrial Innovation',
      description: 'Flagship TVET polytechnic providing accredited National Foundation, National Certificate (NC), and National Diploma (ND) digital curricula in engineering and trades.',
      contactEmail: 'polyinfo@hararepoly.ac.zw',
      contactPhone: '+263 242 791 431',
      address: 'Cnr Coventry & Rotten Row',
      city: 'Harare',
      country: 'Zimbabwe',
      branding: {
        logoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=150&auto=format&fit=crop&q=80',
        bannerUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=1200&auto=format&fit=crop&q=80',
        primaryColor: '#0f766e', // Deep Teal Industrial
        secondaryColor: '#1e3a8a', // Deep Blue
        accentColor: '#f97316', // Safety Orange
      },
      subscription: {
        plan: 'enterprise',
        status: 'active',
        billingCycle: 'per_term',
        termPriceUsd: 1500,
        maxStudents: 1200,
        maxTeachers: 70,
        startDate: '2026-01-01T00:00:00.000Z',
        renewalDate: '2026-12-31T00:00:00.000Z',
      },
      curriculaSupported: ['vocational_trades', 'digital_skills'],
      enrolledStudentsCount: 890,
      assignedTeachersCount: 52,
      classes: [
        { id: 'v-hp-1', name: 'Electrical Engineering & Solar Systems (ND Level 1)', gradeLevel: 'National Diploma', classTeacher: 'Eng. M. Sithole', studentCount: 45, subjects: ['Single & Three-Phase Wiring', 'Inverter Sizing & Photovoltaics', 'Industrial Safety & Regulations'] },
        { id: 'v-hp-2', name: 'Automotive & Diesel Plant Technology (NC)', gradeLevel: 'National Certificate', classTeacher: 'Mr. B. Gonese', studentCount: 38, subjects: ['Engine Diagnostics & Overhaul', 'Fuel Injection Systems', 'Hydraulic Circuits'] },
        { id: 'v-hp-3', name: 'Cloud & Systems Software Engineering', gradeLevel: 'Higher National Diploma', classTeacher: 'Eng. F. Chiware', studentCount: 50, subjects: ['Full-Stack Node/React', 'DevOps & Linux Administration', 'Database Design'] },
        { id: 'v-hp-4', name: 'Culinary Arts & Industrial Food Technology', gradeLevel: 'National Certificate', classTeacher: 'Chef A. Marowa', studentCount: 32, subjects: ['Commercial Kitchen Operations', 'Food Hygiene HACCP', 'Menu Engineering'] },
      ],
      announcements: [
        { id: 'a-hp-1', title: 'Solar PV Sizing & Battery Installation Practical Rubric', date: '2026-10-16', content: 'ND Level 1 students can submit their solar load balance worksheets for peer and lecturer verification.' },
        { id: 'a-hp-2', title: 'Industrial Attachment Orientation 2026/2027', date: '2026-10-11', content: 'Digital briefing for engineering candidates qualifying for second-year industrial apprenticeship.' },
      ],
      isActive: true,
      createdAt: '2026-01-02T00:00:00.000Z',
    },

    // 4. Vocational Institution: Msasa Vocational Training Centre
    {
      _id: 'inst-voc-002',
      name: 'Msasa Vocational & Technical Training Centre',
      slug: 'msasa-vtc',
      type: 'vocational_institution',
      tagline: 'Practical Skills for Self-Reliance and Enterprise Growth',
      description: 'Specialised vocational institute training youth and mid-career professionals in industrial welding, metal fabrication, plumbing, and automotive mechanics.',
      contactEmail: 'admissions@msasavtc.org.zw',
      contactPhone: '+263 242 486 312',
      address: 'Msasa Industrial Area, Harare',
      city: 'Harare',
      country: 'Zimbabwe',
      branding: {
        logoUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=150&auto=format&fit=crop&q=80',
        bannerUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&auto=format&fit=crop&q=80',
        primaryColor: '#c2410c', // Rust Amber
        secondaryColor: '#1c1917', // Dark Charcoal
        accentColor: '#eab308', // Yellow
      },
      subscription: {
        plan: 'standard',
        status: 'active',
        billingCycle: 'per_term',
        termPriceUsd: 200,
        maxStudents: 400,
        maxTeachers: 25,
        startDate: '2026-02-01T00:00:00.000Z',
        renewalDate: '2026-12-31T00:00:00.000Z',
      },
      curriculaSupported: ['vocational_trades'],
      enrolledStudentsCount: 310,
      assignedTeachersCount: 20,
      classes: [
        { id: 'v-ms-1', name: 'Arc & TIG Welding & Fabrication (Level 1)', gradeLevel: 'Vocational Certificate', classTeacher: 'Mr. K. Mutasa', studentCount: 25, subjects: ['Metal Preparation & Jointing', 'Oxy-Acetylene Cutting', 'Blueprint Reading'] },
        { id: 'v-ms-2', name: 'Plumbing & Water Reticulation', gradeLevel: 'Vocational Certificate', classTeacher: 'Mr. O. Shoko', studentCount: 28, subjects: ['Pipe Fitting & Drainage', 'Solar Water Heating Integration', 'Pump Maintenance'] },
      ],
      announcements: [
        { id: 'a-ms-1', title: 'Hands-on Safety Compliance Workshop', date: '2026-10-13', content: 'Mandatory PPE and safety video modules uploaded to student dashboards.' },
      ],
      isActive: true,
      createdAt: '2026-02-01T00:00:00.000Z',
    },
  ];

  private independentTeachers: IndependentTeacher[] = [
    {
      _id: 't-ind-001',
      userId: 'usr-chiware-01',
      name: 'Eng. Farai Chiware',
      email: 'dr.chiware@eduenlighten.ac',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      headline: 'Senior Cambridge IGCSE & A-Level Math & Computer Science Specialist',
      bio: 'Over 12 years of coaching students to A* achievements in Cambridge Mathematics, Physics, and Advanced Software Development. Former Cambridge examiner and university lecturer.',
      isIndependentTeacher: true,
      institutionAffiliation: 'EduEnlighten Open Faculty',
      qualifications: [
        { degree: 'BSc Computer Science (Hons)', institution: 'University of Zimbabwe', yearCompleted: 2012 },
        { degree: 'MSc Software Engineering', institution: 'University of Cape Town', yearCompleted: 2016 },
      ],
      teachingExperienceYears: 12,
      curriculumSpecialties: ['Cambridge International', 'Professional Digital Skills'],
      authorizedSubjects: ['Cambridge Mathematics (0580)', 'Pure Math 9709', 'Physics (0625)', 'Full Stack Web Development', 'Python Programming'],
      languages: ['English', 'Shona'],
      hourlyRateUsd: 25,
      sessionBookingPriceUsd: 25,
      totalStudentsTaught: 380,
      rating: 4.96,
      reviewsCount: 42,
      safeguardingVetted: true,
      availabilitySchedule: [
        { dayOfWeek: 'Monday', slots: ['09:00 - 10:00 CAT', '14:00 - 15:00 CAT', '16:00 - 17:00 CAT'] },
        { dayOfWeek: 'Wednesday', slots: ['10:00 - 11:00 CAT', '15:00 - 16:00 CAT', '17:00 - 18:00 CAT'] },
        { dayOfWeek: 'Friday', slots: ['09:00 - 10:00 CAT', '13:00 - 14:00 CAT', '16:00 - 17:00 CAT'] },
        { dayOfWeek: 'Saturday', slots: ['09:00 - 10:30 CAT (Intensive)', '11:00 - 12:30 CAT (Intensive)'] },
      ],
      introVideoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
      reviews: [
        { id: 'r-1', studentName: 'Tawanda S.', rating: 5, comment: 'Dr. Chiware made Calculus and coordinate geometry completely intuitive! Moved my grade from a C to an A.', date: '2026-10-08' },
        { id: 'r-2', studentName: 'Rufaro M.', rating: 5, comment: 'Clear explanations, practical past-paper walkthroughs, and very patient during 1-on-1 sessions.', date: '2026-09-29' },
      ],
    },
    {
      _id: 't-ind-002',
      userId: 'usr-moyo-02',
      name: 'Mrs. Grace Moyo',
      email: 'mrs.moyo@eduenlighten.ac',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      headline: 'Master ZIMSEC O-Level & A-Level Mathematics & Science Coach',
      bio: 'Recognized nationwide for step-by-step exam preparation techniques that simplify matrices, vectors, transformation geometry, and combined science.',
      isIndependentTeacher: true,
      institutionAffiliation: 'Independent National Tutor',
      qualifications: [
        { degree: 'Bachelor of Education (Mathematics)', institution: 'Midlands State University', yearCompleted: 2010 },
      ],
      teachingExperienceYears: 14,
      curriculumSpecialties: ['ZIMSEC Curriculum'],
      authorizedSubjects: ['ZIMSEC Mathematics 4004', 'Combined Science 4003', 'Biology O-Level'],
      languages: ['English', 'Shona', 'Ndebele'],
      hourlyRateUsd: 18,
      sessionBookingPriceUsd: 18,
      totalStudentsTaught: 540,
      rating: 4.92,
      reviewsCount: 58,
      safeguardingVetted: true,
      availabilitySchedule: [
        { dayOfWeek: 'Tuesday', slots: ['14:00 - 15:00 CAT', '16:00 - 17:00 CAT'] },
        { dayOfWeek: 'Thursday', slots: ['14:00 - 15:00 CAT', '16:00 - 17:00 CAT'] },
        { dayOfWeek: 'Saturday', slots: ['08:30 - 09:30 CAT', '10:00 - 11:00 CAT', '14:00 - 15:00 CAT'] },
      ],
      reviews: [
        { id: 'r-3', studentName: 'Nyasha K.', rating: 5, comment: 'Mrs. Moyo is an incredible teacher. Transformation geometry was my nightmare until her session!', date: '2026-10-02' },
      ],
    },
    {
      _id: 't-ind-003',
      userId: 'usr-marufu-03',
      name: 'Eng. Kudzai Marufu',
      email: 'kudzai.marufu@example.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      headline: 'Physics & Applied Electronics Instructor | Hands-on STEM Lead',
      bio: 'BSc Applied Physics from NUST. Passionate about linking classroom theoretical physics with real-world electronics, renewable energy, and robotics.',
      isIndependentTeacher: true,
      institutionAffiliation: 'STEM Innovators Guild',
      qualifications: [
        { degree: 'BSc Applied Physics', institution: 'National University of Science and Technology (NUST)', yearCompleted: 2017 },
      ],
      teachingExperienceYears: 8,
      curriculumSpecialties: ['Cambridge International', 'ZIMSEC Curriculum', 'Vocational Trades'],
      authorizedSubjects: ['Cambridge Physics (0625/9702)', 'ZIMSEC Physical Science', 'Solar Photovoltaic Foundations', 'Basic Electronics'],
      languages: ['English', 'Shona'],
      hourlyRateUsd: 20,
      sessionBookingPriceUsd: 20,
      totalStudentsTaught: 210,
      rating: 4.88,
      reviewsCount: 29,
      safeguardingVetted: true,
      availabilitySchedule: [
        { dayOfWeek: 'Monday', slots: ['16:00 - 17:00 CAT', '17:30 - 18:30 CAT'] },
        { dayOfWeek: 'Wednesday', slots: ['16:00 - 17:00 CAT', '17:30 - 18:30 CAT'] },
        { dayOfWeek: 'Sunday', slots: ['10:00 - 11:30 CAT (Lab Practice)'] },
      ],
      reviews: [
        { id: 'r-4', studentName: 'Simba B.', rating: 5, comment: 'Electricity and circuits were explained with live circuit simulations. Super helpful!', date: '2026-09-18' },
      ],
    },
    {
      _id: 't-ind-004',
      userId: 'usr-sithole-04',
      name: 'Instructor Melody Sithole',
      email: 'm.sithole@vocationaltvet.org',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
      headline: 'Certified Vocational Electrical & Solar PV Installation Specialist',
      bio: 'Master Electrician and technical instructor delivering industrial wiring, off-grid solar system sizing, inverter setup, and electrical safety certifications.',
      isIndependentTeacher: true,
      institutionAffiliation: 'National Renewable Energy TVET',
      qualifications: [
        { degree: 'Higher National Diploma in Electrical Engineering', institution: 'Harare Polytechnic', yearCompleted: 2014 },
        { degree: 'Certified Solar Energy Professional', institution: 'Renewable Energy Institute', yearCompleted: 2019 },
      ],
      teachingExperienceYears: 10,
      curriculumSpecialties: ['Vocational Trades', 'Professional Digital Skills'],
      authorizedSubjects: ['Electrical Installation & Wiring', 'Solar PV Design & Battery Sizing', 'Industrial Controls', 'Electronic Troubleshooting'],
      languages: ['English', 'Shona'],
      hourlyRateUsd: 22,
      sessionBookingPriceUsd: 22,
      totalStudentsTaught: 195,
      rating: 4.94,
      reviewsCount: 31,
      safeguardingVetted: true,
      availabilitySchedule: [
        { dayOfWeek: 'Tuesday', slots: ['09:00 - 10:30 CAT', '14:00 - 15:30 CAT'] },
        { dayOfWeek: 'Thursday', slots: ['09:00 - 10:30 CAT', '14:00 - 15:30 CAT'] },
        { dayOfWeek: 'Saturday', slots: ['13:00 - 15:00 CAT (Practical Diagnostic Review)'] },
      ],
      reviews: [
        { id: 'r-5', studentName: 'Blessing C.', rating: 5, comment: 'Hands down the best solar sizing mentor. Helped me prepare for my trade test effortlessly.', date: '2026-10-10' },
      ],
    },
    {
      _id: 't-ind-005',
      userId: 'usr-ndlovu-05',
      name: 'Dr. Ruvimbo Ndlovu',
      email: 'dr.ndlovu@eduenlighten.ac',
      avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=200&auto=format&fit=crop&q=80',
      headline: 'Chemistry & Biology Senior Educator | Cambridge (0620/9701) & ZIMSEC Specialist',
      bio: 'PhD in Bio-organic Chemistry with 11 years of international and national high school coaching. Expert at organic reaction mechanisms, stoichiometry calculations, and practical lab paper techniques.',
      isIndependentTeacher: true,
      institutionAffiliation: 'National Science Faculty',
      qualifications: [
        { degree: 'BSc Chemistry & Biochemistry', institution: 'University of Zimbabwe', yearCompleted: 2013 },
        { degree: 'PhD Bio-organic Chemistry', institution: 'University of Pretoria', yearCompleted: 2018 },
      ],
      teachingExperienceYears: 11,
      curriculumSpecialties: ['Cambridge International', 'ZIMSEC Curriculum'],
      authorizedSubjects: ['Cambridge Chemistry (0620/9701)', 'ZIMSEC Chemistry 5070', 'Cambridge Biology (0610/9700)', 'Combined Science'],
      languages: ['English', 'Ndebele', 'Shona'],
      hourlyRateUsd: 24,
      sessionBookingPriceUsd: 24,
      totalStudentsTaught: 310,
      rating: 4.97,
      reviewsCount: 46,
      safeguardingVetted: true,
      availabilitySchedule: [
        { dayOfWeek: 'Monday', slots: ['14:00 - 15:30 CAT', '16:00 - 17:30 CAT'] },
        { dayOfWeek: 'Wednesday', slots: ['14:00 - 15:30 CAT', '16:00 - 17:30 CAT'] },
        { dayOfWeek: 'Saturday', slots: ['09:00 - 11:00 CAT (Practical Chemistry Q&A)'] },
      ],
      reviews: [
        { id: 'r-6', studentName: 'Tatenda N.', rating: 5, comment: 'Dr. Ndlovu makes organic chemistry mechanisms feel effortless. I went from struggling with moles to getting an A in my mock exams!', date: '2026-10-14' },
      ],
    },
    {
      _id: 't-ind-006',
      userId: 'usr-zhou-06',
      name: 'Mr. Brian Zhou (FCCA)',
      email: 'brian.zhou@eduenlighten.ac',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      headline: 'Chartered Certified Accountant | Cambridge & ZIMSEC Principles of Accounts & Business',
      bio: 'Senior accounting mentor and former Cambridge commercial examiner. Specializing in financial ledgers, balance sheet reconciliation, partnership accounts, and cost accounting.',
      isIndependentTeacher: true,
      institutionAffiliation: 'Chartered Financial Educators Guild',
      qualifications: [
        { degree: 'BCom Accounting (Hons)', institution: 'Midlands State University', yearCompleted: 2011 },
        { degree: 'FCCA Fellow', institution: 'Association of Chartered Certified Accountants', yearCompleted: 2015 },
      ],
      teachingExperienceYears: 13,
      curriculumSpecialties: ['Cambridge International', 'ZIMSEC Curriculum'],
      authorizedSubjects: ['Cambridge Accounting (0452/9706)', 'ZIMSEC Principles of Accounting 4048', 'Business Studies 7115', 'Economics 0455'],
      languages: ['English', 'Shona'],
      hourlyRateUsd: 20,
      sessionBookingPriceUsd: 20,
      totalStudentsTaught: 420,
      rating: 4.93,
      reviewsCount: 39,
      safeguardingVetted: true,
      availabilitySchedule: [
        { dayOfWeek: 'Tuesday', slots: ['15:00 - 16:30 CAT', '17:00 - 18:30 CAT'] },
        { dayOfWeek: 'Thursday', slots: ['15:00 - 16:30 CAT', '17:00 - 18:30 CAT'] },
        { dayOfWeek: 'Sunday', slots: ['14:00 - 16:00 CAT (Accounting Past Paper Marathon)'] },
      ],
      reviews: [
        { id: 'r-7', studentName: 'Chiedza M.', rating: 5, comment: 'Mr. Zhou teaches accounting like storytelling. Partnership adjustments and control accounts finally clicked for me.', date: '2026-10-11' },
      ],
    },
    {
      _id: 't-ind-007',
      userId: 'usr-mutasa-07',
      name: 'Eng. Peter Mutasa',
      email: 'peter.mutasa@eduenlighten.ac',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
      headline: 'Automotive Mechanics, Welding & Metal Fabrication Master Instructor',
      bio: 'Over 15 years in heavy plant mechanics, MIG/TIG welding certifications, engine overhaul diagnostics, and workshop trade test mentorship across Zimbabwe polytechnics.',
      isIndependentTeacher: true,
      institutionAffiliation: 'Msasa Vocational & Technical Training Partner',
      qualifications: [
        { degree: 'National Diploma in Mechanical Engineering', institution: 'Bulawayo Polytechnic', yearCompleted: 2009 },
        { degree: 'Journeyman Class 1 Automotive Engineering', institution: 'Ministry of Higher & Tertiary Education', yearCompleted: 2012 },
      ],
      teachingExperienceYears: 15,
      curriculumSpecialties: ['Vocational Trades'],
      authorizedSubjects: ['Automotive Mechanics & Engine Overhaul', 'Welding & Metal Fabrication (MIG/TIG)', 'Technical Workshop Safety & Measurements', 'Pneumatics & Hydraulics'],
      languages: ['English', 'Shona'],
      hourlyRateUsd: 19,
      sessionBookingPriceUsd: 19,
      totalStudentsTaught: 280,
      rating: 4.95,
      reviewsCount: 35,
      safeguardingVetted: true,
      availabilitySchedule: [
        { dayOfWeek: 'Monday', slots: ['08:30 - 10:00 CAT', '13:00 - 14:30 CAT'] },
        { dayOfWeek: 'Wednesday', slots: ['08:30 - 10:00 CAT', '13:00 - 14:30 CAT'] },
        { dayOfWeek: 'Saturday', slots: ['09:00 - 11:30 CAT (Hands-on Diagnostic Workshop)'] },
      ],
      reviews: [
        { id: 'r-8', studentName: 'Kudakwashe R.', rating: 5, comment: 'Eng. Mutasa helped me pass my Class 1 trade test with flying colors. His breakdown of injection systems is brilliant.', date: '2026-10-05' },
      ],
    },
    {
      _id: 't-ind-008',
      userId: 'usr-mataruse-08',
      name: 'Ms. Tariro Mataruse',
      email: 'tariro.mataruse@eduenlighten.ac',
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&auto=format&fit=crop&q=80',
      headline: 'English Language, Literature in English & Shona Heritage Specialist',
      bio: 'Master of Arts in English and African Literature. Passionate about essay composition, prose & poetry analysis, dramatic commentary, and indigenous Shona literature.',
      isIndependentTeacher: true,
      institutionAffiliation: 'EduEnlighten Humanities Department',
      qualifications: [
        { degree: 'BA English & Shona (Double Major)', institution: 'University of Zimbabwe', yearCompleted: 2015 },
        { degree: 'MA African Literature & Cultural Studies', institution: 'University of Cape Town', yearCompleted: 2018 },
      ],
      teachingExperienceYears: 9,
      curriculumSpecialties: ['Cambridge International', 'ZIMSEC Curriculum'],
      authorizedSubjects: ['English Language (1123/0500)', 'Literature in English (0475/2010)', 'Shona Language & Literature 4007', 'Heritage Studies'],
      languages: ['English', 'Shona'],
      hourlyRateUsd: 17,
      sessionBookingPriceUsd: 17,
      totalStudentsTaught: 360,
      rating: 4.98,
      reviewsCount: 52,
      safeguardingVetted: true,
      availabilitySchedule: [
        { dayOfWeek: 'Tuesday', slots: ['14:00 - 15:30 CAT', '16:00 - 17:30 CAT'] },
        { dayOfWeek: 'Thursday', slots: ['14:00 - 15:30 CAT', '16:00 - 17:30 CAT'] },
        { dayOfWeek: 'Saturday', slots: ['10:00 - 12:00 CAT (Essay Writing Masterclass)'] },
      ],
      reviews: [
        { id: 'r-9', studentName: 'Mufaro C.', rating: 5, comment: 'Ms. Mataruse turned my D in English essay writing into an A in just one term. Her feedback on creative writing is priceless.', date: '2026-10-12' },
      ],
    },
  ];

  private bookings: BookingRecord[] = [
    {
      _id: 'bk-001',
      studentId: 'usr-student-01',
      studentName: 'Tawanda Sibanda',
      studentEmail: 'tawanda@student.eduenlighten.ac',
      teacherId: 't-ind-001',
      teacherName: 'Eng. Farai Chiware',
      subject: 'Cambridge IGCSE Mathematics – Quadratic Functions & Calculus',
      curriculum: 'cambridge',
      scheduledDate: '2026-10-22',
      timeSlot: '16:00 - 17:00 CAT',
      durationMinutes: 60,
      learningGoals: 'Review Paper 4 past questions on quadratic graphs, completing the square, and differentiation.',
      status: 'confirmed',
      meetingUrl: 'https://meet.jit.si/eduenlighten-tutor-booking-bk001',
      roomId: 'eduenlighten-tutor-booking-bk001',
      priceUsd: 25,
      paymentStatus: 'paid',
      createdAt: '2026-10-18T10:00:00.000Z',
    },
    {
      _id: 'bk-002',
      studentId: 'usr-student-02',
      studentName: 'Chipo Mutasa',
      studentEmail: 'chipo.mutasa@example.com',
      teacherId: 't-ind-002',
      teacherName: 'Mrs. Grace Moyo',
      subject: 'ZIMSEC Ordinary Level Combined Science – Organic Chemistry & Acids',
      curriculum: 'zimsec',
      scheduledDate: '2026-10-24',
      timeSlot: '14:00 - 15:00 CAT',
      durationMinutes: 60,
      learningGoals: 'Prepare for Section B structured questions on chemical equations and electrolysis.',
      status: 'confirmed',
      meetingUrl: 'https://meet.jit.si/eduenlighten-tutor-booking-bk002',
      roomId: 'eduenlighten-tutor-booking-bk002',
      priceUsd: 18,
      paymentStatus: 'paid',
      createdAt: '2026-10-18T11:30:00.000Z',
    },
  ];

  // ------------------------------------
  // Institution Methods
  // ------------------------------------
  public getAllInstitutions(type?: 'high_school' | 'vocational_institution'): TenantInstitution[] {
    if (type) {
      return this.institutions.filter((inst) => inst.type === type && inst.isActive);
    }
    return this.institutions.filter((inst) => inst.isActive);
  }

  public getInstitutionBySlug(slug: string): TenantInstitution | undefined {
    const s = slug.toLowerCase();
    return this.institutions.find(
      (inst) =>
        (inst.slug.toLowerCase() === s ||
         (s === 'st-georges-college' && inst.slug === 'redwood-college') ||
         (s === 'prince-edward-school' && inst.slug === 'excel-high-school')) &&
        inst.isActive
    );
  }

  public getInstitutionById(id: string): TenantInstitution | undefined {
    return this.institutions.find((inst) => inst._id === id);
  }

  public registerInstitution(data: {
    name: string;
    type: 'high_school' | 'vocational_institution';
    contactEmail: string;
    contactPhone?: string;
    city?: string;
    country?: string;
    plan: 'starter' | 'standard' | 'enterprise';
    billingCycle?: 'per_term' | 'annual' | 'monthly';
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    tagline?: string;
    description?: string;
    curriculaSupported?: string[];
  }): TenantInstitution {
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const existing = this.institutions.find((i) => i.slug === slug);
    const finalSlug = existing ? `${slug}-${Date.now().toString().slice(-4)}` : slug;

    const termPrices: Record<string, number> = {
      starter: data.type === 'high_school' ? 350 : 450,
      standard: 200,
      enterprise: data.type === 'high_school' ? 1200 : 1500,
    };

    const maxSeats: Record<string, number> = {
      starter: 150,
      standard: 450,
      enterprise: 1200,
    };

    const newInst: TenantInstitution = {
      _id: `inst-${Date.now().toString(36)}`,
      name: data.name,
      slug: finalSlug,
      type: data.type,
      tagline: data.tagline || (data.type === 'high_school' ? 'Nurturing Academic Excellence & Global Leaders' : 'Accredited Hands-on Technical Mastery & Vocational Trades'),
      description: data.description || `Subscribed online learning portal for ${data.name}. Provides isolated tenant access, curriculum tracking, and live virtual classrooms.`,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone || '+263 77 000 0000',
      address: 'Main Campus',
      city: data.city || 'Harare',
      country: data.country || 'Zimbabwe',
      branding: {
        logoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80',
        bannerUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80',
        primaryColor: data.primaryColor || (data.type === 'high_school' ? '#1e3a8a' : '#0f766e'),
        secondaryColor: data.secondaryColor || '#0f172a',
        accentColor: data.accentColor || '#f59e0b',
      },
      subscription: {
        plan: data.plan,
        status: 'active',
        billingCycle: data.billingCycle || 'per_term',
        termPriceUsd: termPrices[data.plan] || 200,
        maxStudents: maxSeats[data.plan] || 450,
        maxTeachers: data.plan === 'enterprise' ? 60 : 30,
        startDate: new Date().toISOString(),
        renewalDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(), // 4 months (1 term)
      },
      curriculaSupported: data.curriculaSupported || (data.type === 'high_school' ? ['cambridge', 'zimsec'] : ['vocational_trades', 'digital_skills']),
      enrolledStudentsCount: 1,
      assignedTeachersCount: 1,
      classes: [
        {
          id: `c-${Date.now()}`,
          name: data.type === 'high_school' ? 'Form 1 Foundation Stream' : 'Foundational Vocational Workshop',
          gradeLevel: data.type === 'high_school' ? 'Form 1' : 'Level 1 Certificate',
          classTeacher: 'Lead Academic Educator',
          studentCount: 1,
          subjects: data.type === 'high_school' ? ['Mathematics', 'Science', 'English'] : ['Practical Workshop Safety', 'Trade Theory'],
        },
      ],
      announcements: [
        {
          id: `a-${Date.now()}`,
          title: `Welcome to ${data.name} Online Learning Portal`,
          date: new Date().toISOString().slice(0, 10),
          content: 'This dedicated digital portal gives our faculty and students isolated, secure access to syllabus modules, assignments, and scheduled live lectures.',
        },
      ],
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    this.institutions.unshift(newInst);
    return newInst;
  }

  // ------------------------------------
  // Independent Teacher Methods
  // ------------------------------------
  public getAllIndependentTeachers(filters?: {
    curriculum?: string;
    subject?: string;
    maxRate?: number;
    search?: string;
  }): IndependentTeacher[] {
    let list = [...this.independentTeachers];

    if (filters?.curriculum && filters.curriculum !== 'all') {
      const curr = filters.curriculum.toLowerCase();
      list = list.filter((t) => t.curriculumSpecialties.some((c) => c.toLowerCase().includes(curr)));
    }

    if (filters?.subject && filters.subject !== 'all') {
      const subj = filters.subject.toLowerCase();
      list = list.filter((t) => t.authorizedSubjects.some((s) => s.toLowerCase().includes(subj)));
    }

    if (filters?.maxRate && filters.maxRate > 0) {
      list = list.filter((t) => t.hourlyRateUsd <= filters.maxRate!);
    }

    if (filters?.search) {
      const term = filters.search.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(term) ||
          t.headline.toLowerCase().includes(term) ||
          t.bio.toLowerCase().includes(term) ||
          t.authorizedSubjects.some((s) => s.toLowerCase().includes(term))
      );
    }

    return list;
  }

  public getIndependentTeacherById(id: string): IndependentTeacher | undefined {
    return this.independentTeachers.find((t) => t._id === id || t.userId === id);
  }

  public registerIndependentTeacher(data: {
    name: string;
    email: string;
    avatar?: string;
    headline: string;
    bio: string;
    qualifications: { degree: string; institution: string; yearCompleted: number }[];
    teachingExperienceYears: number;
    curriculumSpecialties: string[];
    authorizedSubjects: string[];
    hourlyRateUsd: number;
    sessionBookingPriceUsd?: number;
    languages?: string[];
    availabilitySchedule?: { dayOfWeek: string; slots: string[] }[];
    introVideoUrl?: string;
  }): IndependentTeacher {
    const newTeacher: IndependentTeacher = {
      _id: `t-ind-${Date.now().toString(36)}`,
      userId: `usr-${Date.now().toString(36)}`,
      name: data.name,
      email: data.email,
      avatar: data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      headline: data.headline,
      bio: data.bio,
      isIndependentTeacher: true,
      institutionAffiliation: 'EduEnlighten Independent Faculty',
      qualifications: data.qualifications,
      teachingExperienceYears: data.teachingExperienceYears || 2,
      curriculumSpecialties: data.curriculumSpecialties || ['Cambridge International'],
      authorizedSubjects: data.authorizedSubjects || ['General Mathematics'],
      languages: data.languages || ['English'],
      hourlyRateUsd: data.hourlyRateUsd || 20,
      sessionBookingPriceUsd: data.sessionBookingPriceUsd || data.hourlyRateUsd || 20,
      totalStudentsTaught: 0,
      rating: 5.0,
      reviewsCount: 0,
      safeguardingVetted: true,
      availabilitySchedule: data.availabilitySchedule || [
        { dayOfWeek: 'Monday', slots: ['14:00 - 15:00 CAT', '16:00 - 17:00 CAT'] },
        { dayOfWeek: 'Wednesday', slots: ['14:00 - 15:00 CAT', '16:00 - 17:00 CAT'] },
        { dayOfWeek: 'Saturday', slots: ['10:00 - 11:30 CAT', '14:00 - 15:30 CAT'] },
      ],
      introVideoUrl: data.introVideoUrl || '',
      reviews: [],
    };

    this.independentTeachers.unshift(newTeacher);
    return newTeacher;
  }

  // ------------------------------------
  // Student-Teacher Connection & Bookings
  // ------------------------------------
  public createTeacherBooking(data: {
    studentId?: string;
    studentName: string;
    studentEmail: string;
    teacherId: string;
    subject: string;
    curriculum: string;
    scheduledDate: string;
    timeSlot: string;
    learningGoals: string;
    priceUsd?: number;
  }): BookingRecord {
    const teacher = this.getIndependentTeacherById(data.teacherId);
    const bookingId = `bk-${Date.now().toString(36)}`;
    const roomId = `eduenlighten-tutor-booking-${bookingId}`;

    const newBooking: BookingRecord = {
      _id: bookingId,
      studentId: data.studentId || 'guest-student',
      studentName: data.studentName,
      studentEmail: data.studentEmail,
      teacherId: data.teacherId,
      teacherName: teacher ? teacher.name : 'EduEnlighten Teacher',
      subject: data.subject,
      curriculum: data.curriculum,
      scheduledDate: data.scheduledDate,
      timeSlot: data.timeSlot,
      durationMinutes: 60,
      learningGoals: data.learningGoals,
      status: 'confirmed',
      meetingUrl: `https://meet.jit.si/${roomId}`,
      roomId,
      priceUsd: data.priceUsd || (teacher ? teacher.sessionBookingPriceUsd : 20),
      paymentStatus: 'paid',
      createdAt: new Date().toISOString(),
    };

    this.bookings.unshift(newBooking);
    return newBooking;
  }

  public getTeacherBookings(teacherId: string): BookingRecord[] {
    return this.bookings.filter((b) => b.teacherId === teacherId);
  }

  public getStudentBookings(studentEmailOrId: string): BookingRecord[] {
    return this.bookings.filter(
      (b) => b.studentId === studentEmailOrId || b.studentEmail.toLowerCase() === studentEmailOrId.toLowerCase()
    );
  }
}

export const store = new StoreService();
