// Gavikina Energy — shared sizing engine (PRD §4.1: single source of truth)
// Consumed by the Solar Calculator, the AI Lead Qualifier and the Product Catalogue.
(function () {
  const APPLIANCES = [
    { id: 'led', name: 'LED bulbs', category: 'Lighting', typical_wattage: 10, default_quantity: 6 },
    { id: 'seclight', name: 'Security lights', category: 'Lighting', typical_wattage: 100, default_quantity: 2 },
    { id: 'fanstand', name: 'Standing fan', category: 'Cooling', typical_wattage: 60, default_quantity: 2 },
    { id: 'fanceil', name: 'Ceiling fan', category: 'Cooling', typical_wattage: 75, default_quantity: 2 },
    { id: 'ac1', name: 'Air conditioner — 1HP', category: 'Cooling', typical_wattage: 750, default_quantity: 1 },
    { id: 'ac15', name: 'Air conditioner — 1.5HP', category: 'Cooling', typical_wattage: 1200, default_quantity: 1 },
    { id: 'tv', name: 'TV — 43" LED', category: 'Living', typical_wattage: 100, default_quantity: 1 },
    { id: 'decoder', name: 'Decoder / set-top box', category: 'Living', typical_wattage: 30, default_quantity: 1 },
    { id: 'router', name: 'Wi-Fi router', category: 'Living', typical_wattage: 15, default_quantity: 1 },
    { id: 'laptop', name: 'Laptop', category: 'Living', typical_wattage: 65, default_quantity: 2 },
    { id: 'phones', name: 'Phone charging', category: 'Living', typical_wattage: 15, default_quantity: 3 },
    { id: 'fridge', name: 'Fridge — small/medium', category: 'Kitchen', typical_wattage: 150, default_quantity: 1 },
    { id: 'freezer', name: 'Chest freezer', category: 'Kitchen', typical_wattage: 250, default_quantity: 1 },
    { id: 'dispenser', name: 'Water dispenser', category: 'Kitchen', typical_wattage: 550, default_quantity: 1 },
    { id: 'blender', name: 'Blender', category: 'Kitchen', typical_wattage: 400, default_quantity: 1 },
    { id: 'microwave', name: 'Microwave', category: 'Kitchen', typical_wattage: 1200, default_quantity: 1 },
    { id: 'iron', name: 'Electric iron', category: 'Utility', typical_wattage: 1000, default_quantity: 1 },
    { id: 'washer', name: 'Washing machine', category: 'Utility', typical_wattage: 500, default_quantity: 1 },
    { id: 'pump', name: 'Water pump', category: 'Utility', typical_wattage: 750, default_quantity: 1 },
    { id: 'pos', name: 'POS terminal + printer', category: 'Business', typical_wattage: 200, default_quantity: 2 },
    { id: 'desktop', name: 'Desktop workstation', category: 'Business', typical_wattage: 250, default_quantity: 2 },
    { id: 'coldroom', name: 'Display chiller', category: 'Business', typical_wattage: 900, default_quantity: 1 }
  ];

  // Indicative pricing — pending client confirmation (PRD §14).
  const TIERS = [
    { id: 't15', name: '1.5kVA', size_kva: 1.5, price_range_min: 850000, price_range_max: 1150000,
      typically_powers: ['Lights and fans', 'TV and decoder', 'Phone and laptop charging', 'Wi-Fi router'],
      notes: 'Essentials backup for a small flat or shop.' },
    { id: 't25', name: '2.5kVA', size_kva: 2.5, price_range_min: 1400000, price_range_max: 1850000,
      typically_powers: ['Everything in 1.5kVA', 'Fridge or freezer', 'Water pump', 'Small office equipment'],
      notes: 'The common choice for a two-bedroom home.' },
    { id: 't35', name: '3.5kVA', size_kva: 3.5, price_range_min: 2200000, price_range_max: 2800000,
      typically_powers: ['Everything in 2.5kVA', 'One 1HP air conditioner', 'Freezer plus fridge', 'Iron in short bursts'],
      notes: 'Comfortable whole-home cover with one AC.' },
    { id: 't5', name: '5kVA', size_kva: 5, price_range_min: 3400000, price_range_max: 4200000,
      typically_powers: ['Everything in 3.5kVA', 'Two air conditioners', 'Microwave and washing machine', 'Busy retail floor'],
      notes: 'Larger homes and small businesses.' },
    { id: 't10', name: '10kVA', size_kva: 10, price_range_min: 6800000, price_range_max: 8500000,
      typically_powers: ['Multiple ACs', 'Display chillers and cold storage', 'Full office floor', 'Light workshop tools'],
      notes: 'Business-grade. Site inspection required before quoting.' }
  ];

  const INCLUDED = ['Solar panels', 'Hybrid inverter', 'Lithium battery bank', 'Roof or ground mounting',
    'Surge and lightning protection', 'DC and AC cabling', 'Installation labour', 'Commissioning and handover'];

  const BACKUP_OPTIONS = [
    { id: '4h', label: '4 hours', hours: 4, note: 'Evening cover' },
    { id: '8h', label: '8 hours', hours: 8, note: 'Overnight' },
    { id: '12h', label: '12 hours', hours: 12, note: 'Half a day' },
    { id: '24h', label: '24 hours', hours: 24, note: 'Full day, no grid' }
  ];

  const REASONS = [
    { id: 'outage', label: 'Grid supply is unreliable' },
    { id: 'fuel', label: 'Generator fuel is too expensive' },
    { id: 'noise', label: 'Generator noise and fumes' },
    { id: 'business', label: 'Downtime is costing the business' },
    { id: 'clean', label: 'Moving to cleaner energy' }
  ];

  const PAYMENT_METHODS = [
    { id: 'full', label: 'Full payment upfront' },
    { id: 'stages', label: 'Staged payment' },
    { id: 'finance', label: 'Financing / instalments' },
    { id: 'advise', label: 'Not sure — advise me' }
  ];

  const fmt = (n) => '\u20a6' + Math.round(n).toLocaleString('en-NG');
  const fmtRange = (t) => fmt(t.price_range_min) + ' – ' + fmt(t.price_range_max);

  function watts(selection) {
    return APPLIANCES.reduce((sum, a) => sum + (selection[a.id] || 0) * a.typical_wattage, 0);
  }

  // Peak load + 30% headroom, converted at 0.8 power factor.
  function size(selection, backupHours) {
    const w = watts(selection);
    const requiredKva = w === 0 ? 0 : (w * 1.3) / 0.8 / 1000;
    const long = backupHours && backupHours >= 12;
    const target = long ? requiredKva * 1.15 : requiredKva;
    const tier = TIERS.find(t => t.size_kva >= target) || TIERS[TIERS.length - 1];
    return { watts: w, requiredKva, tier: w === 0 ? null : tier };
  }

  // Rough monthly saving: fuel spend avoided, against amortised system midpoint over 7 years.
  function fuelCompare(monthlySpend, tier) {
    if (!tier || !monthlySpend) return null;
    const mid = (tier.price_range_min + tier.price_range_max) / 2;
    const months = mid / monthlySpend;
    return {
      monthlySpend, annualSpend: monthlySpend * 12, fiveYearSpend: monthlySpend * 60,
      systemMid: mid, paybackMonths: Math.round(months),
      fiveYearSaving: Math.max(0, monthlySpend * 60 - mid)
    };
  }

  window.GE = { APPLIANCES, TIERS, INCLUDED, BACKUP_OPTIONS, REASONS, PAYMENT_METHODS, fmt, fmtRange, watts, size, fuelCompare,
    categories: [...new Set(APPLIANCES.map(a => a.category))] };
})();
