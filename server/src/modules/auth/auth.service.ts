import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User, IUser, UserRole } from '../../models/User.js';
import { StudentProfile } from '../../models/StudentProfile.js';
import { TeacherProfile } from '../../models/TeacherProfile.js';
import { AppError } from '../../middleware/errorHandler.js';
import { ENV } from '../../config/env.js';

interface InMemoryUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone: string;
  country: string;
  isEmailVerified: boolean;
  status: string;
  curriculumPreference?: string;
}

const IN_MEMORY_USERS: InMemoryUser[] = [
  {
    _id: 'usr-student-001',
    name: 'Tawanda Moyo',
    email: 'tawanda@student.eduenlighten.ac',
    password: 'StudentPass123!',
    role: 'student',
    phone: '+263 77 123 4567',
    country: 'Zimbabwe',
    isEmailVerified: true,
    status: 'active',
    curriculumPreference: 'both',
  },
  {
    _id: 'usr-tvet-001',
    name: 'Kudzai Ndlovu',
    email: 'tvet.apprentice@eduenlighten.ac',
    password: 'TvetPass123!',
    role: 'student',
    phone: '+263 77 444 8888',
    country: 'Zimbabwe',
    isEmailVerified: true,
    status: 'active',
    curriculumPreference: 'digital_skills',
  },
  {
    _id: 'usr-private-001',
    name: 'Ruvimbo Chitepo',
    email: 'private.student@eduenlighten.ac',
    password: 'PrivatePass123!',
    role: 'student',
    phone: '+263 78 555 9999',
    country: 'Zimbabwe',
    isEmailVerified: true,
    status: 'active',
    curriculumPreference: 'cambridge',
  },
  {
    _id: 'usr-teacher-001',
    name: 'Dr. Tendai Chiware',
    email: 'dr.chiware@eduenlighten.ac',
    password: 'TeacherPass123!',
    role: 'teacher',
    phone: '+263 77 987 6543',
    country: 'Zimbabwe',
    isEmailVerified: true,
    status: 'active',
  },
  {
    _id: 'usr-teacher-002',
    name: 'Mrs. Chipo Moyo',
    email: 'mrs.moyo@eduenlighten.ac',
    password: 'TeacherPass123!',
    role: 'teacher',
    phone: '+263 77 654 3210',
    country: 'Zimbabwe',
    isEmailVerified: true,
    status: 'active',
  },
  {
    _id: 'usr-poly-001',
    name: 'Eng. Farai Mutasa',
    email: 'poly.instructor@eduenlighten.ac',
    password: 'PolyPass123!',
    role: 'teacher',
    phone: '+263 71 333 7777',
    country: 'Zimbabwe',
    isEmailVerified: true,
    status: 'active',
  },
  {
    _id: 'usr-admin-001',
    name: 'System Administrator',
    email: 'admin@eduenlighten.ac',
    password: 'AdminPass123!',
    role: 'super_admin',
    phone: '+263 77 000 0000',
    country: 'Zimbabwe',
    isEmailVerified: true,
    status: 'active',
  },
  {
    _id: 'usr-academic-001',
    name: 'Academic Dean',
    email: 'academic@eduenlighten.ac',
    password: 'AcademicPass123!',
    role: 'academic_admin',
    phone: '+263 77 111 2222',
    country: 'Zimbabwe',
    isEmailVerified: true,
    status: 'active',
  },
  {
    _id: 'usr-parent-001',
    name: 'Mr. & Mrs. Moyo',
    email: 'parent.moyo@eduenlighten.ac',
    password: 'ParentPass123!',
    role: 'parent',
    phone: '+263 77 222 3333',
    country: 'Zimbabwe',
    isEmailVerified: true,
    status: 'active',
  },
];

