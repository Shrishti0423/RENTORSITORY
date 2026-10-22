import { useEffect, useMemo, useState } from 'react'
import { ArrowDown, Search, Sparkles } from 'lucide-react'
import { useOutletContext } from 'react-router'
import { getItems } from '../api/items.js'
import CategorySection from '../components/CategorySection.jsx'
import ItemMap from '../components/ItemMap.jsx'
import ItemCard from '../components/ItemCard.jsx'
import areas from '../data/areas.js'

function Home() {
  const { searchValue, setSearchValue } = useOutletContext()
  const [selectedCategory, setSelectedCategory] = useState('All items')
  const [selectedArea, setSelectedArea] = useState('All areas')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let active = true

    async function loadItems() {
      setLoading(true)
      setLoadError('')
      try {
        const result = await getItems()
        if (active) setItems(result.items)
      } catch (error) {
        if (active) setLoadError(error.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadItems()
    return () => {
      active = false
    }
  }, [])

  const filteredItems = useMemo(() => {
    const query = searchValue.trim().toLowerCase()

    return items.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All items' || item.category === selectedCategory
      const matchesArea = selectedArea === 'All areas' || item.area === selectedArea
      const searchableText =
        `${item.title} ${item.category} ${item.area} ${item.pincode} ${item.location} ${item.description}`.toLowerCase()

      return matchesCategory && matchesArea && (!query || searchableText.includes(query))
    })
  }, [items, searchValue, selectedArea, selectedCategory])

  function handleSearch(event) {
    event.preventDefault()
    document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative isolate overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_78%_22%,_rgb(99_102_241/35%),_transparent_40%),radial-gradient(ellipse_at_12%_100%,_rgb(13_148_136/22%),_transparent_38%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-8 lg:py-24">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-sm font-medium text-indigo-200">
              <Sparkles size={15} aria-hidden="true" />
              Dehradun classifieds, shared locally
            </p>
            <h1 className="max-w-2xl text-4xl font-bold leading-[1.08] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
              Buy, sell or rent in Dehradun.
              <span className="mt-2 block bg-gradient-to-r from-indigo-300 to-teal-200 bg-clip-text text-transparent">
                Find it from your community.
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              Discover useful pre-loved items and rentals listed by people
              across Dehradun, Uttarakhand. Connect directly and arrange your deal offline.
            </p>

            <form
              role="search"
              onSubmit={handleSearch}
              className="mt-8 flex max-w-xl items-center gap-3 rounded-2xl bg-white p-2 pl-4 shadow-xl shadow-black/20"
            >
              <Search size={20} className="shrink-0 text-slate-400" aria-hidden="true" />
              <input
                type="search"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Try “books”, “cycle” or “Rajpur Road”"
                aria-label="Search listings"
                className="min-w-0 flex-1 bg-transparent py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 sm:text-base"
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 focus-visible:outline-white"
              >
                Search
              </button>
            </form>
            <a
              href="#listings"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-white"
            >
              Explore available items
              <ArrowDown size={16} aria-hidden="true" />
            </a>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-indigo-500/20 to-teal-400/10 blur-2xl" />
            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1100&q=85"
              alt="A pre-loved item ready to find a new owner in Dehradun"
              className="relative h-[390px] w-full rounded-[2rem] object-cover shadow-2xl shadow-black/30"
            />
            <div className="absolute -bottom-5 -left-5 rounded-2xl border border-white/60 bg-white p-4 text-slate-900 shadow-xl">
              <p className="text-xs font-medium text-slate-500">A smarter way to get more</p>
              <p className="mt-1 text-lg font-bold">Use it. Share it. Repeat.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-12 sm:px-6 lg:space-y-14 lg:px-8 lg:py-16">
        <CategorySection
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <section aria-labelledby="area-filter-title" className="rounded-2xl border border-slate-200 bg-white p-4 sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div>
            <h2 id="area-filter-title" className="font-semibold text-slate-900">
              Find listings by area
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Choose a Dehradun neighborhood to filter listings and map pins.
            </p>
          </div>
          <label className="mt-3 block text-sm font-medium text-slate-700 sm:mt-0 sm:min-w-64">
            Area
            <select
              value={selectedArea}
              onChange={(event) => setSelectedArea(event.target.value)}
              className="mt-1.5 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="All areas">All areas</option>
              {areas.map((area) => (
                <option key={area.name} value={area.name}>{area.name}</option>
              ))}
            </select>
          </label>
        </section>

        <section id="listings" aria-labelledby="listings-title" className="scroll-mt-24">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-indigo-600">Shared by the Dehradun community</p>
              <h2 id="listings-title" className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                {selectedCategory === 'All items' ? 'Popular in Dehradun' : selectedCategory}
              </h2>
            </div>
            <p className="text-sm text-slate-500" aria-live="polite">
              {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          {loading ? (
            <div className="mb-6 h-80 animate-pulse rounded-2xl bg-slate-200" aria-label="Loading item map" />
          ) : !loadError && filteredItems.length > 0 ? (
            <div className="mb-6">
              <ItemMap items={filteredItems} />
            </div>
          ) : null}

          {loadError ? (
            <div role="alert" className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950">
              {loadError}
            </div>
          ) : loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-label="Loading listings">
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="h-80 animate-pulse rounded-2xl bg-slate-200" />
              ))}
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Search size={22} aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">No items found</h3>
              <p className="mt-2 text-sm text-slate-500">
                Try another search or browse all available items.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchValue('')
                  setSelectedCategory('All items')
                  setSelectedArea('All areas')
                }}
                className="mt-5 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>
      </div>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p className="font-semibold text-slate-700">rentable</p>
          <p>Buy, sell, and rent locally in Dehradun, Uttarakhand.</p>
        </div>
      </footer>
    </main>
  )
}

export default Home
