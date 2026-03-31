import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Calculator, Bus, Car, Hotel, Utensils, Activity, Info, Save, AlertCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Budget, BudgetLevel, Destination, Route, SavedTrip, Trip } from '@/src/types';
import { saveTrip } from '@/src/lib/storage';
import AIAssistant from '@/src/components/ai/AIAssistant';

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
  const [plannerError, setPlannerError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/destinations')
      .then((res) => res.json())
      .then((data) => {
        if (!destId) {
          setDestination(data[0] ?? null);
          return;
        }

        const selectedDestination = data.find((item: Destination) => item.id === destId);
        setDestination(selectedDestination ?? null);
      })
      .catch((error) => {
        console.error('Failed to load destinations', error);
        setPlannerError('Unable to load destinations right now.');
      });
  }, [destId]);

  const selectedRoute = useMemo(
    () => routes.find((route) => route.id === selectedRouteId) ?? null,
    [routes, selectedRouteId],
  );

  const tripContext = useMemo(
    () => ({
      origin,
      startDate,
      endDate,
      travelerCount: travelers,
      budgetLevel,
      selectedRoute: selectedRoute
        ? {
            type: selectedRoute.type,
            provider: selectedRoute.provider,
            estimatedCost: selectedRoute.estimatedCost,
          }
        : null,
      currentBudgetEstimate: budget?.totalCost ?? null,
    }),
    [origin, startDate, endDate, travelers, budgetLevel, selectedRoute, budget],
  );

  const hasValidDates = useMemo(() => {
    if (!startDate || !endDate) {
      return false;
    }

    return new Date(endDate) >= new Date(startDate);
  }, [startDate, endDate]);

  const handleGenerateRoutes = async () => {
    setSaveMessage(null);

    if (!origin.trim() || !destination) {
      setPlannerError('Enter an origin city before searching for transport.');
      return;
    }

    if (!hasValidDates && startDate && endDate) {
      setPlannerError('End date must be the same day or later than the start date.');
      return;
    }

    setPlannerError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/routes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin: origin.trim(), destinationId: destination.id, travelers, budgetLevel }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate routes');
      }

      const data = await res.json();
      setRoutes(data);
      setSelectedRouteId(data[0]?.id ?? null);
    } catch (error) {
      console.error(error);
      setPlannerError('Transport options could not be generated right now.');
    } finally {
      setLoading(false);
    }
  };

  const calculateBudget = async () => {
    if (!destination || !hasValidDates || !selectedRoute || !origin.trim()) {
      return;
    }

    const trip: Partial<Trip> = {
      origin: origin.trim(),
      destinationId: destination.id,
      startDate,
      endDate,
      travelerCount: travelers,
      budgetLevel,
    };

    try {
      const res = await fetch('/api/budget/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trip, destination, routes: [selectedRoute] }),
      });

      if (!res.ok) {
        throw new Error('Failed to calculate budget');
      }

      const data = await res.json();
      setBudget(data);
    } catch (error) {
      console.error(error);
      setPlannerError('Budget calculation failed. Try again.');
    }
  };

  useEffect(() => {
    if (selectedRouteId && startDate && endDate && hasValidDates) {
      calculateBudget();
    }
  }, [selectedRouteId, startDate, endDate, travelers, budgetLevel, hasValidDates]);

  const handleSaveTrip = () => {
    if (!destination || !selectedRoute || !budget || !startDate || !endDate || !origin.trim()) {
      setSaveMessage('Complete the planner first, then save the trip.');
      return;
    }

    const tripToSave: SavedTrip = {
      id: `${destination.id}-${startDate}-${endDate}-${selectedRoute.id}`,
      destinationId: destination.id,
      destinationName: destination.name,
      origin: origin.trim(),
      startDate,
      endDate,
      travelerCount: travelers,
      budgetLevel,
      transportLabel: `${selectedRoute.type} • ${selectedRoute.provider}`,
      totalCost: budget.totalCost,
      createdAt: new Date().toISOString(),
      status: 'ready',
    };

    saveTrip(tripToSave);
    setSaveMessage('Trip saved locally. You can compare it from Saved Trips.');
  };

  if (!destination) {
    return <div className="p-8 text-center">Select a destination from Home to start planning.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
      <header className="flex flex-col md:flex-row md:items-center gap-4">
        <img src={destination.imageUrl} alt={destination.name} className="w-20 h-20 rounded-xl object-cover" referrerPolicy="no-referrer" />
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Plan a CheapVacay to {destination.name}</h1>
          <p className="text-muted-foreground">{destination.region}, {destination.country}</p>
          <p className="text-sm text-muted-foreground">Average stay baseline: ₹{destination.avgHotelPrice}/night</p>
        </div>
      </header>

      {plannerError && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 text-amber-900 p-4">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <p className="text-sm">{plannerError}</p>
        </div>
      )}

      {saveMessage && (
        <div className="rounded-2xl border border-green-300 bg-green-50 text-green-900 p-4 text-sm">
          {saveMessage}
        </div>
      )}

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
                  onChange={(e) => setTravelers(Math.max(1, parseInt(e.target.value || '1', 10)))}
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
                  <option value="mid">Mid-range</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleGenerateRoutes}
              disabled={!origin.trim() || loading}
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
              Enter your trip details and click "Find Transport Options".
            </div>
          ) : (
            <div className="space-y-3">
              {routes.map((route) => (
                <div
                  key={route.id}
                  onClick={() => setSelectedRouteId(route.id)}
                  className={cn(
                    'p-4 border rounded-xl cursor-pointer transition-all',
                    selectedRouteId === route.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:border-primary/50',
                  )}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex items-center gap-3">
                      {route.type === 'bus' ? <Bus className="w-5 h-5" /> : <Car className="w-5 h-5" />}
                      <div>
                        <p className="font-semibold capitalize">{route.type} • {route.provider}</p>
                        <p className="text-xs text-muted-foreground">
                          {Math.floor(route.duration / 60)}h {route.duration % 60}m • {route.metadata.stops} stops
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-primary">₹{Math.round(route.estimatedCost).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {budget && (
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Calculator className="w-6 h-6 text-primary" />
              Budget Breakdown
            </h3>
            <button onClick={handleSaveTrip} className="flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:opacity-90">
              <Save className="w-4 h-4" />
              Save Trip
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BudgetCard icon={<Bus className="w-4 h-4" />} label="Transport" value={budget.transportCost} />
            <BudgetCard icon={<Hotel className="w-4 h-4" />} label="Accommodation" value={budget.hotelCost} />
            <BudgetCard icon={<Utensils className="w-4 h-4" />} label="Food & Dining" value={budget.foodEstimate} />
            <BudgetCard icon={<Activity className="w-4 h-4" />} label="Activities" value={budget.activitiesCost} />
            <BudgetCard icon={<Info className="w-4 h-4" />} label="Misc & Buffer" value={budget.miscCost + budget.buffer} />
            <div className="p-4 border rounded-xl bg-primary text-primary-foreground space-y-2">
              <div className="flex items-center gap-2 opacity-80">
                <Calculator className="w-4 h-4" />
                <span className="text-sm font-medium uppercase tracking-wider">Total Estimate</span>
              </div>
              <p className="text-3xl font-bold">₹{Math.round(budget.totalCost).toLocaleString('en-IN')}</p>
            </div>
          </div>
        </section>
      )}

      <AIAssistant tripContext={tripContext} destinationContext={destination} />
    </div>
  );
}

function BudgetCard({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <div className="p-4 border rounded-xl bg-card space-y-2">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-sm font-medium uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-2xl font-bold">₹{Math.round(value).toLocaleString('en-IN')}</p>
    </div>
  );
}
