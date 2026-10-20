import { Router, Request, Response, NextFunction } from 'express';
import { CertificateService } from './certificates.service.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();

// Public: Verify a certificate by identifier
router.get('/verify/:certNumber', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const certNumber = Array.isArray(req.params.certNumber) ? req.params.certNumber[0] : req.params.certNumber;
    const result = await CertificateService.verifyCertificate(certNumber);
    if (!result.isValid) {
      res.status(404).json({ success: false, ...result });
      return;
    }
    res.status(200).json({ success: true, certificate: result });
  } catch (err) {
    next(err);
  }
});

// Student: Get my certificates
router.get('/my', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const certificates = await CertificateService.getStudentCertificates(req.user!.userId);
    res.status(200).json({ success: true, certificates });
  } catch (err) {
    next(err);
  }
});

export default router;
