import mongoose from 'mongoose'

export const itemCategories = [
  'Books',
  'Study Material',
  'Furniture',
  'Electronics',
  'Cycles and Bikes',
  'Clothing',
  'Home and Kitchen',
  'Sports and Trekking',
  'Other',
]

export const itemConditions = ['new', 'like new', 'good', 'fair']
export const listingTypes = ['sell', 'rent', 'both']
export const rentUnits = ['day', 'week', 'month']
export const itemStatuses = ['active', 'sold', 'rented', 'paused']

const itemSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },
    category: {
      type: String,
      required: true,
      enum: itemCategories,
      index: true,
    },
    listingType: {
      type: String,
      required: true,
      enum: listingTypes,
      index: true,
    },
    sellPrice: {
      type: Number,
      min: 1,
      required() {
        return this.listingType === 'sell' || this.listingType === 'both'
      },
    },
    rentPrice: {
      type: Number,
      min: 1,
      required() {
        return this.listingType === 'rent' || this.listingType === 'both'
      },
    },
    rentUnit: {
      type: String,
      enum: rentUnits,
      required() {
        return this.listingType === 'rent' || this.listingType === 'both'
      },
    },
    condition: {
      type: String,
      required: true,
      enum: itemConditions,
    },
    negotiable: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: itemStatuses,
      default: 'active',
      index: true,
    },
    images: {
      type: [{ type: String, trim: true, maxlength: 2048 }],
      default: [],
      validate: {
        validator(images) {
          return images.length <= 8
        },
        message: 'An item can have at most 8 photos.',
      },
    },
    area: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
      index: true,
    },
    pincode: {
      type: String,
      required: true,
      match: /^248\d{3}$/,
    },
    latitude: {
      type: Number,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      min: -180,
      max: 180,
    },
  },
  { timestamps: true, versionKey: false },
)

itemSchema.pre('validate', function validateListingPrices() {
  const hasSellPrice = this.sellPrice !== undefined && this.sellPrice !== null
  const hasRentPrice = this.rentPrice !== undefined && this.rentPrice !== null
  const hasRentUnit = Boolean(this.rentUnit)
  const hasLatitude = this.latitude !== undefined && this.latitude !== null
  const hasLongitude = this.longitude !== undefined && this.longitude !== null

  if (this.listingType === 'sell' && (hasRentPrice || hasRentUnit)) {
    this.invalidate('rentPrice', 'Sale-only listings must not include rental prices.')
  }

  if (this.listingType === 'rent' && hasSellPrice) {
    this.invalidate('sellPrice', 'Rent-only listings must not include a sale price.')
  }

  if (hasLatitude !== hasLongitude) {
    this.invalidate('latitude', 'Latitude and longitude must be provided together.')
  }
})

const Item = mongoose.model('Item', itemSchema)

export default Item
