import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import './HardwareTab.css';

const PARTS = {
  power: {
    icon: '⚡',
    tag: 'Power Supply',
    name: 'Power Supply Unit',
    sub: 'Solar + Battery + Regulator',
    color: '#fbbf24',
    imgSrc: 'https://images.unsplash.com/photo-1592833159155-c62df1b65634?auto=format&fit=crop&w=600&q=80',
    imgAlt: 'Solar power system',
    desc: 'Custom-built power module using a 20W high-efficiency crystalline solar panel and 10Ah LiFePO4 battery. Features a buck-boost converter to maintain a steady 5V/3A supply for the ESP32 and sensors.',
    specs: ['20W Solar Panel', '10Ah LiFePO4', '5V/3A Regulator', 'IP65 Enclosure'],
  },
  esp32: {
    icon: '🧠',
    tag: 'Central Controller',
    name: 'ESP32 IoT Hub',
    sub: 'Dual-Core Wi-Fi & Bluetooth',
    color: '#4ade80',
    imgSrc: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    imgAlt: 'Microcontroller circuit',
    desc: 'The brain of Zenab. Uses an ESP32 dual-core processor to handle real-time sensor polling, ML inference for air quality classification, and high-speed data transmission via Wi-Fi and Bluetooth Low Energy (BLE).',
    specs: ['240MHz Dual Core', 'BT 4.2 / BLE', 'Wi-Fi 802.11 b/g/n', '20-Pin I/O'],
  },
  pm25: {
    icon: '🌫️',
    tag: 'Particulate Sensing',
    name: 'Laser PM2.5 Sensor',
    sub: 'Laser Scattering Technology',
    color: '#60a5fa',
    imgSrc: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&w=600&q=80',
    imgAlt: 'Air sensor',
    desc: 'High-precision laser scattering sensor that measures PM2.5 and PM10 concentrations. Air is sampled via a controlled intake fan to ensure accurate volumetric readings even in windy conditions.',
    specs: ['Laser Scattering', '0.3-10μm Detection', '2.5s Response Time', 'Auto-Calibration'],
  },
  mq135: {
    icon: '☣️',
    tag: 'Gas Detection',
    name: 'MQ135 VOC Sensor',
    sub: 'Multi-Gas Sensitivity',
    color: '#a78bfa',
    imgSrc: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&w=600&q=80',
    imgAlt: 'Gas sensor',
    desc: 'A sensitive chemical sensor for detecting Ammonia (NH3), Carbon Dioxide (CO2), Alcohol, Benzene, and Smoke. Crucial for monitoring urban industrial emissions and vehicle exhaust.',
    specs: ['SnO2 Sensitive Layer', '10-1000ppm Range', 'Analog Output', 'Heating Circuit'],
  },
  bio: {
    icon: '🌿',
    tag: 'Bio Filtration',
    name: 'Living Moss Wall',
    sub: 'Regenerative Bio-Filter',
    color: '#22c55e',
    imgSrc: 'https://images.unsplash.com/photo-1501004318641-739e828a1751?auto=format&fit=crop&w=600&q=80',
    imgAlt: 'Moss wall',
    desc: 'The core purification element. Specialized moss species selected for high heavy metal and particulate absorption. Integrated with automated misting to maintain peak metabolic activity.',
    specs: ['400k Leaves/m²', 'Heavy Metal Absorption', 'Self-Regenerating', 'Evaporative Cooling'],
  },
  gsm: {
    icon: '📶',
    tag: 'Connectivity',
    name: 'GSM/GPRS Module',
    sub: 'Remote Data Uplink',
    color: '#f43f5e',
    imgSrc: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80',
    imgAlt: 'Telecom module',
    desc: 'Ensures data is transmitted even in areas without Wi-Fi. Automatically sends emergency SMS alerts with GPS coordinates if hazardous pollutant levels are detected.',
    specs: ['Quad-Band 850-1900MHz', 'GPRS Class 12', 'SIM Card Socket', 'External Antenna'],
  },
  gps: {
    icon: '📍',
    tag: 'Positioning',
    name: 'NEO-6M GPS',
    sub: 'Satellite Positioning',
    color: '#06b6d4',
    imgSrc: 'https://images.unsplash.com/photo-1526614183621-29783965d207?auto=format&fit=crop&w=600&q=80',
    imgAlt: 'GPS module',
    desc: 'Provides exact spatial coordinates for every set of environmental data. Essential for mapping pollution hotspots and tracking the deployment of mobile Zenab units.',
    specs: ['50-Channel Receiver', '5Hz Update Rate', '-161dBm Sensitivity', 'Built-in EEPROM'],
  },
  fan: {
    icon: '🌬️',
    tag: 'Active Intake',
    name: 'Industrial DC Fan',
    sub: 'Brushless High-Flow',
    color: '#94a3b8',
    imgSrc: 'https://images.unsplash.com/photo-1596752718361-ec8be3c96030?auto=format&fit=crop&w=600&q=80',
    imgAlt: 'Computer fan',
    desc: 'A powerful, quiet-running brushless fan that forces air through the moss biosheets. Flow rate is dynamically adjusted based on the current PM2.5 levels to maximize efficiency.',
    specs: ['120mm PWM Fan', 'High Static Pressure', 'IP55 Rated', 'Variable Speed'],
  }
};

