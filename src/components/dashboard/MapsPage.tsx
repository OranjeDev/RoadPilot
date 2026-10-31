import { useState } from "react";
import { MapPin, Navigation, Route, Truck } from "lucide-react";
import type { CurrentJob, RouteProgress } from "../../types/dashboard";
import "./MapsPage.css";

interface MapsPageProps {
  job: CurrentJob;
  route: RouteProgress;
}

export function MapsPage({ job, route }: MapsPageProps) {
  const [zoom, setZoom] = useState(1);
  const progress = Math.round((route.drivenKm / route.totalKm) * 100);

  return (
    <section className="maps-page" aria-labelledby="maps-title">
      <header className="maps-page__heading">
        <div>
          <h1 id="maps-title">Maps</h1>
          <p>Simulated ETS2 route · Demo mode</p>
        </div>
        <span className="maps-page__badge">SAMPLE MAP</span>
      </header>

      <div className="maps-view">
        <svg
          className="maps-view__map"
          viewBox="0 0 1200 680"
          role="img"
          aria-label={`Schematic demo route from ${job.origin.city} to ${job.destination.city}`}
          preserveAspectRatio="xMidYMid slice"
          style={{ transform: `scale(${zoom})` }}
        >
          <defs>
            <pattern id="map-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M48 0H0V48" fill="none" stroke="#d8cdbb" strokeWidth="1" opacity=".36" />
            </pattern>
          </defs>
          <rect width="1200" height="680" fill="#f1eadb" />
          <rect width="1200" height="680" fill="url(#map-grid)" />

          <path
            d="M625 0c-25 118 33 147 7 250s-95 103-48 187 8 155-30 243"
            fill="none"
            stroke="#d3e1d9"
            strokeWidth="80"
            opacity=".7"
          />
          <path
            d="M625 0c-25 118 33 147 7 250s-95 103-48 187 8 155-30 243"
            fill="none"
            stroke="#b8d2cb"
            strokeWidth="3"
            opacity=".8"
          />
          <path
            d="M810 0c-36 114 37 163 3 270s-88 140-35 244 18 134-12 166"
            fill="none"
            stroke="#d3e1d9"
            strokeWidth="46"
            opacity=".48"
          />

          <path
            d="M-30 138C180 88 252 183 433 143s276-50 396 7 197 78 408 25"
            fill="none"
            stroke="#d8cfbe"
            strokeWidth="13"
          />
          <path
            d="M-30 138C180 88 252 183 433 143s276-50 396 7 197 78 408 25"
            fill="none"
            stroke="#fffaf1"
            strokeWidth="7"
          />
          <path
            d="M60 642c147-111 177-211 292-247s155 2 260-62 175-155 315-139 187 59 296-47"
            fill="none"
            stroke="#d8cfbe"
            strokeWidth="13"
          />
          <path
            d="M60 642c147-111 177-211 292-247s155 2 260-62 175-155 315-139 187 59 296-47"
            fill="none"
            stroke="#fffaf1"
            strokeWidth="7"
          />
          <path
            d="M-50 360c164-41 219 75 351 73s216-98 326-35 171 149 283 107 188-127 342-122"
            fill="none"
            stroke="#d8cfbe"
            strokeWidth="10"
          />
          <path
            d="M-50 360c164-41 219 75 351 73s216-98 326-35 171 149 283 107 188-127 342-122"
            fill="none"
            stroke="#fffaf1"
            strokeWidth="5"
          />
          <path
            d="M151 0c11 134 80 193 65 317s-33 196 46 363M410-20c27 137 3 218 81 322s122 178 89 398M1017-15c-79 122-51 209-6 297s17 207 101 420"
            fill="none"
            stroke="#ddd3c2"
            strokeWidth="5"
          />
          <path
            d="M151 0c11 134 80 193 65 317s-33 196 46 363M410-20c27 137 3 218 81 322s122 178 89 398M1017-15c-79 122-51 209-6 297s17 207 101 420"
            fill="none"
            stroke="#fffaf1"
            strokeWidth="2"
          />

          <path
            d="M100 525c147-91 211-151 309-151 105 0 151-91 251-104 98-13 165 39 256-47 53-50 95-99 173-129"
            fill="none"
            stroke="#fffaf1"
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M100 525c147-91 211-151 309-151 105 0 151-91 251-104 98-13 165 39 256-47 53-50 95-99 173-129"
            fill="none"
            stroke="#f15a13"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M100 525c147-91 211-151 309-151 105 0 151-91 251-104 98-13 165 39 256-47 53-50 95-99 173-129"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            strokeDasharray="2 17"
            strokeLinecap="round"
          />

          <g className="maps-view__place" transform="translate(100 525)">
            <circle r="11" fill="#fff9f0" stroke="#f15a13" strokeWidth="5" />
            <text x="-5" y="34">
              Munich
            </text>
          </g>
          <g
            className="maps-view__place maps-view__place--intermediate"
            transform="translate(660 270)"
          >
            <circle r="7" fill="#fff9f0" stroke="#8b8173" strokeWidth="3" />
            <text x="16" y="6">
              Salzburg
            </text>
          </g>
          <g className="maps-view__place" transform="translate(1040 94)">
            <circle r="11" fill="#f15a13" stroke="#fff9f0" strokeWidth="5" />
            <text x="-52" y="36">
              Linz
            </text>
          </g>

          <g transform="translate(930 213)">
            <circle r="29" fill="#f15a13" opacity=".18" />
            <circle r="20" fill="#f15a13" stroke="#fff9f0" strokeWidth="5" />
            <path
              d="M-9-5h11l7 7v8H-9zM2-5v7h7"
              fill="none"
              stroke="#fff"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <circle cx="-4" cy="11" r="2" fill="#fff" />
            <circle cx="5" cy="11" r="2" fill="#fff" />
          </g>

          <g className="maps-view__road-label" transform="translate(767 221) rotate(-30)">
            <rect x="-18" y="-13" width="36" height="26" rx="7" />
            <text y="5">A1</text>
          </g>
          <path
            d="M48 82 96 82 96 34"
            fill="none"
            stroke="#625a50"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="m86 44 10-10 10 10"
            fill="none"
            stroke="#625a50"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text x="48" y="110" className="maps-view__north">
            N
          </text>
        </svg>

        <div className="maps-view__legend">
          <span className="maps-view__legend-dot" /> Planned route
        </div>
        <div className="maps-view__zoom" aria-label="Map zoom controls">
          <button
            type="button"
            aria-label="Zoom in"
            onClick={() => setZoom((value) => Math.min(1.8, value + 0.2))}
          >
            +
          </button>
          <button
            type="button"
            aria-label="Zoom out"
            onClick={() => setZoom((value) => Math.max(1, value - 0.2))}
          >
            −
          </button>
        </div>
        <div className="maps-view__attribution">Illustrative demo map · Not in-game map data</div>
      </div>

      <div className="maps-summary">
        <div className="maps-summary__route">
          <Route size={20} aria-hidden="true" />
          <strong>
            {job.origin.city} <span>→</span> {job.destination.city}
          </strong>
        </div>
        <div className="maps-summary__progress">
          <div className="maps-summary__progress-label">
            <span>Route progress</span>
            <strong>{progress}%</strong>
          </div>
          <div className="maps-summary__bar">
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="maps-summary__fact">
          <Navigation size={18} aria-hidden="true" />
          <span>{route.remainingKm} km remaining</span>
        </div>
        <div className="maps-summary__fact">
          <MapPin size={18} aria-hidden="true" />
          <span>Next: {route.nextStop.name}</span>
        </div>
        <div className="maps-summary__fact">
          <Truck size={18} aria-hidden="true" />
          <span>Demo truck · Sample position</span>
        </div>
      </div>
    </section>
  );
}
