import { Course, ICourse, CourseApprovalStatus } from '../../models/Course.js';
import { Module } from '../../models/Module.js';
import { Lesson } from '../../models/Lesson.js';
import { Curriculum } from '../../models/Curriculum.js';
import { TeacherProfile } from '../../models/TeacherProfile.js';
import { AppError } from '../../middleware/errorHandler.js';

export class CoursesService {
  static async listCourses(filters: {
    curriculum?: string;
    programme?: string;
    subject?: string;
    level?: string;
    deliveryFormat?: string;
    pricingType?: string;
    search?: string;
    featured?: boolean;
    page?: number;
    limit?: number;
  }) {
    const query: any = { isPublished: true, approvalStatus: 'approved' };

    if (filters.curriculum && filters.curriculum !== 'all') {
      const curr = await Curriculum.findOne({ code: filters.curriculum });
      if (curr) {
        query.curriculum = curr._id;
      } else {
        query.curriculum = filters.curriculum;
      }
    }

    if (filters.subject && filters.subject !== 'all') {
      query.subject = filters.subject;
    }

    if (filters.level && filters.level !== 'all') {
      query.level = { $regex: filters.level, $options: 'i' };
    }

    if (filters.deliveryFormat && filters.deliveryFormat !== 'all') {
      query.deliveryFormat = filters.deliveryFormat;
    }

    if (filters.pricingType && filters.pricingType !== 'all') {
      query.pricingType = filters.pricingType;
    }

    if (filters.featured !== undefined) {
      query.featured = filters.featured;
    }

    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { shortDescription: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const page = Math.max(1, filters.page || 1);
    const limit = Math.max(1, filters.limit || 12);
    const skip = (page - 1) * limit;

    const [courses, total] = await Promise.all([
      Course.find(query)
        .populate('curriculum', 'name code slug officialExamDisclaimer')
        .populate('programme', 'name slug')
        .populate('subject', 'name code category level')
        .populate('teacher', 'name avatar')
        .sort({ featured: -1, rating: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Course.countDocuments(query),
    ]);

    return {
      courses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getCourseDetail(slugOrId: string) {
    const isId = slugOrId.match(/^[0-9a-fA-F]{24}$/);
    const query = isId ? { _id: slugOrId } : { slug: slugOrId };

    const course = await Course.findOne(query)
      .populate('curriculum')
      .populate('programme')
      .populate('subject')
      .populate('teacher', 'name avatar bio');

    if (!course) {
      throw new AppError('Course not found', 404);
    }

    // Fetch modules and lessons
    const modules = await Module.find({ course: course._id }).sort({ order: 1 });
    const moduleIds = modules.map((m) => m._id);
    const lessons = await Lesson.find({ module: { $in: moduleIds } }).sort({ order: 1 });

    const modulesWithLessons = modules.map((mod) => ({
      ...mod.toObject(),
      lessons: lessons.filter((l) => l.module.toString() === mod._id.toString()),
    }));

    return {
      course,
      modules: modulesWithLessons,
    };
  }

  static async createCourse(teacherId: string, data: any) {
    // Verify teacher profile is approved
    const profile = await TeacherProfile.findOne({ user: teacherId });
    if (!profile || !profile.isApproved) {
      throw new AppError('Only approved teachers can create and publish courses.', 403);
    }

    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);

    const course = new Course({
      ...data,
      teacher: teacherId,
      slug,
      approvalStatus: 'draft',
      isPublished: false,
    });

    await course.save();
    return course;
  }

  static async addModule(courseId: string, teacherId: string, data: { title: string; description?: string; order?: number }) {
    const course = await Course.findOne({ _id: courseId, teacher: teacherId });
    if (!course) {
      throw new AppError('Course not found or unauthorized', 403);
    }

    const count = await Module.countDocuments({ course: courseId });
    const module = new Module({
      course: courseId,
      title: data.title,
      description: data.description || '',
      order: data.order !== undefined ? data.order : count + 1,
    });

    await module.save();
    return module;
  }

  static async addLesson(courseId: string, moduleId: string, teacherId: string, data: any) {
    const course = await Course.findOne({ _id: courseId, teacher: teacherId });
    if (!course) {
      throw new AppError('Course not found or unauthorized', 403);
    }

    const count = await Lesson.countDocuments({ module: moduleId });
    const lesson = new Lesson({
      ...data,
      course: courseId,
      module: moduleId,
      order: data.order !== undefined ? data.order : count + 1,
    });

    await lesson.save();
    return lesson;
  }

  static async submitForApproval(courseId: string, teacherId: string) {
    const course = await Course.findOne({ _id: courseId, teacher: teacherId });
    if (!course) {
      throw new AppError('Course not found or unauthorized', 403);
    }

    course.approvalStatus = 'submitted';
    await course.save();
    return course;
  }

  static async reviewCourse(courseId: string, status: CourseApprovalStatus, rejectionReason?: string) {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new AppError('Course not found', 404);
    }

    course.approvalStatus = status;
    if (status === 'approved') {
      course.isPublished = true;
    } else if (status === 'rejected') {
      course.isPublished = false;
      course.rejectionReason = rejectionReason || 'Course requires syllabus and content adjustments.';
    }

    await course.save();
    return course;
  }
}
