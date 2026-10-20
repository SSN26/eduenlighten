import { Programme } from '../../models/Programme.js';
import { Curriculum } from '../../models/Curriculum.js';
import { Subject } from '../../models/Subject.js';
import { AppError } from '../../middleware/errorHandler.js';

export class ProgrammesService {
  static async getAllProgrammes() {
    return Programme.find({ isActive: true }).sort({ order: 1 });
  }

  static async getCurriculaByProgramme(programmeSlug?: string) {
    let filter: any = { isActive: true };
    if (programmeSlug) {
      const prog = await Programme.findOne({ slug: programmeSlug });
      if (prog) {
        filter.programme = prog._id;
      }
    }
    return Curriculum.find(filter).populate('programme', 'name slug').sort({ order: 1 });
  }

  static async getCurriculumByCode(code: string) {
    const curriculum = await Curriculum.findOne({ code, isActive: true }).populate('programme');
    if (!curriculum) {
      throw new AppError(`Curriculum with code '${code}' not found`, 404);
    }
    return curriculum;
  }

  static async getSubjects(curriculumCode?: string, category?: string) {
    const filter: any = { isActive: true };
    if (curriculumCode) {
      const curr = await Curriculum.findOne({ code: curriculumCode });
      if (curr) {
        filter.curriculum = curr._id;
      }
    }
    if (category && category !== 'all') {
      filter.category = category;
    }

    return Subject.find(filter)
      .populate('curriculum', 'name code slug')
      .populate('programme', 'name slug')
      .sort({ order: 1, name: 1 });
  }

  static async createSubject(data: {
    curriculumId: string;
    programmeId: string;
    name: string;
    code: string;
    category: any;
    level: string;
    syllabusCode?: string;
    description: string;
    keyTopics: string[];
    icon?: string;
  }) {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const subject = new Subject({
      ...data,
      slug,
      icon: data.icon || 'BookOpen',
    });
    await subject.save();
    return subject;
  }
}
