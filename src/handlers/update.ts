import { Prisma, Update } from '@prisma/client';
import { RequestHandler } from 'express';
import { ParamsDictionary as PD } from 'express-serve-static-core';

import prisma from '../db.js';

export const getUpdates: RequestHandler = async (req, res) => {
  // right now it's getting ALL updates of ALL products of ONE user
  const products = await prisma.product.findMany({
    where: {
      belongsToId: req.user!.id,
    },
    select: {
      updates: true,
    },
  });

  const updates = products.map((p) => p.updates).flat();
  res.json({ data: updates });
};

export const getUpdateById: RequestHandler<Pick<Update, 'id'>> = async (
  req,
  res,
) => {
  const update = await prisma.update.findUnique({
    where: {
      id: req.params.id,
    },
    include: {
      _count: true,
    },
  });

  res.json({ data: update });
};

export const createUpdate: RequestHandler<
  PD,
  unknown,
  Prisma.UpdateUncheckedCreateInput
> = async (req, res) => {
  // make sure newUpdate belongs to a product that belongs to user
  const product = await prisma.product.findUnique({
    where: {
      id: req.body.productId,
      belongsToId: req.user!.id,
    },
  });

  if (product === null) {
    res.status(400).json({ message: `You don't have any product like this.` });
  }

  const newUpdate = await prisma.update.create({
    data: req.body,
  });

  res.json({ data: newUpdate });
};

export const updateUpdate: RequestHandler<
  Pick<Update, 'id'>,
  unknown,
  Prisma.UpdateUpdateInput
> = async (req, res) => {
  // make sure req.body has at least 1 field
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ message: 'Have to specify an update field' });
  }

  // make sure update being updated belong to user
  const products = await prisma.product.findMany({
    where: {
      belongsToId: req.user!.id,
    },
    select: { updates: true },
  });

  const updates = products.map((p) => p.updates).flat();

  if (updates === null || updates.length === 0) {
    res.status(400).json({ message: `You don't have any updates` });
  }

  if (updates.find((u) => u.id === req.params.id) === undefined) {
    res.status(400).json({ message: `You don't have any update with this id` });
  }

  const updatedUpdate = await prisma.update.update({
    where: {
      id: req.params.id,
    },
    data: req.body,
  });

  res.json({ data: updatedUpdate });
};

export const deleteUpdate: RequestHandler<Pick<Update, 'id'>> = async (
  req,
  res,
) => {
  // make sure req.body has at least 1 field
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ message: 'Have to specify an update field' });
  }

  // make sure update being updated belongs to product that belongs to user
  const products = await prisma.product.findMany({
    where: {
      belongsToId: req.user!.id,
    },
    select: { updates: true },
  });

  const updates = products.map((p) => p.updates).flat();

  if (updates === null || updates.length === 0) {
    res.status(400).json({ message: `You don't have any updates` });
  }

  if (updates.find((u) => u.id === req.params.id) === undefined) {
    res.status(400).json({ message: `You don't have any update with this id` });
  }

  const deletedUpdate = await prisma.update.delete({
    where: {
      id: req.params.id,
    },
  });

  res.json({ data: deletedUpdate });
};

export const getEverythingFromUser: RequestHandler = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user!.id,
    },
    include: {
      products: {
        include: {
          updates: true,
        },
      },
    },
  });

  res.json({ data: user });
};
