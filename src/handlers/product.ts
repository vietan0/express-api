import { Prisma, Product } from '@prisma/client';
import { RequestHandler } from 'express';
import { ParamsDictionary as PD } from 'express-serve-static-core';

import prisma from '../db.js';

export const getProducts: RequestHandler = async (req, res) => {
  const products = await prisma.user.findUnique({
    where: {
      id: req.user!.id,
    },
    select: {
      products: true,
    },
  });

  res.json({ data: products });
};

export const getProductById: RequestHandler<Pick<Product, 'id'>> = async (
  req,
  res,
) => {
  const product = await prisma.product.findUnique({
    where: {
      id: req.params.id,
      belongsToId: req.user!.id,
    },
  });

  console.log(req.body);
  res.json({ data: product });
};

export const createProduct: RequestHandler<
  PD,
  unknown,
  Prisma.ProductCreateInput
> = async (req, res, next) => {
  try {
    const newProduct = await prisma.product.create({
      data: {
        name: req.body.name,
        belongsTo: {
          connect: {
            id: req.user!.id,
          },
        },
      },
    });

    res.json({ data: newProduct });
  } catch (error) {
    next(error);
  }
};

export const updateProduct: RequestHandler<
  Pick<Product, 'id'>,
  unknown,
  Prisma.ProductUpdateInput
> = async (req, res) => {
  const updated = await prisma.product.update({
    where: {
      id: req.params.id,
      belongsToId: req.user!.id,
    },
    data: req.body,
  });

  res.json({ data: updated });
};

export const deleteProduct: RequestHandler<Pick<Product, 'id'>> = async (
  req,
  res,
) => {
  const deleted = await prisma.product.delete({
    where: {
      id: req.params.id,
      belongsToId: req.user!.id,
    },
  });

  res.json({ data: deleted });
};