const HOTSPOTS = [
  { key: 'esp32', top: '40%', left: '50%' },
  { key: 'power', top: '80%', left: '30%' },
  { key: 'pm25', top: '55%', left: '20%' },
  { key: 'mq135', top: '45%', left: '75%' },
  { key: 'bio', top: '25%', left: '50%' },
  { key: 'gsm', top: '70%', left: '75%' },
  { key: 'gps', top: '60%', left: '50%' },
  { key: 'fan', top: '80%', left: '60%' },
];

export default function HardwareTab() {
  const [selected, setSelected] = useState(null);
  const [imgFailed, setImgFailed] = useState({});

  // --- Live Sensor Simulation ---
  const [liveData, setLiveData] = useState({
    aqi: 45,
    temp: 24.2,
    co2: 412,
    lastUpdate: new Date()
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => ({
        aqi: Math.max(10, Math.min(450, Math.round(prev.aqi + (Math.random() - 0.5) * 4))),
        temp: parseFloat((prev.temp + (Math.random() - 0.5) * 0.4).toFixed(1)),
        co2: Math.max(300, Math.min(1000, Math.round(prev.co2 + (Math.random() - 0.5) * 10))),
        lastUpdate: new Date()
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  // -----------------------------

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') setSelected(null); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  return (
    <div className="hw-root">
      <Navbar />

      <header className="hw-header">
        <div className="hw-badge">◆ Zenab Systems v2.4</div>
        <h1 className="hw-title">
          Hardware <em>Architecture</em>
        </h1>
        <p className="hw-sub">
          Explore the modular IoT components and biological filters that power our urban air purification technology.
        </p>

        {/* Live Monitoring Summary */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className="bg-slate-900/50 border border-emerald-500/20 rounded-2xl p-4 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌫️</span>
              <div className="text-left">
                <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Live AQI</div>
                <div className="text-emerald-400 font-black text-xl leading-tight">{liveData.aqi}</div>
              </div>
            </div>
            <div className="text-[10px] text-slate-600 font-mono">ZEN-01</div>
          </div>
          <div className="bg-slate-900/50 border border-cyan-500/20 rounded-2xl p-4 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌡️</span>
              <div className="text-left">
                <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Temperature</div>
                <div className="text-cyan-400 font-black text-xl leading-tight">{liveData.temp}°C</div>
              </div>
            </div>
            <div className="text-[10px] text-slate-600 font-mono">NODE-A</div>
          </div>
          <div className="bg-slate-900/50 border border-purple-500/20 rounded-2xl p-4 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">☣️</span>
              <div className="text-left">
                <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">CO₂ Level</div>
                <div className="text-purple-400 font-black text-xl leading-tight">{liveData.co2} ppm</div>
              </div>
            </div>
            <div className="text-[10px] text-slate-600 font-mono">SENS-VOC</div>
          </div>
        </div>
      </header>

      <div className="hw-diagram-wrap">
        {/* Scientific Style Background SVG */}
        <svg className="hw-svg" viewBox="0 0 860 620" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="trunkG" x1="430" y1="200" x2="430" y2="600" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#1e293b" />
              <stop offset="1" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="bioG" x1="430" y1="50" x2="430" y2="350" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#10b981" stopOpacity="0.4" />
              <stop offset="1" stopColor="#10b981" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Artistic Structure */}
          <path d="M430 600 V200" stroke="url(#trunkG)" strokeWidth="60" strokeLinecap="round" />
          <rect x="300" y="580" width="260" height="20" rx="10" fill="#1e293b" />

          {/* Branch Lines */}
          <path d="M430 400 L200 350" stroke="#1e293b" strokeWidth="4" />
          <path d="M430 350 L700 300" stroke="#1e293b" strokeWidth="4" />
          <path d="M430 450 L300 500" stroke="#1e293b" strokeWidth="4" />
          <path d="M430 500 L650 550" stroke="#1e293b" strokeWidth="4" />

          {/* Bio Canopy */}
          <circle cx="430" cy="200" r="150" fill="url(#bioG)" />
          <circle cx="350" cy="250" r="100" fill="url(#bioG)" />
          <circle cx="510" cy="250" r="100" fill="url(#bioG)" />

          {/* Technical Grids */}
          <g opacity="0.1">
            <line x1="0" y1="100" x2="860" y2="100" stroke="white" strokeWidth="1" />
            <line x1="0" y1="200" x2="860" y2="200" stroke="white" strokeWidth="1" />
            <line x1="0" y1="300" x2="860" y2="300" stroke="white" strokeWidth="1" />
            <line x1="0" y1="400" x2="860" y2="400" stroke="white" strokeWidth="1" />
            <line x1="0" y1="500" x2="860" y2="500" stroke="white" strokeWidth="1" />
            <line x1="215" y1="0" x2="215" y2="620" stroke="white" strokeWidth="1" />
            <line x1="430" y1="0" x2="430" y2="620" stroke="white" strokeWidth="1" />
            <line x1="645" y1="0" x2="645" y2="620" stroke="white" strokeWidth="1" />
          </g>
        </svg>

        {/* Hotspots Container (Absolute Overlays) */}
        {HOTSPOTS.map(({ key, top, left }) => {
          const p = PARTS[key];
          return (
            <div
              key={key}
              className="hw-hotspot"
              style={{ top, left }}
              onClick={() => setSelected(key)}
            >
              <div className="hs-btn" style={{ '--c': p.color }}>
                <div className="hs-ico">{p.icon}</div>
                <span className="hs-name">{p.name.toUpperCase()}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="hw-grid-section">
        <div className="hw-grid-title">Technical Specification Registry</div>
        <div className="hw-parts-grid">
          {Object.entries(PARTS).map(([key, p]) => (
            <div key={key} className="hw-grid-card group" onClick={() => setSelected(key)}>
              <div className="hw-gc-icon group-hover:scale-110 transition-transform duration-300">{p.icon}</div>
              <div className="hw-gc-name !text-white">{p.name}</div>
              <div className="hw-gc-sub">{p.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div className="hw-overlay" onClick={() => setSelected(null)}>
          <div className="hw-modal" onClick={(e) => e.stopPropagation()}>
            <button className="hw-close-btn" onClick={() => setSelected(null)}>✕</button>
            <div className="hw-modal-inner">
              <div className="hw-modal-img-col">
                {!imgFailed[selected] ? (
                  <img
                    src={PARTS[selected].imgSrc}
                    alt={PARTS[selected].imgAlt}
                    className="hw-modal-img shadow-2xl"
                    onError={() => setImgFailed((f) => ({ ...f, [selected]: true }))}
                  />
                ) : (
                  <div className="hw-modal-img-fallback">
                    <span style={{ fontSize: 52 }}>{PARTS[selected].icon}</span>
                  </div>
                )}
              </div>
              <div className="hw-modal-text-col">
                <div className="hw-modal-tag" style={{ color: PARTS[selected].color }}>
                  {PARTS[selected].tag}
                </div>
                <h2 className="hw-modal-title">{PARTS[selected].name}</h2>
                <p className="hw-modal-sub">{PARTS[selected].sub}</p>
                <p className="hw-modal-desc">{PARTS[selected].desc}</p>
                <div className="hw-modal-specs">
                  {PARTS[selected].specs.map((s, i) => (
                    <span
                      key={i}
                      className="hw-spec-chip"
                      style={{ borderColor: `${PARTS[selected].color}55`, color: PARTS[selected].color }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="hw-footer">
        ◆ ZENAB SYSTEMS · HARDWARE REGISTRY v2.4.1 ◆
      </footer>
    </div>
  );
}