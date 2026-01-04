const fs = require('fs');

// 1. Load the dataset
const rawData = fs.readFileSync('top_offplan_areas.json', 'utf8');
const dataset = JSON.parse(rawData);

// Helper for Hexagon Geometry
const createHexagon = (lat, lng, radiusKm) => {
    const coords = [];
    const R = 6371;
    for (let i = 0; i < 7; i++) {
        const theta = (2 * Math.PI / 6) * i;
        const dLat = (radiusKm / R) * (180 / Math.PI) * Math.cos(theta);
        const dLng = (radiusKm / R) * (180 / Math.PI) * Math.sin(theta) / Math.cos(lat * Math.PI / 180);
        coords.push([lng + dLng, lat + dLat]);
    }
    return coords;
};

// 2. Transform Areas into Rich 3D Pillars
const pillars = dataset.areas.map(area => {
    const valueBillion = area.total_value_aed['2025'];
    const growth = area.sales_volume.growth_2025_pct;

    // Derived Metrics
    const topDev = area.top_developers_2025?.[0]?.name || "N/A";
    const yieldPct = area.rental_yield?.rental_yield_pct || 0;
    const avgPrice = area.key_projects_2025?.[0]?.avg_price || 0;
    const transactions = area.sales_volume['2025'] || 0;

    // Height & Color Logic (Same as before)
    const height = valueBillion * 300;
    let color = "#3B82F6";
    if (growth > 50) color = "#10B981";
    else if (growth > 20) color = "#8B5CF6";
    else if (growth > 0) color = "#06B6D4";
    else color = "#F59E0B";

    return {
        type: "Feature",
        geometry: {
            type: "Polygon",
            coordinates: [createHexagon(area.centroid.lat, area.centroid.lng, 0.5)]
        },
        properties: {
            name: area.name,
            height: height,
            color: color,
            label: `AED ${valueBillion.toFixed(1)}B`,
            growth_txt: `${growth > 0 ? '+' : ''}${growth}%`,

            // Rich Metadata for Tooltip
            transactions: transactions.toLocaleString(),
            yield: `${yieldPct}%`,
            top_developer: topDev,
            avg_price: `AED ${(avgPrice / 1000000).toFixed(1)}M`,
            top_project: area.key_projects_2025?.[0]?.name || "Generic"
        }
    };
});

// 3. Transform Key Projects (Icons)
const projects = [];
dataset.areas.forEach(area => {
    if (area.key_projects_2025 && area.key_projects_2025.length > 0) {
        const topProject = area.key_projects_2025[0];
        const offsetLat = area.centroid.lat + (Math.random() - 0.5) * 0.015;
        const offsetLng = area.centroid.lng + (Math.random() - 0.5) * 0.015;

        projects.push({
            name: topProject.name,
            lat: offsetLat,
            lng: offsetLng,
            type: "Key Launch",
            value: `AED ${(topProject.value_2025 / 1000).toFixed(1)}B`
        });
    }
});

// Output
const pillarsGeoJSON = { type: "FeatureCollection", features: pillars };
fs.writeFileSync('public/data/growth_pillars.json', JSON.stringify(pillarsGeoJSON, null, 2));

const storyJSON = { major_projects: projects };
fs.writeFileSync('public/data/growth_story.json', JSON.stringify(storyJSON, null, 2));

console.log(`Processed Rich Data: ${pillars.length} pillars generated.`);