export class AuthService {
  static generateToken(user: any): string {
    return jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
        status: user.status,
      },
      ENV.JWT_SECRET,
      { expiresIn: ENV.JWT_EXPIRES_IN as any }
    );
  }

  static async register(data: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
    phone?: string;
    country?: string;
    curriculumPreference?: 'cambridge' | 'zimsec' | 'digital_skills' | 'both';
    currentLevel?: string;
    learningGoals?: string[];
  }) {
    const role: UserRole = data.role === 'teacher' ? 'teacher' : data.role === 'parent' ? 'parent' : 'student';

    if (mongoose.connection.readyState === 1) {
      try {
        const existing = await User.findOne({ email: data.email.toLowerCase().trim() });
        if (existing) {
          throw new AppError('An account with this email address already exists.', 409);
        }

        const user = new User({
          name: data.name.trim(),
          email: data.email.toLowerCase().trim(),
          password: data.password,
          role,
          phone: data.phone || '',
          country: data.country || 'Zimbabwe',
          isEmailVerified: true,
          status: 'active',
        });

        await user.save();

        if (role === 'student') {
          await StudentProfile.create({
            user: user._id,
            curriculum: data.curriculumPreference || 'both',
            currentLevel: data.currentLevel || 'IGCSE / O-Level',
            learningGoals: data.learningGoals || ['Complete Examinations', 'Gain Practical Skills'],
          });
        } else if (role === 'teacher') {
          await TeacherProfile.create({
            user: user._id,
            curriculaExpertise: ['Cambridge International', 'ZIMSEC Curriculum'],
            subjectsTaught: ['General Instruction'],
            qualificationSummary: 'Registered Independent Educator',
            hourlyRateUSD: 20,
            bio: 'Registered educator on EduEnlighten.',
          });
        }

        const token = this.generateToken(user);
        return { user, token };
      } catch (err: any) {
        if (err.statusCode) throw err;
        // fall through to in-memory if DB fails
      }
    }

    // In-memory registration
    const existingMem = IN_MEMORY_USERS.find(
      (u) => u.email.toLowerCase() === data.email.toLowerCase().trim()
    );
    if (existingMem) {
      throw new AppError('An account with this email address already exists.', 409);
    }

    const newUser: InMemoryUser = {
      _id: `usr-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      password: data.password,
      role,
      phone: data.phone || '',
      country: data.country || 'Zimbabwe',
      isEmailVerified: true,
      status: 'active',
      curriculumPreference: data.curriculumPreference || 'both',
    };

    IN_MEMORY_USERS.push(newUser);
    const token = this.generateToken(newUser);
    const { password: _, ...safeUser } = newUser;
    return { user: safeUser, token };
  }

  static async login(emailOrUsername: string, password: string) {
    const norm = emailOrUsername.toLowerCase().trim();

    if (mongoose.connection.readyState === 1) {
      try {
        const user = await User.findOne({
          $or: [
            { email: norm },
            { email: new RegExp(`^${norm}@`, 'i') },
            { name: new RegExp(`^${norm}$`, 'i') },
          ],
        }).select('+password');

        if (user) {
          if (user.status === 'suspended') {
            throw new AppError('Account is suspended. Please contact platform administration.', 403);
          }
          const isMatch = await user.comparePassword(password);
          if (!isMatch) {
            throw new AppError('Invalid username or password.', 401);
          }

          const token = this.generateToken(user);
          let profile = null;
          if (user.role === 'student') {
            profile = await StudentProfile.findOne({ user: user._id });
          } else if (user.role === 'teacher') {
            profile = await TeacherProfile.findOne({ user: user._id });
          }

          const safeUser = user.toObject();
          delete safeUser.password;
          return { user: safeUser, token, profile };
        }
      } catch (err: any) {
        if (err.statusCode) throw err;
        // fall through to in-memory check
      }
    }

    // In-memory check: matches full email, username prefix (before @), or full name
    const memUser = IN_MEMORY_USERS.find(
      (u) =>
        u.email.toLowerCase() === norm ||
        u.email.toLowerCase().startsWith(norm + '@') ||
        u.name.toLowerCase() === norm
    );
    if (!memUser) {
      throw new AppError('Invalid username or password.', 401);
    }

    if (memUser.status === 'suspended') {
      throw new AppError('Account is suspended. Please contact platform administration.', 403);
    }

    if (memUser.password !== password) {
      throw new AppError('Invalid email or password.', 401);
    }

    const token = this.generateToken(memUser);
    const { password: _, ...safeUser } = memUser;
    return {
      user: safeUser,
      token,
      profile: {
        currentLevel: 'IGCSE / O-Level & Practical Skills',
        curriculum: memUser.curriculumPreference || 'both',
      },
    };
  }

  static async getMe(userId: string) {
    if (mongoose.connection.readyState === 1) {
      try {
        const user = await User.findById(userId);
        if (user) {
          let profile = null;
          if (user.role === 'student') {
            profile = await StudentProfile.findOne({ user: user._id });
          } else if (user.role === 'teacher') {
            profile = await TeacherProfile.findOne({ user: user._id });
          }
          return { user, profile };
        }
      } catch {
        // fall through
      }
    }

    const memUser = IN_MEMORY_USERS.find((u) => u._id === userId);
    if (!memUser) {
      throw new AppError('User not found.', 404);
    }
    const { password: _, ...safeUser } = memUser;
    return {
      user: safeUser,
      profile: {
        currentLevel: 'IGCSE / O-Level & Practical Skills',
        curriculum: memUser.curriculumPreference || 'both',
      },
    };
  }
}
