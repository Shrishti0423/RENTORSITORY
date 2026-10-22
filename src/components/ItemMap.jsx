import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'

const itemPin = L.divIcon({
  className: '',
  html: '<span style="display:block;width:18px;height:18px;border:3px solid white;border-radius:50%;background:#4f46e5;box-shadow:0 2px 8px #33415599"></span>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
})

function ItemMap({ items }) {
  const locatedItems = items.filter(
    (item) => Number.isFinite(item.latitude) && Number.isFinite(item.longitude),
  )

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <MapContainer
        center={[30.325, 78.04]}
        zoom={11}
        scrollWheelZoom={false}
        className="h-80 w-full"
        aria-label="Map of rental items in Dehradun"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locatedItems.map((item) => (
          <Marker
            key={item.id}
            position={[item.latitude, item.longitude]}
            icon={itemPin}
          >
            <Popup>
              <strong>{item.title}</strong>
              <br />
              {item.area}, Dehradun
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export default ItemMap
