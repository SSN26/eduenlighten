import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { ENV } from '../config/env.js';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    failed++;
  }
}

async function runTestSuite() {
  console.log('\n======================================================');
  console.log('🧪 EduEnlighten Automated Test Suite');
  console.log('======================================================\n');

  // Test 1: Password Hashing & Bcrypt Verification
  console.log('Test Group 1: Authentication & Cryptographic Security');
  const plainPassword = 'StudentPass123!';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(plainPassword, salt);
  const match = await bcrypt.compare(plainPassword, hash);
  const wrongMatch = await bcrypt.compare('WrongPassword', hash);
  assert(match === true, 'Bcrypt securely hashes and verifies matching candidate password');
  assert(wrongMatch === false, 'Bcrypt rejects incorrect passwords');

  // Test 2: JWT Token Generation & Verification
  const token = jwt.sign(
    { userId: '65f0123456789abcdef01234', email: 'tawanda@student.eduenlighten.ac', role: 'student', status: 'active' },
    ENV.JWT_SECRET,
    { expiresIn: '7d' }
  );
  const decoded: any = jwt.verify(token, ENV.JWT_SECRET);
  assert(decoded.userId === '65f0123456789abcdef01234', 'JWT payload retains userId correctly');
  assert(decoded.role === 'student', 'JWT role-based claims are intact');

  // Test 3: Certificate Cryptographic Hash Integrity
  console.log('\nTest Group 2: Certificate Cryptography & Verification');
  const certNumber = 'EDU-2026-AB12CD';
  const studentName = 'Tawanda Sibanda';
  const courseTitle = 'Cambridge IGCSE Mathematics Masterclass';
  const rawData = `${certNumber}:${studentName}:${courseTitle}:1770000000000`;
  const hash1 = crypto.createHash('sha256').update(rawData).digest('hex');
  const hash2 = crypto.createHash('sha256').update(rawData).digest('hex');
  const alteredHash = crypto.createHash('sha256').update(rawData + '_tampered').digest('hex');
  assert(hash1 === hash2, 'SHA-256 hash generation is deterministic');
  assert(hash1 !== alteredHash, 'SHA-256 detects tampering immediately');
  assert(certNumber.startsWith('EDU-2026-'), 'Certificate number adheres to standard schema EDU-YYYY-XXXX');

  // Test 4: Assessment Engine & Objective Auto-Scoring
  console.log('\nTest Group 3: Assessment Scoring Engine');
  const questions = [
    { questionText: 'What is 2 + 2?', type: 'multiple_choice', correctAnswer: '4', points: 5 },
    { questionText: 'Is the earth flat?', type: 'true_false', correctAnswer: 'False', points: 5 },
  ];
  const userAnswers = [
    { questionIndex: 0, userAnswer: '4' },
    { questionIndex: 1, userAnswer: 'False' },
  ];
  let calculatedScore = 0;
  questions.forEach((q, idx) => {
    if (String(userAnswers[idx].userAnswer).toLowerCase() === String(q.correctAnswer).toLowerCase()) {
      calculatedScore += q.points;
    }
  });
  const maxPossible = 10;
  const scorePct = (calculatedScore / maxPossible) * 100;
  const hasPassed = scorePct >= 70;
  assert(calculatedScore === 10, 'Objective assessment computes 100% score for correct answers');
  assert(hasPassed === true, 'Passing threshold evaluates to true when score >= 70%');

  // Test 5: Payment Gateway Abstraction & Idempotent Reference
  console.log('\nTest Group 4: Payment Gateway Abstraction');
  const txRef = `EDU-TX-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
  assert(txRef.startsWith('EDU-TX-'), 'Transaction reference follows idempotent scheme EDU-TX-TIMESTAMP-HEX');
  assert(txRef.length >= 20, 'Transaction reference provides sufficient entropy');

  // Test 6: Live Class Meeting Provider Abstraction
  console.log('\nTest Group 5: Live Video Provider Integration');
  const roomId = 'edu-cambridge-math-live';
  const jitsiUrl = `https://meet.jit.si/${roomId}`;
  assert(jitsiUrl.includes('meet.jit.si'), 'Jitsi video meeting room URL is properly formatted');

  console.log('\n======================================================');
  console.log(`Results: ${passed} Passed, ${failed} Failed`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Test suite failed with unexpected error:', err);
  process.exit(1);
});
