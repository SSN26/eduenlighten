import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { StudentProfile } from '../models/StudentProfile.js';
import { TeacherProfile } from '../models/TeacherProfile.js';
import { TeacherApplication } from '../models/TeacherApplication.js';
import { Programme } from '../models/Programme.js';
import { Curriculum } from '../models/Curriculum.js';
import { Subject } from '../models/Subject.js';
import { Course } from '../models/Course.js';
import { Module } from '../models/Module.js';
import { Lesson } from '../models/Lesson.js';
import { Quiz } from '../models/Quiz.js';
import { Assignment } from '../models/Assignment.js';
import { LiveSession } from '../models/LiveSession.js';
import { Announcement } from '../models/SupportAndAudit.js';

export const seedDatabase = async () => {
  const isConnected = await connectDB();
  if (!isConnected) {
    console.error('Cannot run seed script: MongoDB is not connected.');
    return;
  }

  console.log('[Seed] Clearing existing records for clean initialization...');
  await Promise.all([
    User.deleteMany({}),
    StudentProfile.deleteMany({}),
    TeacherProfile.deleteMany({}),
    TeacherApplication.deleteMany({}),
    Programme.deleteMany({}),
    Curriculum.deleteMany({}),
    Subject.deleteMany({}),
    Course.deleteMany({}),
    Module.deleteMany({}),
    Lesson.deleteMany({}),
    Quiz.deleteMany({}),
    Assignment.deleteMany({}),
    LiveSession.deleteMany({}),
    Announcement.deleteMany({}),
  ]);

  console.log('[Seed] Creating Programmes...');
  const highSchoolProgramme = await Programme.create({
    name: 'High School Academy',
    slug: 'high-school',
    tagline: 'Structured, syllabus-aligned secondary education for global and local qualifications',
    description:
      'Master Cambridge IGCSE, AS/A Level, and ZIMSEC O and A Level subjects through structured modules, past-paper revision, and live educator support.',
    icon: 'GraduationCap',
    order: 1,
  });

  const digitalSkillsProgramme = await Programme.create({
    name: 'Digital Skills Academy',
    slug: 'digital-skills',
    tagline: 'Practical, industry-led digital training for modern careers',
    description:
      'Gain high-demand employable skills in Frontend Development, Backend APIs, Product Management, and Digital Marketing with real-world portfolio projects.',
    icon: 'Code2',
    order: 2,
  });

  console.log('[Seed] Creating Curricula...');
  const cambridgeCurriculum = await Curriculum.create({
    programme: highSchoolProgramme._id,
    name: 'Cambridge International',
    code: 'cambridge',
    slug: 'cambridge',
    tagline: 'Internationally recognized academic excellence',
    description:
      'Comprehensive syllabus coverage and rigorous exam preparation for Cambridge IGCSE, AS Level, and A Level qualifications.',
    stages: [
      { name: 'Cambridge IGCSE', code: 'igcse', description: 'Comprehensive curriculum for ages 14–16' },
      { name: 'Cambridge International AS & A Level', code: 'a_level', description: 'Advanced pre-university qualifications' },
    ],
    officialExamDisclaimer:
      'EduEnlighten is an independent digital school offering syllabus-aligned preparation and structured instruction. We are not an official Cambridge examination board or examination centre.',
    badgeText: 'Cambridge Pathway',
    colorScheme: { primary: '#0369a1', secondary: '#0284c7' },
    order: 1,
  });

  const zimsecCurriculum = await Curriculum.create({
    programme: highSchoolProgramme._id,
    name: 'ZIMSEC Curriculum',
    code: 'zimsec',
    slug: 'zimsec',
    tagline: 'Zimbabwe National Academic Curriculum with Past-Paper Focus',
    description:
      'Thorough topic-by-topic instruction, local syllabus coverage, and past-exam techniques for ZIMSEC Ordinary Level and Advanced Level candidates.',
    stages: [
      { name: 'ZIMSEC Ordinary Level', code: 'o_level', description: 'Comprehensive O-Level syllabus mastery' },
      { name: 'ZIMSEC Advanced Level', code: 'a_level', description: 'In-depth A-Level subject specialization' },
    ],
    officialExamDisclaimer:
      'EduEnlighten is an independent learning platform providing curriculum-aligned revision. Students sit formal ZIMSEC examinations at accredited regional examination centres.',
    badgeText: 'ZIMSEC Pathway',
    colorScheme: { primary: '#0f766e', secondary: '#14b8a6' },
    order: 2,
  });

  const digitalSkillsCurriculum = await Curriculum.create({
    programme: digitalSkillsProgramme._id,
    name: 'Professional Digital Skills',
    code: 'digital_skills',
    slug: 'digital-skills',
    tagline: 'Employable Tech & Business Skills for Modern Industry',
    description:
      'Hands-on project-based bootcamps led by senior software architects and industry practitioners.',
    stages: [
      { name: 'Foundations', code: 'foundations', description: 'Core principles and hands-on exercises' },
      { name: 'Professional Practitioner', code: 'practitioner', description: 'Full stack workflows, architecture, and live projects' },
    ],
    officialExamDisclaimer:
      'EduEnlighten certificates verify course completion and practical project submission. They do not constitute formal university degrees.',
    badgeText: 'Digital Skills',
    colorScheme: { primary: '#7c3aed', secondary: '#a855f7' },
    order: 3,
  });

  console.log('[Seed] Creating Subjects...');
  // Cambridge Subjects
  const cambridgeMath = await Subject.create({
    curriculum: cambridgeCurriculum._id,
    programme: highSchoolProgramme._id,
    name: 'Mathematics',
    code: 'CAM-MATH',
    slug: 'cambridge-mathematics',
    category: 'Sciences',
    level: 'Cambridge IGCSE & A Level',
    syllabusCode: '0580 / 9709',
    description: 'Algebra, Geometry, Trigonometry, Calculus, and Statistics for Cambridge examinations.',
    keyTopics: ['Number & Algebra', 'Functions & Quadratic Equations', 'Trigonometry', 'Calculus', 'Probability & Statistics'],
    icon: 'Calculator',
    order: 1,
  });

  const cambridgePhysics = await Subject.create({
    curriculum: cambridgeCurriculum._id,
    programme: highSchoolProgramme._id,
    name: 'Physics',
    code: 'CAM-PHY',
    slug: 'cambridge-physics',
    category: 'Sciences',
    level: 'Cambridge IGCSE',
    syllabusCode: '0625',
    description: 'Mechanics, Thermal Physics, Waves, Electricity, Magnetism, and Nuclear Physics.',
    keyTopics: ['General Physics & Motion', 'Thermal Physics', 'Waves & Optics', 'Electricity & Magnetism', 'Atomic Physics'],
    icon: 'Atom',
    order: 2,
  });

  const cambridgeCS = await Subject.create({
    curriculum: cambridgeCurriculum._id,
    programme: highSchoolProgramme._id,
    name: 'Computer Science',
    code: 'CAM-CS',
    slug: 'cambridge-computer-science',
    category: 'Technology',
    level: 'Cambridge IGCSE & A Level',
    syllabusCode: '0478 / 9618',
    description: 'Theory of computation, algorithmic problem solving, Python programming, and hardware architectures.',
    keyTopics: ['Data Representation', 'Hardware & Software', 'Algorithms & Pseudocode', 'Programming with Python', 'Databases'],
    icon: 'Cpu',
    order: 3,
  });

  // ZIMSEC Subjects
  const zimsecMath = await Subject.create({
    curriculum: zimsecCurriculum._id,
    programme: highSchoolProgramme._id,
    name: 'Mathematics',
    code: 'ZIM-MATH',
    slug: 'zimsec-mathematics',
    category: 'Sciences',
    level: 'ZIMSEC O-Level',
    syllabusCode: '4004',
    description: 'Comprehensive preparation for ZIMSEC Ordinary Level Paper 1 and Paper 2.',
    keyTopics: ['Matrices & Transformations', 'Vectors', 'Consumer Arithmetic', 'Mensuration', 'Statistics'],
    icon: 'Compass',
    order: 4,
  });

  const zimsecScience = await Subject.create({
    curriculum: zimsecCurriculum._id,
    programme: highSchoolProgramme._id,
    name: 'Combined Science',
    code: 'ZIM-SCI',
    slug: 'zimsec-combined-science',
    category: 'Sciences',
    level: 'ZIMSEC O-Level',
    syllabusCode: '4003',
    description: 'Integrated Biology, Chemistry, and Physics aligned strictly with the ZIMSEC syllabus.',
    keyTopics: ['Cell Biology & Genetics', 'Chemical Bonding & Acids', 'Electricity & Energy Transfer', 'Ecology'],
    icon: 'FlaskConical',
    order: 5,
  });

  // Digital Skills Subjects
  const webDevSubject = await Subject.create({
    curriculum: digitalSkillsCurriculum._id,
    programme: digitalSkillsProgramme._id,
    name: 'Frontend Software Development',
    code: 'SKILL-FED',
    slug: 'frontend-software-development',
    category: 'Technology',
    level: 'Professional',
    description: 'Modern responsive web development using HTML5, CSS3, JavaScript, TypeScript, React, and Next.js.',
    keyTopics: ['HTML5 & Responsive CSS', 'Modern JavaScript (ES6+)', 'TypeScript Foundations', 'React Component Architecture', 'Next.js App Router'],
    icon: 'Layout',
    order: 6,
  });

  const backendDevSubject = await Subject.create({
    curriculum: digitalSkillsCurriculum._id,
    programme: digitalSkillsProgramme._id,
    name: 'Backend Software Development',
    code: 'SKILL-BED',
    slug: 'backend-software-development',
    category: 'Technology',
    level: 'Professional',
    description: 'REST API architecture, Node.js, Express, MongoDB, security, authentication, and deployment.',
    keyTopics: ['Node.js Runtime', 'Express.js REST APIs', 'MongoDB & Mongoose Schema Design', 'JWT Security & Hashing', 'Testing & Deployment'],
    icon: 'Server',
    order: 7,
  });

  console.log('[Seed] Creating Verified Users...');
  const superAdmin = await User.create({
    name: 'EduEnlighten Super Administrator',
    email: 'admin@eduenlighten.ac',
    password: 'AdminPass123!',
    role: 'super_admin',
    isEmailVerified: true,
    status: 'active',
    country: 'Zimbabwe',
  });

  const academicAdmin = await User.create({
    name: 'Dr. Sarah Moyo (Academic Dean)',
    email: 'academic@eduenlighten.ac',
    password: 'AcademicPass123!',
    role: 'academic_admin',
    isEmailVerified: true,
    status: 'active',
    country: 'Zimbabwe',
  });

  const teacher1 = await User.create({
    name: 'Eng. Farai Chiware',
    email: 'dr.chiware@eduenlighten.ac',
    password: 'TeacherPass123!',
    role: 'teacher',
    isEmailVerified: true,
    status: 'active',
    country: 'Zimbabwe',
  });

  await TeacherProfile.create({
    user: teacher1._id,
    headline: 'Senior Cambridge & Software Engineering Instructor',
    bio: 'Over 12 years of experience teaching Cambridge IGCSE / A-Level Mathematics and Computer Science, alongside enterprise software engineering.',
    qualifications: [
      { degree: 'BSc Computer Science (Hons)', institution: 'University of Zimbabwe', yearCompleted: 2012 },
      { degree: 'MSc Software Engineering', institution: 'University of Cape Town', yearCompleted: 2016 },
    ],
    teachingExperienceYears: 12,
    curriculumSpecialties: ['Cambridge International', 'Professional Digital Skills'],
    authorizedSubjects: ['Mathematics', 'Computer Science', 'Frontend Software Development', 'Backend Software Development'],
    isApproved: true,
    safeguardingVetted: true,
    safeguardingVettedAt: new Date(),
    safeguardingVettedBy: superAdmin._id,
    hourlyRateUsd: 25,
    rating: 4.95,
    reviewsCount: 38,
  });

  const teacher2 = await User.create({
    name: 'Mrs. Grace Moyo',
    email: 'mrs.moyo@eduenlighten.ac',
    password: 'TeacherPass123!',
    role: 'teacher',
    isEmailVerified: true,
    status: 'active',
    country: 'Zimbabwe',
  });

  await TeacherProfile.create({
    user: teacher2._id,
    headline: 'Master ZIMSEC Mathematics & Science Specialist',
    bio: 'Award-winning educator dedicated to helping students conquer ZIMSEC Ordinary Level and A-Level examinations with step-by-step methodologies.',
    qualifications: [
      { degree: 'Bachelor of Education in Mathematics', institution: 'Midlands State University', yearCompleted: 2010 },
    ],
    teachingExperienceYears: 14,
    curriculumSpecialties: ['ZIMSEC Curriculum'],
    authorizedSubjects: ['Mathematics', 'Combined Science'],
    isApproved: true,
    safeguardingVetted: true,
    safeguardingVettedAt: new Date(),
    safeguardingVettedBy: academicAdmin._id,
    hourlyRateUsd: 20,
    rating: 4.9,
    reviewsCount: 52,
  });

  const studentUser = await User.create({
    name: 'Tawanda Sibanda',
    email: 'tawanda@student.eduenlighten.ac',
    password: 'StudentPass123!',
    role: 'student',
    isEmailVerified: true,
    status: 'active',
    country: 'Zimbabwe',
  });

  await StudentProfile.create({
    user: studentUser._id,
    curriculum: 'both',
    currentLevel: 'IGCSE & O-Level Candidate',
    learningGoals: ['Pass Cambridge Mathematics with an A*', 'Build Web Applications'],
    schoolName: 'EduEnlighten Digital School',
    city: 'Bulawayo',
    country: 'Zimbabwe',
  });

  const parentUser = await User.create({
    name: 'Mr. Kenneth Sibanda',
    email: 'parent.moyo@eduenlighten.ac',
    password: 'ParentPass123!',
    role: 'parent',
    isEmailVerified: true,
    status: 'active',
    country: 'Zimbabwe',
    linkedStudents: [studentUser._id],
  });

  console.log('[Seed] Creating Courses with Modules and Lessons...');
  // Course 1: Cambridge IGCSE Mathematics Mastery
  const cambridgeCourse = await Course.create({
    title: 'Cambridge IGCSE Mathematics Masterclass (0580)',
    slug: 'cambridge-igcse-mathematics-masterclass',
    tagline: 'Complete syllabus coverage with worked past exam solutions and interactive practice',
    shortDescription: 'Master the entire Cambridge IGCSE 0580 syllabus with clear breakdowns, exam tips, and problem-solving strategies.',
    description:
      'This comprehensive course prepares students for the Cambridge IGCSE Mathematics (0580) Extended and Core syllabus. Taught by certified educators with proven A* track records, you will gain deep conceptual clarity on number, algebra, geometry, mensuration, trigonometry, and statistics.',
    programme: highSchoolProgramme._id,
    curriculum: cambridgeCurriculum._id,
    subject: cambridgeMath._id,
    teacher: teacher1._id,
    level: 'Cambridge IGCSE',
    deliveryFormat: 'blended',
    prerequisites: ['Basic Middle School Mathematics', 'Calculator & Geometry Set'],
    learningOutcomes: [
      'Confidently solve complex algebraic expressions and simultaneous equations',
      'Apply trigonometry and coordinate geometry to past Cambridge exam questions',
      'Calculate statistical measures of spread, cumulative frequency, and histograms',
      'Master time management strategies for Paper 2 and Paper 4',
    ],
    pricingType: 'paid',
    priceUsd: 35,
    discountPriceUsd: 25,
    priceZwl: 625,
    isPublished: true,
    approvalStatus: 'approved',
    enrolledStudentsCount: 42,
    rating: 4.95,
    durationHours: 32,
    featured: true,
    certificateEligible: true,
  });

  const mod1 = await Module.create({
    course: cambridgeCourse._id,
    title: 'Module 1: Numbers, Set Notation and Calculation Techniques',
    description: 'Foundations of number theory, prime factorisation, indices, and set diagrams.',
    order: 1,
  });

  await Lesson.create({
    course: cambridgeCourse._id,
    module: mod1._id,
    title: 'Lesson 1.1: Standard Form, Significant Figures and Estimation',
    type: 'video',
    durationMinutes: 25,
    content: 'Mastering scientific notation and estimation methods commonly tested on Paper 2.',
    videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    isFreePreview: true,
    order: 1,
  });

  await Lesson.create({
    course: cambridgeCourse._id,
    module: mod1._id,
    title: 'Lesson 1.2: Set Theory, Venn Diagrams and Subsets',
    type: 'video',
    durationMinutes: 30,
    content: 'Visualizing set relations, intersections, unions, and shaded regions.',
    isFreePreview: false,
    order: 2,
  });

  const quiz1 = await Quiz.create({
    course: cambridgeCourse._id,
    module: mod1._id,
    title: 'Module 1 Diagnostic Quiz: Sets & Number Theory',
    description: 'Test your understanding of significant figures, sets, and indices.',
    durationMinutes: 15,
    passingScorePercentage: 70,
    questions: [
      {
        questionText: 'What is 0.000458 written in standard scientific notation to 2 significant figures?',
        type: 'multiple_choice',
        options: ['4.5 × 10^-4', '4.6 × 10^-4', '4.6 × 10^-5', '45.8 × 10^-5'],
        correctAnswer: '4.6 × 10^-4',
        explanation: 'Rounding 458 to two significant figures gives 46, so 4.6 × 10^-4.',
        points: 10,
      },
      {
        questionText: 'True or False: The empty set ∅ is a subset of every set.',
        type: 'true_false',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'By definition in set theory, the empty set is a subset of any set.',
        points: 10,
      },
    ],
  });

  await Lesson.create({
    course: cambridgeCourse._id,
    module: mod1._id,
    title: 'Lesson 1.3: Number & Sets Assessment',
    type: 'quiz',
    durationMinutes: 15,
    quizRef: quiz1._id,
    order: 3,
  });

  // Course 2: ZIMSEC O-Level Mathematics Exam Revision
  const zimsecCourse = await Course.create({
    title: 'ZIMSEC Ordinary Level Mathematics Revision Masterclass (4004)',
    slug: 'zimsec-o-level-mathematics-revision',
    tagline: 'Topic-by-topic drills, transformation geometry, vectors, and Paper 2 scoring methods',
    shortDescription: 'Excel in your ZIMSEC O-Level Mathematics with structured video lessons and past exam solutions.',
    description:
      'Designed specifically for Zimbabwean students preparing for June and November ZIMSEC examinations. Covers transformation geometry, matrices, probability, algebraic graphs, and trigonometry with proven marks-maximizing techniques.',
    programme: highSchoolProgramme._id,
    curriculum: zimsecCurriculum._id,
    subject: zimsecMath._id,
    teacher: teacher2._id,
    level: 'ZIMSEC Ordinary Level',
    deliveryFormat: 'blended',
    prerequisites: ['Form 3/4 Mathematics background', 'Four-figure mathematical tables'],
    learningOutcomes: [
      'Master matrix transformations: reflections, rotations, enlargements, and shear',
      'Solve quadratic equations using formulas and graphical methods',
      'Accurately answer 12-mark Section B questions in ZIMSEC Paper 2',
    ],
    pricingType: 'paid',
    priceUsd: 20,
    discountPriceUsd: 15,
    priceZwl: 375,
    isPublished: true,
    approvalStatus: 'approved',
    enrolledStudentsCount: 68,
    rating: 4.9,
    durationHours: 28,
    featured: true,
    certificateEligible: true,
  });

  // Course 3: Digital Skills - Frontend Software Development
  const frontendCourse = await Course.create({
    title: 'Modern Frontend Web Development: React & Next.js Bootcamp',
    slug: 'modern-frontend-development-react-nextjs',
    tagline: 'Build and deploy enterprise web applications with TypeScript, Tailwind CSS, and Next.js',
    shortDescription: 'Learn modern software development from scratch and build a hireable portfolio of web projects.',
    description:
      'Become a skilled frontend developer ready for remote and local industry roles. From HTML5 and modern JavaScript (ES2022) to React component architecture, Next.js App Router, state management, and production cloud deployment.',
    programme: digitalSkillsProgramme._id,
    curriculum: digitalSkillsCurriculum._id,
    subject: webDevSubject._id,
    teacher: teacher1._id,
    level: 'Professional',
    deliveryFormat: 'self_paced',
    prerequisites: ['Basic computer literacy', 'A laptop or desktop computer'],
    learningOutcomes: [
      'Build responsive, mobile-first web pages using Tailwind CSS and modern CSS',
      'Write type-safe frontends with TypeScript and React',
      'Integrate REST APIs and manage client/server state effectively',
      'Deploy full-stack web applications to production hosting platforms',
    ],
    pricingType: 'paid',
    priceUsd: 49,
    discountPriceUsd: 39,
    priceZwl: 975,
    isPublished: true,
    approvalStatus: 'approved',
    enrolledStudentsCount: 84,
    rating: 4.98,
    durationHours: 45,
    featured: true,
    certificateEligible: true,
  });

  const feMod1 = await Module.create({
    course: frontendCourse._id,
    title: 'Module 1: Foundations of Responsive Web Design',
    description: 'HTML5 semantic architecture, CSS grid/flexbox, and Tailwind CSS design systems.',
    order: 1,
  });

  await Lesson.create({
    course: frontendCourse._id,
    module: feMod1._id,
    title: 'Lesson 1.1: Modern Semantic HTML & Accessibility (a11y)',
    type: 'video',
    durationMinutes: 35,
    content: 'Building accessible, SEO-optimized markup following modern W3C standards.',
    isFreePreview: true,
    order: 1,
  });

  await Lesson.create({
    course: frontendCourse._id,
    module: feMod1._id,
    title: 'Lesson 1.2: Tailwind CSS Utility Architecture & Design Tokens',
    type: 'video',
    durationMinutes: 40,
    content: 'Creating cohesive color palettes, spacing systems, and responsive layouts.',
    isFreePreview: false,
    order: 2,
  });

  const feAssignment1 = await Assignment.create({
    course: frontendCourse._id,
    module: feMod1._id,
    title: 'Practical Project 1: Responsive Portfolio Website',
    instructions:
      'Build and submit a mobile-responsive personal portfolio or product landing page using semantic HTML and Tailwind CSS. Submit your GitHub repository URL or live preview link.',
    rubricSummary: 'Visual aesthetic (30%), Mobile responsiveness (30%), Clean semantic markup (20%), Accessibility (20%).',
    maxPoints: 100,
    weightPercentage: 25,
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    practicalProjectType: 'web_development',
  });

  await Lesson.create({
    course: frontendCourse._id,
    module: feMod1._id,
    title: 'Lesson 1.3: Project Brief: Portfolio Website',
    type: 'assignment',
    durationMinutes: 60,
    assignmentRef: feAssignment1._id,
    order: 3,
  });

  console.log('[Seed] Creating Sample Scheduled Live Session...');
  await LiveSession.create({
    course: cambridgeCourse._id,
    teacher: teacher1._id,
    title: 'Live Cambridge IGCSE Math Revision: Paper 2 Past-Paper Drill',
    description: 'Interactive session working through the most difficult questions from the latest Cambridge exam session.',
    scheduledStartTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // in 2 days
    scheduledEndTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000),
    meetingProvider: 'jitsi',
    roomId: 'eduenlighten-cambridge-math-live',
    joinUrl: 'https://meet.jit.si/eduenlighten-cambridge-math-live',
    status: 'scheduled',
  });

  console.log('[Seed] Creating Platform Announcements...');
  await Announcement.create({
    title: '🎉 Welcome to EduEnlighten Digital School!',
    content:
      'We are delighted to welcome all students, parents, and educators. Explore our Cambridge and ZIMSEC high-school pathways, or kickstart an employable tech career with our Digital Skills Academy.',
    targetRole: 'all',
    author: superAdmin._id,
    isPinned: true,
    publishedAt: new Date(),
  });

  console.log('[Seed] Creating Pending Teacher Application for Admin Review Testing...');
  const prospectiveTeacher = await User.create({
    name: 'Kudzai Marufu',
    email: 'kudzai.marufu@example.com',
    password: 'TeacherPass123!',
    role: 'student', // starts as student until approved
    isEmailVerified: true,
    status: 'active',
  });

  await TeacherApplication.create({
    applicant: prospectiveTeacher._id,
    fullName: 'Kudzai Marufu',
    email: 'kudzai.marufu@example.com',
    phone: '+263772111222',
    country: 'Zimbabwe',
    city: 'Gweru',
    bio: 'Dedicated physics instructor with 7 years experience in secondary school laboratories and online tutoring.',
    qualificationsSummary: 'BSc Applied Physics, National University of Science and Technology (NUST)',
    teachingExperienceYears: 7,
    curriculaExpertise: ['Cambridge International', 'ZIMSEC Curriculum'],
    subjectsToTeach: ['Physics', 'Combined Science'],
    preferredFormat: 'blended',
    timeZone: 'Africa/Harare',
    safeguardingAgreed: true,
    termsAgreed: true,
    status: 'submitted',
    statusNotes: 'Application submitted and ready for academic interview review.',
  });

  console.log('\n====================================================');
  console.log('✅ EduEnlighten Database seeded successfully!');
  console.log('----------------------------------------------------');
  console.log('Verified Test Accounts:');
  console.log('🔑 Super Admin:     admin@eduenlighten.ac      / AdminPass123!');
  console.log('🔑 Academic Dean:   academic@eduenlighten.ac   / AcademicPass123!');
  console.log('🔑 Teacher (STEM):  dr.chiware@eduenlighten.ac / TeacherPass123!');
  console.log('🔑 Teacher (ZIMSEC):mrs.moyo@eduenlighten.ac   / TeacherPass123!');
  console.log('🔑 Student:         tawanda@student.eduenlighten.ac / StudentPass123!');
  console.log('🔑 Parent:          parent.moyo@eduenlighten.ac / ParentPass123!');
  console.log('====================================================\n');
};

// Execute if run directly
if (process.argv[1]?.includes('seed.ts') || process.argv[1]?.includes('seed.js')) {
  seedDatabase()
    .then(() => {
      console.log('[Seed] Finished. Exiting.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Seed Error] Database seed failed:', err);
      process.exit(1);
    });
}
