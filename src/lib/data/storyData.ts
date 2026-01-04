export interface GlobeConnectionCity {
  name: string;
  lat: number;
  lng: number;
  transactions: number;
}

export interface AreaStatsExtended {
  building_count: number;
  avg_price_sqft: number;
  median_price_sqft: number;
  yoy_growth: number;
  transaction_count_2024: number;
  total_units: number;
  investment_grade: 'A+' | 'A' | 'A-' | 'B+' | 'B';
  roi_5year: number;
  price_tier: 'premium' | 'high' | 'medium' | 'affordable';
}

export interface StoryArea {
  id: number;
  name: string;
  rank: number;
  boundary: {
    type: 'Polygon';
    coordinates: number[][][];
  };
  centroid: { lat: number; lng: number };
  stats: AreaStatsExtended;
  visual_hints: {
    color: string;
    priority: 'high' | 'medium' | 'low';
    camera_keyframe: { lat: number; lng: number; altitude: number };
  };
  highlights: string[];
}

export interface StoryBuilding {
  id: string;
  area_id: number;
  position: { lat: number; lng: number };
  height_meters: number;
  floors: number;
  data: {
    units: number;
    avg_price: number;
    price_per_sqft: number;
    occupancy_rate: number;
    building_type: 'residential' | 'commercial' | 'mixed';
    year_built: number;
    roi_5year?: number;
  };
}

export interface StoryScene {
  metadata: {
    version: string;
    generated_at: string;
    total_buildings: number;
    total_areas: number;
    bounding_box: {
      min_lat: number;
      max_lat: number;
      min_lng: number;
      max_lng: number;
      center: { lat: number; lng: number };
    };
  };
  globe_data: {
    dubai_position: { lat: number; lng: number };
    connection_cities: GlobeConnectionCity[];
  };
  areas: StoryArea[];
  buildings: StoryBuilding[];
  historical_data: {
    price_trends: Record<number, Record<string, number>>;
  };
  forecasts: {
    '2025': Record<number, {
      predicted_growth: number;
      confidence: number;
      factors: string[];
    }>;
  };
}

// Dubai center coordinates
const DUBAI_CENTER = { lat: 25.2048, lng: 55.2708 };

