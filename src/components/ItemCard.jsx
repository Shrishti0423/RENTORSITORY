import { ArrowUpRight, MapPin } from 'lucide-react'
import { Link } from 'react-router'
import formatMoney from '../utils/money.js'

function ItemCard({ item }) {
  const itemId = item._id || item.id

  return (
    <article className="surface-card group overflow-hidden rounded-2xl bg-white">
      <Link
        to={`/items/${itemId}`}
        className="block focus-visible:outline-offset-[-3px]"
        aria-label={`View ${item.title}`}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          {item.images?.[0] ? (
            <img
              src={item.images[0]}
              alt={item.title}
              loading="lazy"
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-sm text-slate-400">
              No photo yet
            </div>
          )}
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {(item.listingType === 'sell' || item.listingType === 'both') && (
              <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm backdrop-blur">
                For Sale
              </span>
            )}
            {(item.listingType === 'rent' || item.listingType === 'both') && (
              <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm backdrop-blur">
                For Rent
              </span>
            )}
          </div>
        </div>

        <div className="p-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              {item.category}
            </span>
            <ArrowUpRight
              size={17}
              className="shrink-0 text-slate-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-indigo-600"
              aria-hidden="true"
            />
          </div>
          <h3 className="truncate text-base font-semibold text-slate-900">{item.title}</h3>
          <p className="mt-1.5 flex items-center gap-1 text-sm text-slate-500">
            <MapPin size={14} aria-hidden="true" />
            {item.area}, Dehradun
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-slate-500">
            <span className="rounded-full bg-slate-100 px-2.5 py-1 capitalize">{item.condition}</span>
            {item.negotiable && <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-800">Negotiable</span>}
          </div>
          <div className="mt-4 space-y-1 border-t border-slate-100 pt-3">
            {(item.listingType === 'sell' || item.listingType === 'both') && (
              <p className="text-sm font-bold text-slate-900">
                {formatMoney(item.sellPrice)} <span className="font-normal text-slate-500">sale price</span>
              </p>
            )}
            {(item.listingType === 'rent' || item.listingType === 'both') && (
              <p className="text-sm font-bold text-slate-900">
                {formatMoney(item.rentPrice)} <span className="font-normal text-slate-500">/ {item.rentUnit}</span>
              </p>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}

export default ItemCard
