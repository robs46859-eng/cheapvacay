import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  Home as HomeIcon,
  MapPin,
  Calculator,
  Bookmark,
  Tag,
  MessageSquare,
  Star,
  Clock,
  Shield,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import TripPlanner from './components/planner/TripPlanner';
import AIAssistant from './components/ai/AIAssistant';
import { cn } from './lib/utils';
import { Deal, Destination, SavedTrip } from './types';
import { getSavedTrips } from './lib/storage';

const Home = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    fetch('/api/destinations')
      .then((res) => res.json())
      .then((data) => setDestinations(data))
      .catch((error) => console.error('Failed to load destinations', error));
  }, []);

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      <header className="space-y-5">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary">
          <Sparkles className="w-4 h-4" />
          Launch-ready MVP for budget travel across India
        </div>
        <div className="space-y-3 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary">CheapVacay India</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Compare practical transport options, estimate full trip costs, save itineraries, and get AI guidance that stays grounded in budget travel reality.
          </p>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border bg-card p-5 space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Planner</p>
          <p className="text-2xl font-bold">Route + stay + buffer</p>
          <p className="text-sm text-muted-foreground">Get a full estimate instead of just transport price.</p>
        </div>
        <div className="rounded-2xl border bg-card p-5 space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Save Trips</p>
          <p className="text-2xl font-bold">Local draft library</p>
          <p className="text-sm text-muted-foreground">Keep shortlisted itineraries while testing messaging before auth ships.</p>
        </div>
        <div className="rounded-2xl border bg-card p-5 space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Assistant</p>
          <p className="text-2xl font-bold">Server-backed advice</p>
          <p className="text-sm text-muted-foreground">Gemini stays behind the API instead of leaking into the client bundle.</p>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((dest) => (
          <div key={dest.id} className="group border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-card">
            <div className="relative h-56 overflow-hidden">
              <img src={dest.imageUrl} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
              <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/20">
                Cost Index: {dest.baseCostIndex}
              </div>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex justify-between items-center gap-3">
                <h3 className="text-2xl font-bold">{dest.name}</h3>
                <div className="flex items-center text-yellow-500 shrink-0">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="ml-1 text-sm font-bold text-foreground">{dest.planningScore?.toFixed(1) ?? '4.5'}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{dest.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Average hotel</span>
                <span className="font-semibold">₹{dest.avgHotelPrice}/night</span>
              </div>
              <div className="pt-2">
                <Link
                  to={`/planner?destId=${dest.id}`}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-all active:scale-95"
                >
                  <Calculator className="w-4 h-4" />
                  Start Planning
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="bg-accent/5 rounded-3xl p-8 border border-accent/10 space-y-6">
        <h2 className="text-2xl font-bold text-center">Why CheapVacay India is launchable now</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <h4 className="font-bold">Focused MVP Scope</h4>
            <p className="text-sm text-muted-foreground">The product solves one job clearly: budget estimation for India trips before booking.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="font-bold">Fast Planning Flow</h4>
            <p className="text-sm text-muted-foreground">Destination selection, transport choice, and full cost output all happen in one screen.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h4 className="font-bold">Practical AI Layer</h4>
            <p className="text-sm text-muted-foreground">Advice is framed around cost tradeoffs, seasonality, and budget-risk warnings.</p>
          </div>
        </div>
      </section>

      <AIAssistant />
    </div>
  );
};

const SavedTrips = () => {
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);

  useEffect(() => {
    setSavedTrips(getSavedTrips());
  }, []);

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-4xl mx-auto">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Saved Trips</h2>
        <p className="text-muted-foreground">This MVP keeps trips in local storage so you can validate the experience before adding accounts and sync.</p>
      </div>

      {savedTrips.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed p-10 text-center text-muted-foreground bg-card">
          No saved trips yet. Build one in the planner and save it here for comparison.
        </div>
      ) : (
        <div className="space-y-4">
          {savedTrips.map((trip) => (
            <div key={trip.id} className="p-5 border rounded-2xl bg-card flex flex-col md:flex-row md:justify-between md:items-center gap-4 hover:shadow-md transition-shadow">
              <div className="space-y-1">
                <h3 className="text-xl font-bold">{trip.destinationName}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {trip.startDate} to {trip.endDate}
                </p>
                <p className="text-sm text-muted-foreground">
                  From {trip.origin} via {trip.transportLabel}
                </p>
              </div>
              <div className="text-left md:text-right space-y-1">
                <p className="text-xl font-bold text-primary">₹{trip.totalCost.toLocaleString('en-IN')}</p>
                <span className="text-xs font-bold px-2 py-1 bg-green-500/10 text-green-700 rounded-full inline-flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  {trip.status === 'ready' ? 'Ready to book' : 'Draft'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <AIAssistant />
    </div>
  );
};

const Deals = () => {
  const [deals, setDeals] = useState<Deal[]>([]);

  useEffect(() => {
    fetch('/api/deals')
      .then((res) => res.json())
      .then((data) => setDeals(data))
      .catch((error) => console.error('Failed to load deals', error));
  }, []);

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Launch Offers and Budget Tactics</h2>
        <p className="text-muted-foreground">These launch offers are based on the actual destination and route patterns bundled into the planner, not placeholder promo copy.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {deals.map((deal) => (
          <div key={deal.id} className="p-6 border-2 border-primary/20 rounded-2xl bg-primary/5 space-y-4 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
            <div className="space-y-2">
              <h3 className="text-xl font-bold">{deal.title}</h3>
              <p className="text-sm text-muted-foreground">{deal.description}</p>
            </div>
            <div className="flex justify-between items-center gap-3">
              <div className="px-3 py-1 bg-primary text-primary-foreground font-mono font-bold rounded-lg tracking-widest">
                {deal.code}
              </div>
              <span className="text-sm text-muted-foreground italic">{deal.expiresAt}</span>
            </div>
            <div className="text-sm text-muted-foreground border-t border-primary/10 pt-3">
              {deal.eligibilityRule}
            </div>
          </div>
        ))}
      </div>

      <section className="rounded-3xl border bg-card p-6 md:p-8 space-y-5">
        <h3 className="text-2xl font-bold">Suggested launch messaging</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-accent/10 p-4">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Headline</p>
            <p className="mt-2 font-semibold">Plan an India trip you can actually afford.</p>
          </div>
          <div className="rounded-2xl bg-accent/10 p-4">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Proof Point</p>
            <p className="mt-2 font-semibold">Transport, hotel, food, activities, and safety buffer in one estimate.</p>
          </div>
          <div className="rounded-2xl bg-accent/10 p-4">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">CTA</p>
            <p className="mt-2 font-semibold">Pick a destination and build your first trip in under two minutes.</p>
          </div>
        </div>
      </section>

      <AIAssistant />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
        <nav className="hidden md:flex flex-col w-72 bg-card border-r p-6 space-y-8 h-screen sticky top-0">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight block">CheapVacay</span>
              <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">India MVP</span>
            </div>
          </div>

          <div className="space-y-2 flex-1">
            <NavLink to="/" icon={<HomeIcon />} label="Home" />
            <NavLink to="/planner" icon={<Calculator />} label="Planner" />
            <NavLink to="/saved" icon={<Bookmark />} label="Saved Trips" />
            <NavLink to="/deals" icon={<Tag />} label="Launch Offers" />
          </div>

          <div className="p-4 bg-accent/10 rounded-2xl space-y-2">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Launch Target</p>
            <p className="text-2xl font-black text-primary">20 beta planners</p>
            <p className="text-sm text-muted-foreground">Enough feedback to prioritize payments, accounts, and live inventory.</p>
          </div>
        </nav>

        <main className="flex-1 pb-20 md:pb-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/planner" element={<TripPlanner />} />
            <Route path="/saved" element={<SavedTrips />} />
            <Route path="/deals" element={<Deals />} />
          </Routes>
        </main>

        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t flex items-center justify-around z-40">
          <MobileNavLink to="/" icon={<HomeIcon />} label="Home" />
          <MobileNavLink to="/planner" icon={<Calculator />} label="Plan" />
          <MobileNavLink to="/saved" icon={<Bookmark />} label="Saved" />
          <MobileNavLink to="/deals" icon={<Tag />} label="Launch" />
        </nav>
      </div>
    </Router>
  );
}

function NavLink({ to, icon, label }: { to: string; icon: ReactNode; label: string }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        'flex items-center gap-3 p-3 rounded-xl font-bold transition-all',
        isActive ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105' : 'hover:bg-accent text-muted-foreground',
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function MobileNavLink({ to, icon, label }: { to: string; icon: ReactNode; label: string }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        'flex flex-col items-center gap-1 transition-all',
        isActive ? 'text-primary scale-110' : 'text-muted-foreground',
      )}
    >
      {icon}
      <span className="text-[10px] font-bold">{label}</span>
    </Link>
  );
}
