import { Router } from 'express';
import { ethers } from 'ethers';
import { z } from 'zod';

import prisma from '../prismaClient.js';
import { buildAuthMessage, generateNonce } from '../utils/auth.js';

const router = Router();

const walletSchema = z.object({
  walletAddress: z
    .string({ required_error: 'walletAddress is required' })
    .transform(value => ethers.getAddress(value))
});

const verifySchema = z
  .object({
    walletAddress: z.string(),
    signature: z.string({ required_error: 'signature is required' })
  })
  .superRefine((data, ctx) => {
    try {
      ethers.getAddress(data.walletAddress);
    } catch (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['walletAddress'],
        message: 'Invalid wallet address'
      });
    }
  });

router.post('/challenge', async (req, res, next) => {
  try {
    const { walletAddress } = walletSchema.parse(req.body);
    const nonce = generateNonce();
    const user = await prisma.user.upsert({
      where: { walletAddress },
      create: {
        walletAddress,
        nonce
      },
      update: { nonce }
    });

    res.json({
      message: buildAuthMessage(user.nonce),
      nonce: user.nonce,
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        displayName: user.displayName,
        email: user.email,
        bio: user.bio,
        avatarUrl: user.avatarUrl
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/verify', async (req, res, next) => {
  try {
    const { walletAddress, signature } = verifySchema.parse(req.body);
    const normalizedWallet = ethers.getAddress(walletAddress);

    const user = await prisma.user.findUnique({
      where: { walletAddress: normalizedWallet }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found for wallet address' });
    }

    const message = buildAuthMessage(user.nonce);
    let recovered;
    try {
      recovered = ethers.verifyMessage(message, signature);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    if (ethers.getAddress(recovered) !== normalizedWallet) {
      return res.status(401).json({ error: 'Signature verification failed' });
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { nonce: generateNonce() }
    });

    res.json({
      user: {
        id: updated.id,
        walletAddress: updated.walletAddress,
        displayName: updated.displayName,
        email: updated.email,
        bio: updated.bio,
        avatarUrl: updated.avatarUrl
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
