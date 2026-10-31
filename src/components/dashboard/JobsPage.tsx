import { useMemo, useState } from "react";
import { Clock3, Coins, MapPin, Package, Truck } from "lucide-react";
import type { CurrentJob } from "../../types/dashboard";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import "./JobsPage.css";

type CargoType = "General cargo" | "Machinery" | "Food";
type SortBy = "reward" | "distance";

interface JobOffer {
  id: string;
  cargoType: CargoType;
  job: CurrentJob;
}

const demoOffers: readonly JobOffer[] = [
  {
    id: "salzburg-vienna",
    cargoType: "General cargo",
    job: {
      origin: { city: "Salzburg", countryCode: "AT" },
      destination: { city: "Vienna", countryCode: "AT" },
      cargo: "Packaged food",
      weightTonnes: 18,
      distanceKm: 296,
      timeLeft: "3 h 10 min",
      reward: "€18,650",
    },
  },
  {
    id: "linz-prague",
    cargoType: "Machinery",
    job: {
      origin: { city: "Linz", countryCode: "AT" },
      destination: { city: "Prague", countryCode: "CZ" },
      cargo: "Workshop equipment",
      weightTonnes: 12,
      distanceKm: 248,
      timeLeft: "2 h 45 min",
      reward: "€14,920",
    },
  },
  {
    id: "innsbruck-munich",
    cargoType: "Food",
    job: {
      origin: { city: "Innsbruck", countryCode: "AT" },
      destination: { city: "Munich", countryCode: "DE" },
      cargo: "Fresh produce",
      weightTonnes: 16,
      distanceKm: 164,
      timeLeft: "1 h 55 min",
      reward: "€9,480",
    },
  },
];

interface JobsPageProps {
  initialJob: CurrentJob;
}

function JobDetails({ job }: { job: CurrentJob }) {
  return (
    <div className="jobs-page__details">
      <div className="jobs-page__route">
        <MapPin size={17} aria-hidden="true" />
        <span>
          {job.origin.city} <b>→</b> {job.destination.city}
        </span>
      </div>
      <div className="jobs-page__detail">
        <Package size={16} aria-hidden="true" />
        <span>
          {job.cargo} · {job.weightTonnes} t
        </span>
      </div>
      <div className="jobs-page__detail">
        <Truck size={16} aria-hidden="true" />
        <span>{job.distanceKm} km</span>
      </div>
      <div className="jobs-page__detail">
        <Clock3 size={16} aria-hidden="true" />
        <span>{job.timeLeft}</span>
      </div>
      <div className="jobs-page__reward">
        <Coins size={17} aria-hidden="true" />
        <strong>{job.reward}</strong>
      </div>
    </div>
  );
}

export function JobsPage({ initialJob }: JobsPageProps) {
  const [activeJob, setActiveJob] = useState(initialJob);
  const [offers, setOffers] = useState(demoOffers);
  const [cargoFilter, setCargoFilter] = useState("All cargo");
  const [sortBy, setSortBy] = useState<SortBy>("reward");

  const visibleOffers = useMemo(() => {
    return [...offers]
      .filter((offer) => cargoFilter === "All cargo" || offer.cargoType === cargoFilter)
      .sort((a, b) => {
        const aValue =
          sortBy === "reward" ? Number(a.job.reward.replace(/[^\d]/g, "")) : a.job.distanceKm;
        const bValue =
          sortBy === "reward" ? Number(b.job.reward.replace(/[^\d]/g, "")) : b.job.distanceKm;
        return bValue - aValue;
      });
  }, [cargoFilter, offers, sortBy]);

  function acceptOffer(offer: JobOffer) {
    setActiveJob(offer.job);
    setOffers((current) => current.filter(({ id }) => id !== offer.id));
  }

  return (
    <div className="jobs-page">
      <header className="jobs-page__heading">
        <div>
          <h1>Jobs</h1>
          <p>Manage your delivery and choose the next contract.</p>
        </div>
        <span className="jobs-page__demo">
          <Badge variant="demo" /> Sample contracts
        </span>
      </header>

      <Card title="Active delivery" icon={Truck}>
        <div className="jobs-page__active">
          <div className="jobs-page__active-main">
            <span className="jobs-page__eyebrow">CURRENT CONTRACT</span>
            <strong className="jobs-page__active-route">
              {activeJob.origin.city} <span>→</span> {activeJob.destination.city}
            </strong>
            <span className="jobs-page__active-cargo">
              {activeJob.cargo} · {activeJob.weightTonnes} t
            </span>
          </div>
          <div className="jobs-page__active-facts">
            <div>
              <span>Distance</span>
              <strong>{activeJob.distanceKm} km</strong>
            </div>
            <div>
              <span>Time left</span>
              <strong>{activeJob.timeLeft}</strong>
            </div>
            <div>
              <span>Reward</span>
              <strong>{activeJob.reward}</strong>
            </div>
          </div>
        </div>
      </Card>

      <Card
        title="Available contracts"
        icon={Package}
        action={<span className="jobs-page__count">{visibleOffers.length} available</span>}
      >
        <div className="jobs-page__toolbar">
          <label>
            <span>Cargo</span>
            <select value={cargoFilter} onChange={(event) => setCargoFilter(event.target.value)}>
              <option>All cargo</option>
              <option>General cargo</option>
              <option>Machinery</option>
              <option>Food</option>
            </select>
          </label>
          <label>
            <span>Sort by</span>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value as SortBy)}>
              <option value="reward">Highest reward</option>
              <option value="distance">Longest distance</option>
            </select>
          </label>
        </div>

        {visibleOffers.length > 0 ? (
          <div className="jobs-page__offers">
            {visibleOffers.map((offer) => (
              <article className="jobs-page__offer" key={offer.id}>
                <div className="jobs-page__offer-type">{offer.cargoType}</div>
                <JobDetails job={offer.job} />
                <button
                  className="jobs-page__accept"
                  type="button"
                  onClick={() => acceptOffer(offer)}
                >
                  Accept job
                </button>
              </article>
            ))}
          </div>
        ) : (
          <p className="jobs-page__empty">No contracts match this cargo filter.</p>
        )}
      </Card>
    </div>
  );
}
