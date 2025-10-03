import { Router } from 'express';
import { ethers } from 'ethers';
import { z } from 'zod';

import prisma from '../prismaClient.js';

const router = Router();

const profileSchema = z.object({
  walletAddress: z
    .string({ required_error: 'walletAddress is required' })
    .transform(value => ethers.getAddress(value)),
  displayName: z.string().trim().min(1).max(100).optional(),
  email: z.string().email().optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
  extraFields: z
    .array(
      z.object({
        field: z.string().min(1),
        value: z.string().min(1)
      })
    )
    .optional()
});

router.get('/:walletAddress', async (req, res, next) => {
  try {
    const walletAddress = ethers.getAddress(req.params.walletAddress);
    const user = await prisma.user.findUnique({
      where: { walletAddress },
      include: { profiles: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({
      id: user.id,
      walletAddress: user.walletAddress,
      displayName: user.displayName,
      email: user.email,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      extraFields: user.profiles.map(profile => ({
        field: profile.field,
        value: profile.value
      }))
    });
  } catch (error) {
    next(error);
  }
});

router.put('/', async (req, res, next) => {
  try {
    const { walletAddress, displayName, email, bio, avatarUrl, extraFields } =
      profileSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { walletAddress } });

    if (!user) {
      return res.status(404).json({ error: 'User must authenticate before updating profile' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        displayName,
        email,
        bio,
        avatarUrl,
        profiles: {
          upsert: (extraFields || []).map(field => ({
            where: {
              userId_field: {
                userId: user.id,
                field: field.field
              }
            },
            create: {
              field: field.field,
              value: field.value
            },
            update: {
              value: field.value
            }
          })),
          deleteMany: extraFields
            ? {
                userId: user.id,
                field: {
                  notIn: extraFields.map(field => field.field)
                }
              }
            : undefined
        }
      },
      include: { profiles: true }
    });

    res.json({
      id: updatedUser.id,
      walletAddress: updatedUser.walletAddress,
      displayName: updatedUser.displayName,
      email: updatedUser.email,
      bio: updatedUser.bio,
      avatarUrl: updatedUser.avatarUrl,
      extraFields: updatedUser.profiles.map(profile => ({
        field: profile.field,
        value: profile.value
      }))
    });
  } catch (error) {
    next(error);
  }
});

export default router;
