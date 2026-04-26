import React, { useCallback, useEffect, useMemo, useState } from "react";
import Globe from "./components/Globe.jsx";
import SearchBar from "./components/SearchBar.jsx";
import CountryPanel from "./components/CountryPanel.jsx";
import CityPanel from "./components/CityPanel.jsx";
import CompareBar from "./components/CompareBar.jsx";
import CompareTable from "./components/CompareTable.jsx";
import ScenarioExplorer from "./components/ScenarioExplorer.jsx";
import ChartPanel from "./components/ChartPanel.jsx";
import LoadingScreen from "./components/LoadingScreen.jsx";
import TopNav from "./components/TopNav.jsx";
import StatePanel from "./components/StatePanel.jsx";
import TimeScrubber from "./components/TimeScrubber.jsx";

import countries from "./data/countries.json";
import cities from "./data/cities.json";
import usStatesData from "./data/us_states.json";

/* ── helpers ──────────────────────────────────────────── */
function clampPins(items, max = 4) {
  return items.length <= max ? items : items.slice(0, max);
}

/* ── Toast component ──────────────────────────────────── */
function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] toast-enter">
      <div className="glass-strong rounded-xl shadow-glow px-4 py-2.5 text-sm text-slate-200 flex items-center gap-2">
        <svg className="w-4 h-4 text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {message}
      </div>
    </div>
  );
}

