import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Calculator, Bus, Car, Hotel, Utensils, Activity, Info, Save } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Destination, Route, Budget, Trip, BudgetLevel } from '@/src/types';

export default function TripPlanner() {
  const [searchParams] = useSearchParams();
  const destId = searchParams.get('destId');

  const [destination, setDestination] = useState<Destination | null>(null);
  const [origin, setOrigin] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [budgetLevel, setBudgetLevel] = useState<BudgetLevel>('budget');
  
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (destId) {
      fetch('/api/destinations')
        .then(res => res.json())
        .then(data => {
          const dest = data.find((d: any) => d.id === destId);
          if (dest) setDestination(dest);
        });
    }
  }, [destId]);

  const handleGenerateRoutes = async () => {
    if (!origin || !destId) return;
    setLoading(true);
    try {
      const res = await fetch('/api/routes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin, destinationId: destId })
      });
      const data = await res.json();
      setRoutes(data);
      if (data.length > 0) setSelectedRouteId(data[0].id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateBudget = async () => {
    if (!destination || !startDate || !endDate || !selectedRouteId) return;
    
    const selectedRoute = routes.find(r => r.id === selectedRouteId);
    if (!selectedRoute) return;

    const trip: Partial<Trip> = {
      origin,
      destinationId: destination.id,
      startDate,
      endDate,
      travelerCount: travelers,
      budgetLevel
    };

    try {
      const res = await fetch('/api/budget/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trip, destination, routes: [selectedRoute] })
      });
      const data = await res.json();
      setBudget(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (selectedRouteId && startDate && endDate) {
      calculateBudget();
    }
  }, [selectedRouteId, startDate, endDate, travelers, budgetLevel]);

  if (!destination) return <div className="p-8 text-center">Select a destination to start planning.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <header className="flex items-center space-x-4">
        <img src={destination.imageUrl} alt={destination.name} className="w-20 h-20 rounded-xl object-cover" referrerPolicy="no-referrer" />
        <div>
          <h1 className="text-3xl font-bold">Plan Trip to {destination.name}</h1>
          <p className="text-muted-foreground">{destination.region}, {destination.country}</p>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 p-6 border rounded-2xl bg-card shadow-sm">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            Trip Details
          </h3>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Origin City</label>
              <input 
                type="text" 
                value={origin} 
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="e.g. Delhi"
                className="w-full p-2 border rounded-lg bg-background"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Start Date</label>
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-background"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">End Date</label>
                <input 
                  type="date" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-background"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Travelers</label>
                <input 
                  type="number" 
                  min="1"
                  value={travelers} 
                  onChange={(e) => setTravelers(parseInt(e.target.value))}
                  className="w-full p-2 border rounded-lg bg-background"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Budget Level</label>
                <select 
                  value={budgetLevel} 
                  onChange={(e) => setBudgetLevel(e.target.value as BudgetLevel)}
                  className="w-full p-2 border rounded-lg bg-background"
                >
                  <option value="budget">Budget</option>
                  <option value="mid">Mid-Range</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>
            </div>
            <button 
              onClick={handleGenerateRoutes}
              disabled={!origin || loading}
              className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Finding Routes...' : 'Find Transport Options'}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Bus className="w-5 h-5 text-primary" />
            Transport Options
          </h3>
          {routes.length === 0 ? (
            <div className="p-8 border-2 border-dashed rounded-2xl text-center text-muted-foreground">
              Enter origin and click "Find Transport Options"
            </div>
          ) : (
            <div className="space-y-3">
              {routes.map(route => (
                <div 
                  key={route.id}
                  onClick={() => setSelectedRouteId(route.id)}
                  className={cn(
                    "p-4 border rounded-xl cursor-pointer transition-all",
                    selectedRouteId === route.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:border-primary/50"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      {route.type === 'bus' ? <Bus className="w-5 h-5" /> : <Car className="w-5 h-5" />}
                      <div>
                        <p className="font-semibold capitalize">{route.type} - {route.provider}</p>
                        <p className="text-xs text-muted-foreground">{Math.floor(route.duration / 60)}h {route.duration % 60}m • {route.metadata.stops} stops</p>
                      </div>
                    </div>
                    <p className="font-bold text-primary">₹{route.estimatedCost}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {budget && (
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-end">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Calculator className="w-6 h-6 text-primary" />
              Budget Breakdown
            </h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:opacity-90">
              <Save className="w-4 h-4" />
              Save Trip
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-xl bg-card space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Bus className="w-4 h-4" />
                <span className="text-sm font-medium uppercase tracking-wider">Transport</span>
              </div>
              <p className="text-2xl font-bold">₹{budget.transportCost}</p>
            </div>
            <div className="p-4 border rounded-xl bg-card space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Hotel className="w-4 h-4" />
                <span className="text-sm font-medium uppercase tracking-wider">Accommodation</span>
              </div>
              <p className="text-2xl font-bold">₹{budget.hotelCost}</p>
            </div>
            <div className="p-4 border rounded-xl bg-card space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Utensils className="w-4 h-4" />
                <span className="text-sm font-medium uppercase tracking-wider">Food & Dining</span>
              </div>
              <p className="text-2xl font-bold">₹{budget.foodEstimate}</p>
            </div>
            <div className="p-4 border rounded-xl bg-card space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Activity className="w-4 h-4" />
                <span className="text-sm font-medium uppercase tracking-wider">Activities</span>
              </div>
              <p className="text-2xl font-bold">₹{budget.activitiesCost}</p>
            </div>
            <div className="p-4 border rounded-xl bg-card space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Info className="w-4 h-4" />
                <span className="text-sm font-medium uppercase tracking-wider">Misc & Buffer</span>
              </div>
              <p className="text-2xl font-bold">₹{budget.miscCost + budget.buffer}</p>
            </div>
            <div className="p-4 border rounded-xl bg-primary text-primary-foreground space-y-2">
              <div className="flex items-center gap-2 opacity-80">
                <Calculator className="w-4 h-4" />
                <span className="text-sm font-medium uppercase tracking-wider">Total Estimate</span>
              </div>
              <p className="text-3xl font-bold">₹{budget.totalCost}</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
