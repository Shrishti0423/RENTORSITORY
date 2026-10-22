import { useEffect, useState } from 'react'
import { ArrowLeft, MapPin, ShieldAlert } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { getItem } from '../api/items.js'
import formatMoney from '../utils/money.js'

function ItemDetails() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadItem() {
      setLoading(true)
      setError('')
      try {
        const result = await getItem(id)
        if (active) setItem(result.item)
      } catch (requestError) {
        if (active) setError(requestError.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadItem()
    return () => {
      active = false
    }
  }, [id])

  if (loading) {
    return (
      <main className="mx-auto min-h-[70vh] max-w-5xl px-4 py-12 sm:px-6">
        <div className="h-8 w-40 animate-pulse rounded bg-slate-200" />
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <div className="aspect-[4/3] animate-pulse rounded-3xl bg-slate-200" />
          <div className="space-y-4">
            <div className="h-8 animate-pulse rounded bg-slate-200" />
            <div className="h-20 animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      </main>
    )
  }

  if (error || !item) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-start justify-center px-4 py-12 sm:px-6">
        <p role="alert" className="font-semibold text-slate-900">
          {error || 'This listing could not be found.'}
        </p>
        <Link to="/" className="mt-4 inline-flex items-center gap-2 font-semibold text-indigo-700 hover:text-indigo-500">
          <ArrowLeft size={18} aria-hidden="true" />
          Back to listings
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-indigo-700">
        <ArrowLeft size={17} aria-hidden="true" />
        Back to listings
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <section aria-label="Item photos" className="grid content-start grid-cols-2 gap-3">
          {item.images?.length ? item.images.map((image, index) => (
            <img
              key={image}
              src={image}
              alt={`${item.title}, photo ${index + 1}`}
              className={`aspect-[4/3] w-full rounded-2xl bg-slate-100 object-cover ${index === 0 ? 'col-span-2' : ''}`}
            />
          )) : (
            <div className="col-span-2 flex aspect-[4/3] items-center justify-center rounded-3xl bg-slate-100 text-slate-500">
              No photos have been added yet
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-wrap gap-2">
            {(item.listingType === 'sell' || item.listingType === 'both') && (
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">For Sale</span>
            )}
            {(item.listingType === 'rent' || item.listingType === 'both') && (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">For Rent</span>
            )}
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">{item.condition}</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">{item.title}</h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
            <MapPin size={16} aria-hidden="true" />
            {item.area}, Dehradun
          </p>

          <div className="mt-6 space-y-2 border-y border-slate-100 py-5">
            {(item.listingType === 'sell' || item.listingType === 'both') && (
              <p className="text-xl font-bold text-slate-950">
                {formatMoney(item.sellPrice)} <span className="text-sm font-medium text-slate-500">sale price</span>
              </p>
            )}
            {(item.listingType === 'rent' || item.listingType === 'both') && (
              <p className="text-xl font-bold text-slate-950">
                {formatMoney(item.rentPrice)} <span className="text-sm font-medium text-slate-500">/ {item.rentUnit}</span>
              </p>
            )}
            {item.negotiable && <p className="text-sm font-medium text-amber-700">Price is negotiable</p>}
          </div>

          <h2 className="mt-6 font-semibold text-slate-900">About this item</h2>
          <p className="mt-2 whitespace-pre-wrap leading-7 text-slate-600">{item.description}</p>

          <Link
            to="/login"
            className="mt-7 block rounded-xl bg-indigo-600 px-5 py-3.5 text-center font-semibold text-white transition hover:bg-indigo-500"
          >
            Log in to contact the owner
          </Link>

          <div className="mt-5 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
            <ShieldAlert size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
            <p>Meet in a public place. Never pay in advance to a stranger.</p>
          </div>
        </section>
      </div>
    </main>
  )
}

export default ItemDetails
