import {
  itemCategories,
  itemConditions,
  listingTypes,
  rentUnits,
} from '../models/Item.js'

function readPrice(value, field, errors) {
  if (value === undefined || value === null || value === '') {
    return undefined
  }

  const amount = typeof value === 'number' ? value : Number(value)
  if (!Number.isSafeInteger(amount) || amount < 1) {
    errors[field] = 'Enter a whole-number price greater than zero in INR.'
    return undefined
  }

  return amount
}

function validateItemInput(input) {
  const errors = {}

  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { errors: { body: 'The request body must be an object.' }, value: null }
  }

  const title = typeof input.title === 'string' ? input.title.trim() : ''
  const description =
    typeof input.description === 'string' ? input.description.trim() : ''
  const area = typeof input.area === 'string' ? input.area.trim() : ''
  const pincode = typeof input.pincode === 'string' ? input.pincode.trim() : ''

  if (!title || title.length > 120) {
    errors.title = 'Title is required and must be 120 characters or fewer.'
  }

  if (!description || description.length > 3000) {
    errors.description =
      'Description is required and must be 3000 characters or fewer.'
  }

  if (!itemCategories.includes(input.category)) {
    errors.category = 'Choose a valid category.'
  }

  if (!listingTypes.includes(input.listingType)) {
    errors.listingType = 'Choose sell, rent, or both.'
  }

  if (!itemConditions.includes(input.condition)) {
    errors.condition = 'Choose a valid item condition.'
  }

  if (!area || area.length > 80) {
    errors.area = 'Enter a valid Dehradun area.'
  }

  if (!/^248\d{3}$/.test(pincode)) {
    errors.pincode = 'Enter a valid Dehradun pincode starting with 248.'
  }

  const sellPrice = readPrice(input.sellPrice, 'sellPrice', errors)
  const rentPrice = readPrice(input.rentPrice, 'rentPrice', errors)
  const needsSalePrice =
    input.listingType === 'sell' || input.listingType === 'both'
  const needsRentPrice =
    input.listingType === 'rent' || input.listingType === 'both'

  if (needsSalePrice && sellPrice === undefined && !errors.sellPrice) {
    errors.sellPrice = 'Enter the sale price in INR.'
  }

  if (needsRentPrice && rentPrice === undefined && !errors.rentPrice) {
    errors.rentPrice = 'Enter the rent price in INR.'
  }

  if (needsRentPrice && !rentUnits.includes(input.rentUnit)) {
    errors.rentUnit = 'Choose day, week, or month for the rent price.'
  }

  if (!needsSalePrice && input.sellPrice !== undefined && input.sellPrice !== '') {
    errors.sellPrice = 'Rent-only listings must not include a sale price.'
  }

  if (!needsRentPrice && rentPrice !== undefined) {
    errors.rentPrice = 'Sale-only listings must not include a rent price.'
  }

  if (!needsRentPrice && input.rentUnit !== undefined && input.rentUnit !== '') {
    errors.rentUnit = 'Sale-only listings must not include a rent unit.'
  }

  if (input.negotiable !== undefined && typeof input.negotiable !== 'boolean') {
    errors.negotiable = 'Negotiable must be true or false.'
  }

  if (input.images !== undefined && !Array.isArray(input.images)) {
    errors.images = 'Photos must be provided as a list.'
  } else if (Array.isArray(input.images) && input.images.length > 8) {
    errors.images = 'An item can have at most 8 photos.'
  } else if (
    Array.isArray(input.images) &&
    input.images.some((image) => typeof image !== 'string' || image.length > 2048)
  ) {
    errors.images = 'Each photo reference must be a short string.'
  }

  const coordinatesProvided =
    input.latitude !== undefined || input.longitude !== undefined
  let latitude
  let longitude

  if (coordinatesProvided) {
    latitude = Number(input.latitude)
    longitude = Number(input.longitude)
    if (
      input.latitude === undefined ||
      input.longitude === undefined ||
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      errors.coordinates = 'Provide valid latitude and longitude together.'
    }
  }

  const allowedKeys = new Set([
    'title',
    'description',
    'category',
    'listingType',
    'sellPrice',
    'rentPrice',
    'rentUnit',
    'condition',
    'negotiable',
    'images',
    'area',
    'pincode',
    'latitude',
    'longitude',
  ])
  const unexpectedKey = Object.keys(input).find((key) => !allowedKeys.has(key))
  if (unexpectedKey) {
    errors[unexpectedKey] = 'This field cannot be set in the item request.'
  }

  const value = Object.fromEntries(
    Object.entries({
      title,
      description,
      category: input.category,
      listingType: input.listingType,
      sellPrice,
      rentPrice,
      rentUnit: input.rentUnit,
      condition: input.condition,
      negotiable: input.negotiable ?? false,
      images: Array.isArray(input.images)
        ? input.images.filter((image) => typeof image === 'string').map((image) => image.trim())
        : [],
      area,
      pincode,
      latitude,
      longitude,
    }).filter(([, fieldValue]) => fieldValue !== undefined),
  )

  return { errors, value }
}

export default validateItemInput
