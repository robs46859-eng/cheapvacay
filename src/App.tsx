import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home as HomeIcon, MapPin, Calculator, Bookmark, Tag, MessageSquare, Star, Clock, Shield, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import TripPlanner from './components/planner/TripPlanner';
import AIAssistant from './components/ai/AIAssistant';
import { cn } from './lib/utils';

// Phase 1 Components
const Home = () => {
  const [destinations, setDestinations] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/destinations')
      .then(res => res.json())
      .then(data => setDestinations(data));
  }, []);

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      <header className="space-y-4 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary">Budget Travel Planner</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">Plan your dream trip across India without breaking the bank. Smart routing, real-time budgeting, and AI assistance.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map(dest => (
          <div key={dest.id} className="group border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-card">
            <div className="relative h-56 overflow-hidden">
              <img src={dest.imageUrl} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
              <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/20">
                Cost Index: {dest.baseCostIndex}
              </div>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">{dest.name}</h3>
                <div className="flex items-center text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="ml-1 text-sm font-bold text-foreground">4.8</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{dest.description}</p>
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
        <h2 className="text-2xl font-bold text-center">Why Choose Budget Travel Planner?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <h4 className="font-bold">Verified Providers</h4>
            <p className="text-sm text-muted-foreground">We only partner with reliable bus and taxi operators across India.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="font-bold">Real-time Estimates</h4>
            <p className="text-sm text-muted-foreground">Get accurate cost breakdowns based on current market indices.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h4 className="font-bold">AI Trip Assistant</h4>
            <p className="text-sm text-muted-foreground">Personalized advice to help you save more on every journey.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

const SavedTrips = () => {
  const mockSaved = [
    { id: 't1', name: 'Weekend in Jaipur', date: 'Oct 12 - Oct 15', cost: '₹8,500', status: 'Planned' },
    { id: 't2', name: 'Goa Beach Trip', date: 'Nov 20 - Nov 26', cost: '₹18,200', status: 'Booked' }
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold">Your Saved Trips</h2>
      <div className="space-y-4">
        {mockSaved.map(trip => (
          <div key={trip.id} className="p-5 border rounded-2xl bg-card flex justify-between items-center hover:shadow-md transition-shadow">
            <div className="space-y-1">
              <h3 className="text-xl font-bold">{trip.name}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" /> {trip.date}
              </p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-xl font-bold text-primary">{trip.cost}</p>
              <span className="text-xs font-bold px-2 py-1 bg-green-500/10 text-green-600 rounded-full flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> {trip.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Deals = () => {
  const mockDeals = [
    { id: 'd1', title: 'Early Bird: 20% Off Manali Hotels', code: 'MANALI20', expires: '2 days left' },
    { id: 'd2', title: 'State Bus Pass: Flat ₹200 Off', code: 'BUSPASS', expires: 'Limited time' }
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold">Exclusive Travel Deals</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockDeals.map(deal => (
          <div key={deal.id} className="p-6 border-2 border-primary/20 rounded-2xl bg-primary/5 space-y-4 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
            <h3 className="text-xl font-bold">{deal.title}</h3>
            <div className="flex justify-between items-center">
              <div className="px-3 py-1 bg-primary text-primary-foreground font-mono font-bold rounded-lg tracking-widest">
                {deal.code}
              </div>
              <span className="text-sm text-muted-foreground italic">{deal.expires}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
        {/* Sidebar for Desktop */}
        <nav className="hidden md:flex flex-col w-64 bg-card border-r p-6 space-y-8 h-screen sticky top-0">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground">
              <MapPin className="w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tighter">BUDGETRIP</span>
          </div>
          
          <div className="space-y-2 flex-1">
            <NavLink to="/" icon={<HomeIcon />} label="Home" />
            <NavLink to="/planner" icon={<Calculator />} label="Planner" />
            <NavLink to="/saved" icon={<Bookmark />} label="Saved Trips" />
            <NavLink to="/deals" icon={<Tag />} label="Deals" />
          </div>

          <div className="p-4 bg-accent/10 rounded-2xl space-y-2">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Loyalty Score</p>
            <p className="text-2xl font-black text-primary">1,250</p>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 pb-20 md:pb-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/planner" element={<TripPlanner />} />
            <Route path="/saved" element={<SavedTrips />} />
            <Route path="/deals" element={<Deals />} />
          </Routes>
        </main>

        {/* Bottom Nav for Mobile */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t flex items-center justify-around z-40">
          <MobileNavLink to="/" icon={<HomeIcon />} label="Home" />
          <MobileNavLink to="/planner" icon={<Calculator />} label="Plan" />
          <MobileNavLink to="/saved" icon={<Bookmark />} label="Saved" />
          <MobileNavLink to="/deals" icon={<Tag />} label="Deals" />
        </nav>

        <AIAssistant />
      </div>
    </Router>
  );
}

function NavLink({ to, icon, label }: { to: string, icon: any, label: string }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl font-bold transition-all",
        isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105" : "hover:bg-accent text-muted-foreground"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function MobileNavLink({ to, icon, label }: { to: string, icon: any, label: string }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      className={cn(
        "flex flex-col items-center gap-1 transition-all",
        isActive ? "text-primary scale-110" : "text-muted-foreground"
      )}
    >
      {icon}
      <span className="text-[10px] font-bold">{label}</span>
    </Link>
  );
}