/* ── Main App ─────────────────────────────────────────── */
export default function App() {
  const [loading, setLoading] = useState(true);
  
  // Selection
  const [selectedCountryId, setSelectedCountryId] = useState("USA");
  const [selectedStateId, setSelectedStateId] = useState(null);
  const [selectedCityId, setSelectedCityId] = useState(null);
  
  // Interactions
  const [dataLens, setDataLens] = useState("none");
  const [activeYear, setActiveYear] = useState(2026);

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [pinned, setPinned] = useState([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [scenarioOpen, setScenarioOpen] = useState(false);
  const [activeScenario, setActiveScenario] = useState(null);
  const [chartsOpen, setChartsOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const scenarioCountryIds = useMemo(() => {
    if (!activeScenario) return null;
    return countries.filter(c => {
      if (activeScenario === 'gang-crisis') return (c.gangRelatedGunDeathsPercent >= 50 || c.organizedCrimeIndex >= 6.5);
      if (activeScenario === 'permissive-risk') return (c.lawStrictness || "").toLowerCase() === 'permissive' && c.homicideRatePer100k > 5;
      if (activeScenario === 'safe-havens') return (c.lawStrictness || "").toLowerCase() === 'strict' && c.homicideRatePer100k < 2;
      if (activeScenario === 'youth-risk') return c.underAge25Percent >= 50;
      return false;
    }).map(c => c.id);
  }, [activeScenario, countries]);

  const selectedCountry = useMemo(
    () => countries.find((c) => c.id === selectedCountryId) ?? countries[0],
    [selectedCountryId]
  );

  const selectedState = useMemo(() => {
    if (!selectedStateId) return null;
    return usStatesData.find((s) => s.id === selectedStateId) ?? null;
  }, [selectedStateId]);

  const selectedCity = useMemo(() => {
    if (!selectedCityId) return null;
    return cities.find((ct) => ct.id === selectedCityId) ?? null;
  }, [selectedCityId]);

  // Cities for the current context: if a state is selected, show cities for that state
  // Otherwise show cities for the selected country
  const citiesForContext = useMemo(() => {
    if (selectedStateId) {
      return cities.filter((ct) => ct.stateId === selectedStateId);
    }
    if (!selectedCountryId) return [];
    // For USA at country level, don't show cities (show states instead)
    if (selectedCountryId === "USA") return [];
    return cities.filter((ct) => ct.countryId === selectedCountryId);
  }, [selectedCountryId, selectedStateId]);

  // US states for when USA is selected at country level
  const statesForCountry = useMemo(() => {
    if (selectedCountryId !== "USA") return [];
    return usStatesData;
  }, [selectedCountryId]);

  const globalAvgKeyMetrics = useMemo(() => {
    const avg = (key) => countries.reduce((sum, c) => sum + (c[key] ?? 0), 0) / Math.max(1, countries.length);
    return {
      homicideRatePer100k: avg("homicideRatePer100k"),
      firearmHomicideRate: avg("firearmHomicideRate"),
      organizedCrimeIndex: avg("organizedCrimeIndex"),
      underAge25Percent: avg("underAge25Percent"),
      likelihoodDeathIfOwner: avg("likelihoodDeathIfOwner"),
      likelihoodIncarcerationIfOwner: avg("likelihoodIncarcerationIfOwner"),
    };
  }, []);

  /* ── handlers ──────────────────────────────────────── */
  const handleSelectLocation = useCallback((loc) => {
    if (!loc) return;
    setSidebarOpen(true);
    setScenarioOpen(false);
    setChartsOpen(false);

    if (loc.type === "country") {
      setSelectedCityId(null);
      setSelectedStateId(null);
      setSelectedCountryId(loc.countryId);
    } else if (loc.type === "state") {
      setSelectedCityId(null);
      setSelectedCountryId("USA");
      setSelectedStateId(loc.stateId);
    } else {
      setSelectedCityId(loc.cityId);
      setSelectedCountryId(loc.countryId);
    }
  }, []);

  const handleSelectState = useCallback((stateId) => {
    setSelectedCountryId("USA");
    setSelectedStateId(stateId);
    setSelectedCityId(null);
    setSidebarOpen(true);
  }, []);

  const handleViewCity = useCallback((cityId) => {
    const ct = cities.find((x) => x.id === cityId);
    if (!ct) return;
    setSelectedCountryId(ct.countryId);
    if (ct.stateId) setSelectedStateId(ct.stateId);
    setSelectedCityId(cityId);
  }, []);

  const handleBackToCountry = useCallback(() => {
    setSelectedStateId(null);
    setSelectedCityId(null);
  }, []);

  const handleBackToState = useCallback(() => {
    setSelectedCityId(null);
  }, []);

  const pinToCompare = useCallback((pin) => {
    setPinned((prev) => {
      if (prev.some((p) => p.type === pin.type && p.id === pin.id)) {
        return prev.filter((p) => !(p.type === pin.type && p.id === pin.id));
      }
      return clampPins([...prev, pin], 4);
    });
  }, []);

  const handleGlobeReady = useCallback(() => {
    setLoading(false);
  }, []);

  const handleCountryNotFound = useCallback((name) => {
    setToast(`No detailed data available for ${name}`);
  }, []);

  return (
    <div className="relative h-full overflow-hidden">
      {/* Loading screen */}
      {loading && (
        <div className={loading ? "" : "animate-fade-out pointer-events-none"}>
          <LoadingScreen visible={true} />
        </div>
      )}

      {/* ── z-0: Globe ─────────────────────────────────── */}
      <div className="absolute inset-0">
        <Globe
          countries={countries}
          cities={cities}
          usStates={usStatesData}
          selectedCountryId={selectedCountryId}
          selectedStateId={selectedStateId}
          selectedCityId={selectedCityId}
          scenarioCountryIds={scenarioCountryIds}
          citiesVisible={!!selectedCountryId}
          dataLens={dataLens}
          activeYear={activeYear}
          onSelectCountry={(countryId) => handleSelectLocation({ type: "country", countryId })}
          onSelectState={handleSelectState}
          onSelectCity={(cityId) => {
            const ct = cities.find((x) => x.id === cityId);
            if (!ct) return;
            handleViewCity(cityId);
          }}
          onGlobeReady={handleGlobeReady}
          onCountryNotFound={handleCountryNotFound}
        />
      </div>

      {/* ── z-10: Top Navigation Bar ───────────────────── */}
      <TopNav
        chartsOpen={chartsOpen}
        onToggleCharts={() => setChartsOpen(!chartsOpen)}
        scenarioOpen={scenarioOpen}
        onToggleScenarios={() => setScenarioOpen(!scenarioOpen)}
        dataLens={dataLens}
        onSetDataLens={setDataLens}
      >
        <SearchBar countries={countries} cities={cities} onSelectLocation={handleSelectLocation} />
      </TopNav>

      {/* ── z-20: Sidebar panel ────────────────────────── */}
      <div className="absolute top-[80px] right-6 bottom-[100px] w-full max-w-[360px] z-20 pointer-events-none flex flex-col">
        <div
          className={`h-full pointer-events-auto transition-all duration-300 ease-out ${
            sidebarOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8 pointer-events-none"
          }`}
        >
          {selectedCity ? (
            <CityPanel
              city={selectedCity}
              country={selectedCountry}
              state={selectedState}
              activeYear={activeYear}
              onDismiss={handleBackToState}
              onPin={() =>
                pinToCompare({
                  type: "city",
                  id: selectedCity.id,
                  label: `${selectedCity.name} (${selectedCountry.name})`,
                })
              }
              onClosePanel={() => setSidebarOpen(false)}
            />
          ) : selectedStateId ? (
            <StatePanel
              stateData={selectedState}
              citiesForState={citiesForContext}
              activeYear={activeYear}
              onBack={handleBackToCountry}
              onPin={() =>
                pinToCompare({
                  type: "state",
                  id: selectedState.id,
                  label: selectedState.name,
                })
              }
              onViewCity={handleViewCity}
              onClosePanel={() => setSidebarOpen(false)}
            />
          ) : (
            <CountryPanel
              country={selectedCountry}
              citiesForCountry={citiesForContext}
              statesForCountry={statesForCountry}
              globalAvgKeyMetrics={globalAvgKeyMetrics}
              activeYear={activeYear}
              onPin={() =>
                pinToCompare({
                  type: "country",
                  id: selectedCountry.id,
                  label: selectedCountry.name,
                })
              }
              onViewCity={handleViewCity}
              onSelectState={handleSelectState}
              onClosePanel={() => setSidebarOpen(false)}
            />
          )}
        </div>
      </div>

      {/* ── z-30: Sidebar Toggle (if hidden) ──────────────── */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="absolute top-20 right-4 z-30 glass rounded-xl px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white transition-all duration-200 flex items-center gap-2 hover:shadow-glow"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h7" strokeLinecap="round" />
          </svg>
          Panel
        </button>
      )}

      {/* ── z-25: TimeScrubber ─────────────────────────── */}
      {!chartsOpen && !scenarioOpen && (
        <TimeScrubber activeYear={activeYear} onSetYear={setActiveYear} />
      )}

      {/* ── z-30: CompareBar ───────────────────────────── */}
      <div className="absolute bottom-6 w-full z-30 pointer-events-none">
        <div className="pointer-events-auto">
          <CompareBar
            pinned={pinned}
            onRemove={(i) => setPinned((prev) => prev.filter((_, idx) => idx !== i))}
            onCompare={() => setCompareOpen(true)}
          />
        </div>
      </div>

      {/* ── z-40: Modals & Overlays ────────────────────── */}
      {chartsOpen && (
        <div className="absolute bottom-24 left-4 right-4 z-40 h-[45vh] max-w-5xl mx-auto animate-slide-up">
          <ChartPanel
            countries={countries}
            cities={cities}
            onClose={() => setChartsOpen(false)}
            onPin={(countryId) => {
              const c = countries.find((x) => x.id === countryId);
              if (!c) return;
              pinToCompare({ type: "country", id: c.id, label: c.name });
            }}
          />
        </div>
      )}

      {/* ── z-50: Modals ───────────────────────────────── */}
      {compareOpen && (
        <CompareTable
          pinned={pinned}
          countries={countries}
          cities={cities}
          onClose={() => setCompareOpen(false)}
        />
      )}

      <ScenarioExplorer
        open={scenarioOpen}
        onClose={() => setScenarioOpen(false)}
        activeScenario={activeScenario}
        onChange={setActiveScenario}
        countries={countries}
        scenarioCountryIds={scenarioCountryIds}
        onPin={(countryId) => {
          const c = countries.find((x) => x.id === countryId);
          if (!c) return;
          pinToCompare({ type: "country", id: c.id, label: c.name });
        }}
        onSelectCountry={(countryId) => handleSelectLocation({ type: "country", countryId })}
      />

      {/* ── Toast ──────────────────────────────────────── */}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