// Top 20 areas with realistic data
const top20Areas: Omit<StoryArea, 'boundary'>[] = [
  {
    id: 1,
    name: 'Dubai Marina',
    rank: 1,
    centroid: { lat: 25.0772, lng: 55.1398 },
    stats: {
      building_count: 500,
      avg_price_sqft: 2340,
      median_price_sqft: 2200,
      yoy_growth: 15.3,
      transaction_count_2024: 3420,
      total_units: 45000,
      investment_grade: 'A+',
      roi_5year: 45.2,
      price_tier: 'premium',
    },
    visual_hints: {
      color: '#EF4444',
      priority: 'high',
      camera_keyframe: { lat: 25.0772, lng: 55.1398, altitude: 2000 },
    },
    highlights: [
      'Waterfront living with yacht access',
      'Walking distance to Dubai Marina Mall',
      'Premium high-rise towers',
    ],
  },
  {
    id: 2,
    name: 'Downtown Dubai',
    rank: 2,
    centroid: { lat: 25.1972, lng: 55.2794 },
    stats: {
      building_count: 320,
      avg_price_sqft: 2800,
      median_price_sqft: 2650,
      yoy_growth: 18.5,
      transaction_count_2024: 2890,
      total_units: 28000,
      investment_grade: 'A+',
      roi_5year: 52.1,
      price_tier: 'premium',
    },
    visual_hints: {
      color: '#EF4444',
      priority: 'high',
      camera_keyframe: { lat: 25.1972, lng: 55.2794, altitude: 2000 },
    },
    highlights: [
      'Home to Burj Khalifa',
      'Dubai Mall proximity',
      'Iconic skyline views',
    ],
  },
  {
    id: 3,
    name: 'Business Bay',
    rank: 3,
    centroid: { lat: 25.1865, lng: 55.2642 },
    stats: {
      building_count: 280,
      avg_price_sqft: 1950,
      median_price_sqft: 1850,
      yoy_growth: 12.8,
      transaction_count_2024: 2150,
      total_units: 22000,
      investment_grade: 'A',
      roi_5year: 38.7,
      price_tier: 'high',
    },
    visual_hints: {
      color: '#F59E0B',
      priority: 'high',
      camera_keyframe: { lat: 25.1865, lng: 55.2642, altitude: 2000 },
    },
    highlights: [
      'Central business district',
      'Canal views',
      'Mixed-use development',
    ],
  },
  {
    id: 4,
    name: 'JBR',
    rank: 4,
    centroid: { lat: 25.0889, lng: 55.1353 },
    stats: {
      building_count: 180,
      avg_price_sqft: 2100,
      median_price_sqft: 2000,
      yoy_growth: 14.2,
      transaction_count_2024: 1890,
      total_units: 15000,
      investment_grade: 'A',
      roi_5year: 41.3,
      price_tier: 'high',
    },
    visual_hints: {
      color: '#F59E0B',
      priority: 'high',
      camera_keyframe: { lat: 25.0889, lng: 55.1353, altitude: 2000 },
    },
    highlights: [
      'Beachfront location',
      'The Walk JBR',
      'Family-friendly community',
    ],
  },
  {
    id: 5,
    name: 'Palm Jumeirah',
    rank: 5,
    centroid: { lat: 25.1129, lng: 55.1390 },
    stats: {
      building_count: 150,
      avg_price_sqft: 3200,
      median_price_sqft: 3000,
      yoy_growth: 22.1,
      transaction_count_2024: 890,
      total_units: 8500,
      investment_grade: 'A+',
      roi_5year: 58.4,
      price_tier: 'premium',
    },
    visual_hints: {
      color: '#EF4444',
      priority: 'high',
      camera_keyframe: { lat: 25.1129, lng: 55.1390, altitude: 2000 },
    },
    highlights: [
      'Iconic palm-shaped island',
      'Luxury villas and apartments',
      'Exclusive waterfront living',
    ],
  },
  {
    id: 6,
    name: 'Dubai Hills',
    rank: 6,
    centroid: { lat: 25.0900, lng: 55.3300 },
    stats: {
      building_count: 120,
      avg_price_sqft: 1650,
      median_price_sqft: 1550,
      yoy_growth: 10.5,
      transaction_count_2024: 1120,
      total_units: 9800,
      investment_grade: 'A-',
      roi_5year: 32.1,
      price_tier: 'medium',
    },
    visual_hints: {
      color: '#5B93FF',
      priority: 'medium',
      camera_keyframe: { lat: 25.0900, lng: 55.3300, altitude: 2000 },
    },
    highlights: ['Golf course views', 'Family community', 'Green spaces'],
  },
  {
    id: 7,
    name: 'Arabian Ranches',
    rank: 7,
    centroid: { lat: 25.0600, lng: 55.2000 },
    stats: {
      building_count: 95,
      avg_price_sqft: 1450,
      median_price_sqft: 1380,
      yoy_growth: 8.7,
      transaction_count_2024: 780,
      total_units: 7200,
      investment_grade: 'B+',
      roi_5year: 28.5,
      price_tier: 'medium',
    },
    visual_hints: {
      color: '#5B93FF',
      priority: 'medium',
      camera_keyframe: { lat: 25.0600, lng: 55.2000, altitude: 2000 },
    },
    highlights: ['Villa community', 'Equestrian facilities', 'Family-oriented'],
  },
  {
    id: 8,
    name: 'Jumeirah Village Circle',
    rank: 8,
    centroid: { lat: 25.0400, lng: 55.1800 },
    stats: {
      building_count: 200,
      avg_price_sqft: 1200,
      median_price_sqft: 1150,
      yoy_growth: 9.2,
      transaction_count_2024: 2450,
      total_units: 18000,
      investment_grade: 'B+',
      roi_5year: 25.3,
      price_tier: 'affordable',
    },
    visual_hints: {
      color: '#10B981',
      priority: 'medium',
      camera_keyframe: { lat: 25.0400, lng: 55.1800, altitude: 2000 },
    },
    highlights: ['Affordable living', 'Growing community', 'Good connectivity'],
  },
  {
    id: 9,
    name: 'Dubai Sports City',
    rank: 9,
    centroid: { lat: 25.0300, lng: 55.1600 },
    stats: {
      building_count: 85,
      avg_price_sqft: 1100,
      median_price_sqft: 1050,
      yoy_growth: 7.5,
      transaction_count_2024: 650,
      total_units: 6200,
      investment_grade: 'B',
      roi_5year: 22.1,
      price_tier: 'affordable',
    },
    visual_hints: {
      color: '#10B981',
      priority: 'low',
      camera_keyframe: { lat: 25.0300, lng: 55.1600, altitude: 2000 },
    },
    highlights: ['Sports facilities', 'Affordable options', 'Community feel'],
  },
  {
    id: 10,
    name: 'Jumeirah Lake Towers',
    rank: 10,
    centroid: { lat: 25.0650, lng: 55.1450 },
    stats: {
      building_count: 250,
      avg_price_sqft: 1750,
      median_price_sqft: 1680,
      yoy_growth: 11.3,
      transaction_count_2024: 3120,
      total_units: 24000,
      investment_grade: 'A-',
      roi_5year: 35.2,
      price_tier: 'medium',
    },
    visual_hints: {
      color: '#5B93FF',
      priority: 'medium',
      camera_keyframe: { lat: 25.0650, lng: 55.1450, altitude: 2000 },
    },
    highlights: ['Metro connectivity', 'Business hub', 'Waterfront views'],
  },
  // Additional areas 11-20 with similar structure
  {
    id: 11,
    name: 'Al Barsha',
    rank: 11,
    centroid: { lat: 25.1200, lng: 55.2000 },
    stats: {
      building_count: 180,
      avg_price_sqft: 1400,
      median_price_sqft: 1320,
      yoy_growth: 8.9,
      transaction_count_2024: 1890,
      total_units: 15000,
      investment_grade: 'B+',
      roi_5year: 26.8,
      price_tier: 'medium',
    },
    visual_hints: {
      color: '#5B93FF',
      priority: 'low',
      camera_keyframe: { lat: 25.1200, lng: 55.2000, altitude: 2000 },
    },
    highlights: ['Central location', 'Mall of Emirates proximity'],
  },
  {
    id: 12,
    name: 'Discovery Gardens',
    rank: 12,
    centroid: { lat: 25.0500, lng: 55.1300 },
    stats: {
      building_count: 160,
      avg_price_sqft: 1050,
      median_price_sqft: 1000,
      yoy_growth: 6.5,
      transaction_count_2024: 1420,
      total_units: 12800,
      investment_grade: 'B',
      roi_5year: 20.5,
      price_tier: 'affordable',
    },
    visual_hints: {
      color: '#10B981',
      priority: 'low',
      camera_keyframe: { lat: 25.0500, lng: 55.1300, altitude: 2000 },
    },
    highlights: ['Budget-friendly', 'Good amenities'],
  },
  {
    id: 13,
    name: 'Motor City',
    rank: 13,
    centroid: { lat: 25.0700, lng: 55.2500 },
    stats: {
      building_count: 75,
      avg_price_sqft: 1350,
      median_price_sqft: 1280,
      yoy_growth: 9.1,
      transaction_count_2024: 580,
      total_units: 5500,
      investment_grade: 'B+',
      roi_5year: 24.2,
      price_tier: 'medium',
    },
    visual_hints: {
      color: '#5B93FF',
      priority: 'low',
      camera_keyframe: { lat: 25.0700, lng: 55.2500, altitude: 2000 },
    },
    highlights: ['Racing theme', 'Family community'],
  },
  {
    id: 14,
    name: 'Dubai Silicon Oasis',
    rank: 14,
    centroid: { lat: 25.1300, lng: 55.3800 },
    stats: {
      building_count: 140,
      avg_price_sqft: 1250,
      median_price_sqft: 1180,
      yoy_growth: 7.8,
      transaction_count_2024: 1120,
      total_units: 10200,
      investment_grade: 'B',
      roi_5year: 23.1,
      price_tier: 'affordable',
    },
    visual_hints: {
      color: '#10B981',
      priority: 'low',
      camera_keyframe: { lat: 25.1300, lng: 55.3800, altitude: 2000 },
    },
    highlights: ['Tech hub', 'Affordable'],
  },
  {
    id: 15,
    name: 'International City',
    rank: 15,
    centroid: { lat: 25.1500, lng: 55.3500 },
    stats: {
      building_count: 220,
      avg_price_sqft: 950,
      median_price_sqft: 900,
      yoy_growth: 5.2,
      transaction_count_2024: 2890,
      total_units: 22000,
      investment_grade: 'B',
      roi_5year: 18.5,
      price_tier: 'affordable',
    },
    visual_hints: {
      color: '#10B981',
      priority: 'low',
      camera_keyframe: { lat: 25.1500, lng: 55.3500, altitude: 2000 },
    },
    highlights: ['Very affordable', 'Diverse community'],
  },
  {
    id: 16,
    name: 'Mirdif',
    rank: 16,
    centroid: { lat: 25.2200, lng: 55.4000 },
    stats: {
      building_count: 110,
      avg_price_sqft: 1300,
      median_price_sqft: 1220,
      yoy_growth: 8.3,
      transaction_count_2024: 890,
      total_units: 8500,
      investment_grade: 'B+',
      roi_5year: 25.7,
      price_tier: 'medium',
    },
    visual_hints: {
      color: '#5B93FF',
      priority: 'low',
      camera_keyframe: { lat: 25.2200, lng: 55.4000, altitude: 2000 },
    },
    highlights: ['Family area', 'Good schools'],
  },
  {
    id: 17,
    name: 'Al Furjan',
    rank: 17,
    centroid: { lat: 25.0800, lng: 55.1400 },
    stats: {
      building_count: 95,
      avg_price_sqft: 1150,
      median_price_sqft: 1100,
      yoy_growth: 7.2,
      transaction_count_2024: 720,
      total_units: 6800,
      investment_grade: 'B',
      roi_5year: 21.3,
      price_tier: 'affordable',
    },
    visual_hints: {
      color: '#10B981',
      priority: 'low',
      camera_keyframe: { lat: 25.0800, lng: 55.1400, altitude: 2000 },
    },
    highlights: ['New development', 'Growing'],
  },
  {
    id: 18,
    name: 'The Springs',
    rank: 18,
    centroid: { lat: 25.1000, lng: 55.1700 },
    stats: {
      building_count: 70,
      avg_price_sqft: 1500,
      median_price_sqft: 1420,
      yoy_growth: 8.1,
      transaction_count_2024: 520,
      total_units: 4800,
      investment_grade: 'B+',
      roi_5year: 27.2,
      price_tier: 'medium',
    },
    visual_hints: {
      color: '#5B93FF',
      priority: 'low',
      camera_keyframe: { lat: 25.1000, lng: 55.1700, altitude: 2000 },
    },
    highlights: ['Villa community', 'Lakes'],
  },
  {
    id: 19,
    name: 'The Meadows',
    rank: 19,
    centroid: { lat: 25.0900, lng: 55.1600 },
    stats: {
      building_count: 65,
      avg_price_sqft: 1550,
      median_price_sqft: 1480,
      yoy_growth: 8.5,
      transaction_count_2024: 480,
      total_units: 4200,
      investment_grade: 'B+',
      roi_5year: 28.9,
      price_tier: 'medium',
    },
    visual_hints: {
      color: '#5B93FF',
      priority: 'low',
      camera_keyframe: { lat: 25.0900, lng: 55.1600, altitude: 2000 },
    },
    highlights: ['Villa community', 'Green spaces'],
  },
  {
    id: 20,
    name: 'Nad Al Sheba',
    rank: 20,
    centroid: { lat: 25.1800, lng: 55.3200 },
    stats: {
      building_count: 55,
      avg_price_sqft: 1600,
      median_price_sqft: 1520,
      yoy_growth: 9.3,
      transaction_count_2024: 420,
      total_units: 3800,
      investment_grade: 'B+',
      roi_5year: 29.5,
      price_tier: 'medium',
    },
    visual_hints: {
      color: '#5B93FF',
      priority: 'low',
      camera_keyframe: { lat: 25.1800, lng: 55.3200, altitude: 2000 },
    },
    highlights: ['Equestrian area', 'Villas'],
  },
];

