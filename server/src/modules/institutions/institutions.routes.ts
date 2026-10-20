import { Router, Request, Response } from 'express';
import { store } from '../../services/store.service.js';
import { Institution } from '../../models/Institution.js';

const router = Router();

// GET /api/institutions - List all institutions (high schools & vocational)
router.get('/', async (req: Request, res: Response) => {
  const type = req.query.type as 'high_school' | 'vocational_institution' | undefined;

  try {
    if (Institution.db?.readyState === 1) {
      const query: any = { isActive: true };
      if (type) query.type = type;
      const dbInstitutions = await Institution.find(query).sort({ createdAt: -1 });
      if (dbInstitutions && dbInstitutions.length > 0) {
        return res.status(200).json({
          success: true,
          count: dbInstitutions.length,
          data: dbInstitutions,
        });
      }
    }
  } catch (err) {
    // Graceful fallback to store service
  }

  const institutions = store.getAllInstitutions(type);
  return res.status(200).json({
    success: true,
    count: institutions.length,
    data: institutions,
  });
});

// GET /api/institutions/:slug - Retrieve isolated tenant by slug
router.get('/:slug', async (req: Request, res: Response) => {
  const slug = (Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug) as string;

  try {
    if (Institution.db?.readyState === 1) {
      const dbInst = await Institution.findOne({ slug: slug.toLowerCase(), isActive: true });
      if (dbInst) {
        return res.status(200).json({
          success: true,
          data: dbInst,
        });
      }
    }
  } catch (err) {
    // Graceful fallback to store service
  }

  const tenant = store.getInstitutionBySlug(slug);
  if (!tenant) {
    return res.status(404).json({
      success: false,
      message: `Tenant institution not found for slug '${slug}'. Please verify the school or vocational institute link.`,
    });
  }

  return res.status(200).json({
    success: true,
    data: tenant,
  });
});

// POST /api/institutions/subscribe - Register & subscribe new High School or Vocational Institution
router.post('/subscribe', async (req: Request, res: Response) => {
  const {
    name,
    type,
    contactEmail,
    contactPhone,
    city,
    country,
    plan,
    billingCycle,
    primaryColor,
    secondaryColor,
    accentColor,
    tagline,
    description,
    curriculaSupported,
  } = req.body;

  if (!name || !type || !contactEmail || !plan) {
    return res.status(400).json({
      success: false,
      message: 'Name, institution type (high_school or vocational_institution), contact email, and subscription plan are required.',
    });
  }

  if (type !== 'high_school' && type !== 'vocational_institution') {
    return res.status(400).json({
      success: false,
      message: "Type must be either 'high_school' or 'vocational_institution'.",
    });
  }

  const newInstitution = store.registerInstitution({
    name,
    type,
    contactEmail,
    contactPhone,
    city,
    country,
    plan,
    billingCycle,
    primaryColor,
    secondaryColor,
    accentColor,
    tagline,
    description,
    curriculaSupported,
  });

  // Also persist in MongoDB if connected
  try {
    if (Institution.db?.readyState === 1) {
      await Institution.create({
        name: newInstitution.name,
        slug: newInstitution.slug,
        type: newInstitution.type,
        tagline: newInstitution.tagline,
        description: newInstitution.description,
        contactEmail: newInstitution.contactEmail,
        contactPhone: newInstitution.contactPhone,
        city: newInstitution.city,
        country: newInstitution.country,
        branding: newInstitution.branding,
        subscription: newInstitution.subscription,
        curriculaSupported: newInstitution.curriculaSupported,
      });
    }
  } catch (err) {
    // In-memory record already saved
  }

  return res.status(201).json({
    success: true,
    message: `Successfully registered and subscribed ${newInstitution.name} to EduEnlighten multi-tenant portal.`,
    portalUrl: `/portal/${newInstitution.slug}`,
    data: newInstitution,
  });
});

// POST /api/institutions/:slug/classes - Add a class or trade cohort
router.post('/:slug/classes', (req: Request, res: Response) => {
  const slug = (Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug) as string;
  const { name, gradeLevel, classTeacher, studentCount, subjects } = req.body;

  const tenant = store.getInstitutionBySlug(slug);
  if (!tenant) {
    return res.status(404).json({ success: false, message: 'Institution not found.' });
  }

  if (!name || !gradeLevel) {
    return res.status(400).json({ success: false, message: 'Class name and grade level are required.' });
  }

  const newClass = {
    id: `c-${Date.now()}`,
    name,
    gradeLevel,
    classTeacher: classTeacher || 'Assigned Instructor',
    studentCount: Number(studentCount) || 0,
    subjects: Array.isArray(subjects) ? subjects : ['General Curriculum'],
  };

  tenant.classes.push(newClass);
  tenant.enrolledStudentsCount += newClass.studentCount;

  return res.status(201).json({
    success: true,
    message: 'Class/Cohort added successfully.',
    data: newClass,
  });
});

// POST /api/institutions/:slug/announcements - Add announcement
router.post('/:slug/announcements', (req: Request, res: Response) => {
  const slug = (Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug) as string;
  const { title, content } = req.body;

  const tenant = store.getInstitutionBySlug(slug);
  if (!tenant) {
    return res.status(404).json({ success: false, message: 'Institution not found.' });
  }

  if (!title || !content) {
    return res.status(400).json({ success: false, message: 'Title and content are required.' });
  }

  const newAnnouncement = {
    id: `a-${Date.now()}`,
    title,
    date: new Date().toISOString().slice(0, 10),
    content,
  };

  tenant.announcements.unshift(newAnnouncement);

  return res.status(201).json({
    success: true,
    message: 'Announcement posted to tenant portal.',
    data: newAnnouncement,
  });
});

export default router;
