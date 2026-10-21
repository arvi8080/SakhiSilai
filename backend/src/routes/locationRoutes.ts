import { Router, Request, Response } from 'express';
import { postgresDb } from '../data/postgresDb';
import { requireAuth, requireRole, asyncHandler } from '../middleware/auth';

export const locationRouter = Router();

// GET /api/locations
locationRouter.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    const locations = await postgresDb.locations();

    res.json({
      success: true,
      count: locations.length,
      data: locations
    });
  })
);

// POST /api/locations/villages
locationRouter.post(
  '/villages',
  requireAuth,
  requireRole('admin'),
  asyncHandler(async (req: Request, res: Response) => {
    const { stateId, districtId, villageName } = req.body;

    if (
      typeof stateId !== 'string' ||
      stateId.length > 100 ||
      typeof districtId !== 'string' ||
      districtId.length > 100 ||
      typeof villageName !== 'string' ||
      villageName.trim().length < 2 ||
      villageName.length > 100
    ) {
      return res.status(400).json({
        success: false,
        message: 'stateId, districtId and villageName are required'
      });
    }

    const success = await postgresDb.addVillage(
      stateId,
      districtId,
      villageName.trim()
    );

    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'State or district not found'
      });
    }

    const locations = await postgresDb.locations();

    return res.status(201).json({
      success: true,
      message: `Village ${villageName.trim()} added successfully to database`,
      data: locations
    });
  })
);