// Generate boundary polygons (simplified rectangles around centroids)
function generateBoundary(centroid: { lat: number; lng: number }): number[][][] {
  const offset = 0.01; // ~1km
  return [[
    [centroid.lng - offset, centroid.lat - offset],
    [centroid.lng + offset, centroid.lat - offset],
    [centroid.lng + offset, centroid.lat + offset],
    [centroid.lng - offset, centroid.lat + offset],
    [centroid.lng - offset, centroid.lat - offset],
  ]];
}

// Generate buildings for an area
function generateBuildingsForArea(
  area: Omit<StoryArea, 'boundary'>,
  count: number
): StoryBuilding[] {
  const buildings: StoryBuilding[] = [];
  const baseLat = area.centroid.lat;
  const baseLng = area.centroid.lng;
  const spread = 0.008; // Spread buildings around centroid

  for (let i = 0; i < count; i++) {
    const lat = baseLat + (Math.random() - 0.5) * spread;
    const lng = baseLng + (Math.random() - 0.5) * spread;
    const floors = Math.floor(Math.random() * 40) + 5; // 5-45 floors
    const height_meters = floors * 3.5; // ~3.5m per floor
    const units = Math.floor(Math.random() * 200) + 50; // 50-250 units
    const pricePerSqft = area.stats.avg_price_sqft * (0.8 + Math.random() * 0.4); // ±20% variation
    const avgPrice = pricePerSqft * units * 1200; // Assume avg 1200 sqft per unit

    buildings.push({
      id: `building-${area.id}-${i}`,
      area_id: area.id,
      position: { lat, lng },
      height_meters,
      floors,
      data: {
        units,
        avg_price: avgPrice,
        price_per_sqft: pricePerSqft,
        occupancy_rate: 0.75 + Math.random() * 0.2, // 75-95%
        building_type: i % 3 === 0 ? 'commercial' : i % 3 === 1 ? 'mixed' : 'residential',
        year_built: 2005 + Math.floor(Math.random() * 20),
        roi_5year: area.stats.roi_5year * (0.9 + Math.random() * 0.2),
      },
    });
  }

  return buildings;
}

