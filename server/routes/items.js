import { Router } from 'express'
import mongoose from 'mongoose'
import Item from '../models/Item.js'
import requireAuth from '../middleware/requireAuth.js'
import validateItemInput from '../validation/item.js'

const router = Router()

function requireDatabase(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: 'The item database is not connected. Configure the server MongoDB connection first.',
    })
  }

  return next()
}

router.get('/', requireDatabase, async (req, res, next) => {
  try {
    const foundItems = await Item.find({ status: 'active' })
      .select(
        'title description category listingType sellPrice rentPrice rentUnit condition negotiable images area pincode latitude longitude status createdAt',
      )
      .sort({ createdAt: -1 })
      .lean()

    return res.status(200).json({ items: foundItems })
  } catch (error) {
    return next(error)
  }
})

router.get(
  '/:id',
  (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid item id.' })
    }

    return next()
  },
  requireDatabase,
  async (req, res, next) => {
    try {
      const item = await Item.findOne({ _id: req.params.id, status: 'active' })
        .select(
          'title description category listingType sellPrice rentPrice rentUnit condition negotiable images area pincode latitude longitude status createdAt',
        )
        .lean()

      if (!item) {
        return res.status(404).json({ message: 'Active item not found.' })
      }

      return res.status(200).json({ item })
    } catch (error) {
      return next(error)
    }
  },
)

router.post('/', requireAuth, requireDatabase, async (req, res, next) => {
  const { errors, value } = validateItemInput(req.body)

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: 'Please correct the listing details.', errors })
  }

  try {
    const item = await Item.create({ ...value, owner: req.user.id })
    return res.status(201).json({ item })
  } catch (error) {
    return next(error)
  }
})

export default router
