import { useState } from 'react'
import { AlertCircle, CheckCircle2, ImagePlus, Info } from 'lucide-react'
import { useNavigate } from 'react-router'
import { createItem } from '../api/items.js'
import areas from '../data/areas.js'

const categories = [
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

const conditions = [
  ['new', 'New'],
  ['like new', 'Like new'],
  ['good', 'Good'],
  ['fair', 'Fair'],
]

const initialForm = {
  title: '',
  description: '',
  category: '',
  listingType: 'sell',
  sellPrice: '',
  rentPrice: '',
  rentUnit: 'day',
  condition: 'good',
  negotiable: false,
  area: '',
  pincode: '',
}

function ListItem() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [success, setSuccess] = useState('')
  const [saving, setSaving] = useState(false)

  function updateField(event) {
    const { name, value, checked, type } = event.target
    setForm((current) => {
      const next = {
        ...current,
        [name]: type === 'checkbox' ? checked : value,
      }

      if (name === 'area') {
        next.pincode = areas.find((area) => area.name === value)?.pincode || ''
      }

      if (name === 'listingType') {
        if (value === 'sell') {
          next.rentPrice = ''
        } else if (value === 'rent') {
          next.sellPrice = ''
        }
      }

      return next
    })
    setFieldErrors((current) => ({ ...current, [name]: undefined }))
    setError('')
    setSuccess('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setFieldErrors({})
    setSuccess('')

    const payload = {
      ...form,
      sellPrice: form.sellPrice === '' ? undefined : Number(form.sellPrice),
      rentPrice: form.rentPrice === '' ? undefined : Number(form.rentPrice),
    }

    setSaving(true)
    try {
      const result = await createItem(payload)
      setSuccess('Your listing has been created.')
      if (result.item?._id) {
        navigate(`/items/${result.item._id}`)
      }
    } catch (requestError) {
      setError(requestError.message)
      setFieldErrors(requestError.fields || {})
    } finally {
      setSaving(false)
    }
  }

  const showSellPrice = form.listingType === 'sell' || form.listingType === 'both'
  const showRentPrice = form.listingType === 'rent' || form.listingType === 'both'

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <div className="mb-7">
          <p className="text-sm font-semibold text-indigo-600">Dehradun classifieds</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Create a listing
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Sell, rent, or offer your item both ways. Buyers and owners arrange
            the deal directly; there are no online payments.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          {error && (
            <div role="alert" className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <AlertCircle size={19} className="mt-0.5 shrink-0" aria-hidden="true" />
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div role="status" className="flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
              <CheckCircle2 size={19} aria-hidden="true" />
              <p>{success}</p>
            </div>
          )}

          <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-sm leading-6 text-indigo-900">
            <p className="flex items-start gap-2">
              <Info size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
              <span>
                Listings are saved only after login is connected. For now, you
                can fill and validate this form; the API will safely ask you to
                log in rather than accept an anonymous listing.
              </span>
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-semibold text-slate-800 sm:col-span-2">
              Item title
              <input
                name="title"
                value={form.title}
                onChange={updateField}
                required
                maxLength={120}
                placeholder="e.g. Trekking backpack"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-3 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
              {fieldErrors.title && <span className="mt-1 block text-xs text-red-700">{fieldErrors.title}</span>}
            </label>

            <label className="text-sm font-semibold text-slate-800 sm:col-span-2">
              Description
              <textarea
                name="description"
                value={form.description}
                onChange={updateField}
                required
                maxLength={3000}
                rows={4}
                placeholder="Describe the item, what is included, and how you prefer to arrange the deal."
                className="mt-1.5 w-full resize-y rounded-xl border border-slate-300 px-3.5 py-3 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
              {fieldErrors.description && <span className="mt-1 block text-xs text-red-700">{fieldErrors.description}</span>}
            </label>

            <label className="text-sm font-semibold text-slate-800">
              Category
              <select
                name="category"
                value={form.category}
                onChange={updateField}
                required
                className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="" disabled>Select a category</option>
                {categories.map((category) => <option key={category}>{category}</option>)}
              </select>
              {fieldErrors.category && <span className="mt-1 block text-xs text-red-700">{fieldErrors.category}</span>}
            </label>

            <label className="text-sm font-semibold text-slate-800">
              Condition
              <select
                name="condition"
                value={form.condition}
                onChange={updateField}
                required
                className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 font-normal capitalize outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                {conditions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
          </div>

          <fieldset>
            <legend className="text-sm font-semibold text-slate-800">What are you offering?</legend>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {[
                ['sell', 'For sale'],
                ['rent', 'For rent'],
                ['both', 'Both'],
              ].map(([value, label]) => (
                <label
                  key={value}
                  className={`cursor-pointer rounded-xl border px-3 py-3 text-center text-sm font-semibold transition ${
                    form.listingType === value
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 text-slate-600 hover:border-indigo-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="listingType"
                    value={value}
                    checked={form.listingType === value}
                    onChange={updateField}
                    className="sr-only"
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-5 sm:grid-cols-2">
            {showSellPrice && (
              <label className="text-sm font-semibold text-slate-800">
                Sale price (₹)
                <input
                  name="sellPrice"
                  type="number"
                  min="1"
                  step="1"
                  value={form.sellPrice}
                  onChange={updateField}
                  required
                  placeholder="e.g. 2500"
                  className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-3 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
                {fieldErrors.sellPrice && <span className="mt-1 block text-xs text-red-700">{fieldErrors.sellPrice}</span>}
              </label>
            )}

            {showRentPrice && (
              <div className="grid grid-cols-[1fr_8rem] gap-3">
                <label className="text-sm font-semibold text-slate-800">
                  Rent price (₹)
                  <input
                    name="rentPrice"
                    type="number"
                    min="1"
                    step="1"
                    value={form.rentPrice}
                    onChange={updateField}
                    required
                    placeholder="e.g. 300"
                    className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-3 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                  {fieldErrors.rentPrice && <span className="mt-1 block text-xs text-red-700">{fieldErrors.rentPrice}</span>}
                </label>
                <label className="text-sm font-semibold text-slate-800">
                  Per
                  <select
                    name="rentUnit"
                    value={form.rentUnit}
                    onChange={updateField}
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="day">Day</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                  </select>
                </label>
              </div>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              name="negotiable"
              checked={form.negotiable}
              onChange={updateField}
              className="size-4 accent-indigo-600"
            />
            Price is negotiable
          </label>

          <fieldset>
            <legend className="text-sm font-semibold text-slate-800">Dehradun area</legend>
            <div className="mt-2 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">
                Area
                <select
                  name="area"
                  value={form.area}
                  onChange={updateField}
                  required
                  className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="" disabled>Select an area</option>
                  {areas.map((area) => <option key={area.name} value={area.name}>{area.name}</option>)}
                </select>
              </label>
              <label className="text-sm font-medium text-slate-700">
                Pincode
                <input
                  name="pincode"
                  value={form.pincode}
                  readOnly
                  required
                  placeholder="Selected from area"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-slate-600"
                />
              </label>
            </div>
            {fieldErrors.area && <span className="mt-1 block text-xs text-red-700">{fieldErrors.area}</span>}
            {fieldErrors.pincode && <span className="mt-1 block text-xs text-red-700">{fieldErrors.pincode}</span>}
          </fieldset>

          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
            <p className="flex items-center gap-2 font-semibold text-slate-800">
              <ImagePlus size={18} aria-hidden="true" />
              Photos are coming in a later step
            </p>
            <p className="mt-1">You will be able to add up to 8 item photos after local upload is connected.</p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-indigo-600 px-5 py-3.5 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-wait disabled:opacity-60"
          >
            {saving ? 'Checking listing…' : 'Continue to create listing'}
          </button>
        </form>
      </div>
    </main>
  )
}

export default ListItem