// Generate all buildings (max 150 per area, total ~2500)
const allBuildings: StoryBuilding[] = [];
top20Areas.forEach((area) => {
  const count = Math.min(area.stats.building_count, 150);
  allBuildings.push(...generateBuildingsForArea(area, count));
});

// Generate areas with boundaries
const areas: StoryArea[] = top20Areas.map((area) => ({
  ...area,
  boundary: {
    type: 'Polygon' as const,
    coordinates: generateBoundary(area.centroid),
  },
}));

// Globe connection cities
const connectionCities: GlobeConnectionCity[] = [
  { name: 'London', lat: 51.5074, lng: -0.1278, transactions: 3400 },
  { name: 'New York', lat: 40.7128, lng: -74.0060, transactions: 2100 },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777, transactions: 5600 },
  { name: 'Singapore', lat: 1.3521, lng: 103.8198, transactions: 4200 },
  { name: 'Hong Kong', lat: 22.3193, lng: 114.1694, transactions: 3800 },
  { name: 'Paris', lat: 48.8566, lng: 2.3522, transactions: 2900 },
];

// Historical price trends (2020-2024) for top 5 areas
const historicalData: Record<number, Record<string, number>> = {};
[1, 2, 3, 4, 5].forEach((areaId) => {
  const area = areas.find((a) => a.id === areaId);
  if (area) {
    const basePrice = area.stats.avg_price_sqft;
    historicalData[areaId] = {
      '2020': basePrice * 0.75,
      '2021': basePrice * 0.82,
      '2022': basePrice * 0.90,
      '2023': basePrice * 0.95,
      '2024': basePrice,
    };
  }
});

// Forecasts for 2025
const forecasts: StoryScene['forecasts'] = {
  '2025': {},
};
areas.forEach((area) => {
  forecasts['2025'][area.id] = {
    predicted_growth: area.stats.yoy_growth * 0.7, // Slightly conservative
    confidence: 0.75 + Math.random() * 0.2,
    factors: ['Metro expansion', 'Expo legacy', 'Tourism growth'],
  };
});

// Final story scene data
export const storyData: StoryScene = {
  metadata: {
    version: '2.0.0',
    generated_at: new Date().toISOString(),
    total_buildings: allBuildings.length,
    total_areas: areas.length,
    bounding_box: {
      min_lat: 24.9,
      max_lat: 25.4,
      min_lng: 55.0,
      max_lng: 55.5,
      center: DUBAI_CENTER,
    },
  },
  globe_data: {
    dubai_position: DUBAI_CENTER,
    connection_cities: connectionCities,
  },
  areas,
  buildings: allBuildings,
  historical_data: {
    price_trends: historicalData,
  },
  forecasts,
};

