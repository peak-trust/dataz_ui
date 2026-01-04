"use client";

import * as React from "react";
import Map, { Source, Layer, MapRef, Marker } from "react-map-gl/mapbox";
// import type { LayerProps } from "react-map-gl";
type LayerProps = React.ComponentProps<typeof Layer>;
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useGsap, gsap, easingPresets } from "@/lib/hooks/useGsap";
import { ChapterContainer } from "./shared-chapter-container";
import { useHaptics } from "./hooks/use-haptics";
import { motion, AnimatePresence } from "framer-motion";

// --- Configuration ---
const MAPBOX_TOKEN = "pk.eyJ1IjoicHQtbWFwYm94IiwiYSI6ImNtang4eHczbDRxaHgzZXNjdDEzN3VxYWcifQ.vc3u8kaG6IiytSz55mOK6w";
const MAP_STYLE = "mapbox://styles/mapbox/dark-v11";

// --- Types ---
interface ProjectLaunch {
    name: string;
    lat: number;
    lng: number;
    type: string;
}

// --- Sub-Components ---

const HudMarker = ({ feature, idx, isOpen, onClose }: { feature: any, idx: number, isOpen: boolean, onClose: () => void }) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const cardRef = React.useRef<HTMLDivElement>(null);
    const lineRef = React.useRef<SVGLineElement>(null);
    const { triggerHaptic } = useHaptics();

    // Initial offsets
    const initialX = 100;
    const initialY = -50;

    useGsap(() => {
        if (!containerRef.current) return;

        if (isOpen) {
            // Animate IN
            const tl = gsap.timeline();

            // 1. Line grows
            if (lineRef.current) {
                tl.fromTo(lineRef.current,
                    { attr: { x2: 0, y2: 0 }, opacity: 0 },
                    { attr: { x2: initialX, y2: initialY }, opacity: 1, duration: 0.4, ease: "power2.out" }
                );
            }

            // 2. Card appears
            if (cardRef.current) {
                // Ensure visibility
                gsap.set(cardRef.current, { visibility: "visible" });

                tl.fromTo(cardRef.current,
                    { opacity: 0, scale: 0.8, x: initialX - 20, y: initialY },
                    { opacity: 1, scale: 1, x: initialX, y: initialY, duration: 0.4, ease: "back.out(1.2)" },
                    "-=0.2"
                );

                // Continuous float effect
                gsap.to(cardRef.current, {
                    y: initialY - 5,
                    duration: 2,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    delay: 0.4
                });
            }

        } else {
            // Animate OUT
            // Rapidly hide
            if (cardRef.current) {
                gsap.to(cardRef.current, {
                    opacity: 0,
                    scale: 0.8,
                    duration: 0.2,
                    ease: "power2.in"
                });
            }
            if (lineRef.current) {
                gsap.to(lineRef.current, {
                    attr: { x2: 0, y2: 0 },
                    opacity: 0,
                    duration: 0.2,
                    delay: 0.1
                });
            }
        }
    }, [isOpen]);

    return (
        <Marker
            longitude={feature.geometry.coordinates[0][0][0]}
            latitude={feature.geometry.coordinates[0][0][1]}
            anchor="bottom"
            onClick={(e) => {
                e.originalEvent.stopPropagation();
            }}
        >
            <div ref={containerRef} className="relative flex items-end justify-center group/marker">

                {/* 1. Base Anchor Dot */}
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        triggerHaptic("light");
                        onClose(); // Toggle
                    }}
                    className={`w-3 h-3 rounded-full shadow-[0_0_10px_#34d399] z-10 transition-all duration-300 ${isOpen ? 'bg-emerald-500 scale-125 opacity-100' : 'bg-gray-500 opacity-0 pointer-events-none'}`}
                />

                {/* 2. Dynamic Tether Line */}
                <svg className="absolute bottom-1 left-1/2 -translate-x-1/2 overflow-visible pointer-events-none" style={{ width: 1, height: 1 }}>
                    <line
                        ref={lineRef}
                        x1={0} y1={0}
                        x2={0} y2={0}
                        stroke="#34d399"
                        strokeWidth="1.5"
                        strokeOpacity="0.6"
                        style={{ filter: "drop-shadow(0 0 2px #34d399)", opacity: 0 }}
                    />
                </svg>

                {/* 3. The Card */}
                <div
                    ref={cardRef}
                    className="absolute bottom-1 left-1/2 w-64 pointer-events-auto opacity-0 invisible"
                    style={{ transform: `translate(${initialX}px, ${initialY}px)` }} // Default pos
                >
                    <div className={`relative p-4 rounded-xl bg-surface-elevated-2/95 backdrop-blur-xl border border-emerald-500/40 flex flex-col gap-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] -translate-x-1/2`}>
                        {/* Close Button */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                                triggerHaptic("light");
                                onClose();
                            }}
                            onPointerDown={(e) => e.stopPropagation()}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-surface-elevated hover:bg-red-500 rounded-full text-white flex items-center justify-center border border-border-default transition-colors shadow-lg z-50 cursor-pointer"
                        >
                            <svg width="10" height="10" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 1L13 13M1 13L13 1" />
                            </svg>
                        </motion.button>

                        {/* Header */}
                        <div className="flex justify-between items-center border-b border-white/10 pb-2">
                            <div className="flex items-center gap-2">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-400 ring-1 ring-emerald-500/50">
                                    {idx + 1}
                                </span>
                                <span className="text-[10px] uppercase text-emerald-400 font-bold tracking-widest">Market Leader</span>
                            </div>

                        </div>

                        <div className="text-lg font-bold text-white leading-tight">
                            {feature.properties.name}
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-1">
                            <div className="bg-white/5 p-2 rounded-lg">
                                <div className="text-[9px] text-gray-400 uppercase tracking-wider mb-1">Total Volume</div>
                                <div className="text-sm font-mono font-bold text-emerald-300">{feature.properties.label}</div>
                            </div>
                            <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                                <div className="text-[9px] text-gray-400 uppercase tracking-wider mb-1">YoY Growth</div>
                                <div className="text-sm font-mono font-bold text-white">{feature.properties.growth_txt}</div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center text-[10px] text-gray-400 pt-1 border-t border-white/5">
                            <span>Trans.: {feature.properties.transactions}</span>
                            <span>Yield: {feature.properties.yield}</span>
                        </div>

                    </div>
                </div>
            </div>
        </Marker>
    );
};

export function ChapterGeography({ isActive = true }: { isActive?: boolean }) {
    const mapRef = React.useRef<MapRef>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const { triggerHaptic } = useHaptics();

    // Data State
    const [pillarData, setPillarData] = React.useState<any>(null);
    const [storyData, setStoryData] = React.useState<any>(null);

    // Interaction
    const [hoveredPillar, setHoveredPillar] = React.useState<{ x: number, y: number, props: any } | null>(null);
    const [activeId, setActiveId] = React.useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    // Map View State
    const [viewState, setViewState] = React.useState({
        longitude: 55.27,
        latitude: 25.20,
        zoom: 10,
        pitch: 60,
        bearing: -20
    });

    // Filter Top 5 features once
    const sortedFeatures = React.useMemo(() => {
        if (!pillarData) return [];
        return pillarData.features
            .sort((a: any, b: any) => b.properties.height - a.properties.height);
    }, [pillarData]);

    const topFeatures = React.useMemo(() => sortedFeatures.slice(0, 5), [sortedFeatures]);

    // Track if we're on desktop - set after mount to avoid hydration mismatch
    const [isDesktop, setIsDesktop] = React.useState(false);

    React.useEffect(() => {
        // Set initial value
        setIsDesktop(window.innerWidth >= 768);

        // Update on resize
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    React.useEffect(() => {
        // Load Pillars
        fetch("/data/growth_pillars.json")
            .then(res => res.json())
            .then(data => {
                // Enhance data with growth-based colors
                const processedFeatures = data.features.map((f: any) => {
                    // Parse growth text (e.g., "+27.7%") to number
                    const growth = parseFloat((f.properties.growth_txt || "0").replace(/[^0-9.-]/g, ''));

                    // Logic: 
                    // > 20% = Amber (Hot/Booming)
                    // 10-20% = Emerald (High Growth)
                    // < 10% = Blue (Steady/Mature)
                    let color = "#5B93FF"; // Blue
                    if (growth >= 20) color = "#F59E0B"; // Amber
                    else if (growth >= 10) color = "#10B981"; // Emerald

                    return {
                        ...f,
                        properties: {
                            ...f.properties,
                            color: color
                        }
                    };
                });
                setPillarData({ ...data, features: processedFeatures });
            })
            .catch(err => console.error("Failed to load pillars", err));

        // Load Major Projects & Convert to GeoJSON
        fetch("/data/growth_story.json")
            .then(res => res.json())
            .then(data => {
                const geojson = {
                    type: "FeatureCollection",
                    features: (data.major_projects || []).map((p: any) => ({
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates: [p.lng, p.lat]
                        },
                        properties: {
                            name: p.name,
                            type: p.type,
                            value: p.value
                        }
                    }))
                };
                setStoryData(geojson);
            })
            .catch(err => console.error("Failed to load growth story", err));
    }, []);

    useGsap(() => {
        if (!containerRef.current) return;
        // Wipe Reveal
        gsap.fromTo(".map-reveal-mask",
            { scaleX: 1 },
            {
                scaleX: 0,
                duration: 1.0,
                ease: "power2.inOut",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 60%",
                }
            }
        );
    }, []);

    // --- Interaction ---
    const onHover = React.useCallback((event: mapboxgl.MapLayerMouseEvent) => {
        const { features, point } = event;
        const feature = features && features[0];

        if (feature && feature.layer?.id === "growth-pillars") {
            setHoveredPillar({
                x: point.x,
                y: point.y,
                props: feature.properties
            });
            if (mapRef.current) mapRef.current.getCanvas().style.cursor = 'pointer';
        } else {
            setHoveredPillar(null);
            if (mapRef.current) mapRef.current.getCanvas().style.cursor = '';
        }
    }, []);

    // --- Layers ---

    // 1. Growth Pillars (3D Extrusion)
    const pillarLayer: LayerProps = {
        id: "growth-pillars",
        type: "fill-extrusion",
        paint: {
            "fill-extrusion-color": ["get", "color"], // Use property color
            "fill-extrusion-height": ["get", "height"],
            "fill-extrusion-base": 0,
            "fill-extrusion-opacity": 0.9,
            "fill-extrusion-vertical-gradient": true
        }
    };

    // 2. Pillar Labels (Text Floating above top?)
    // Hard to float exact text above extrusion top in Mapbox pure layer without extensive work.
    // Instead we'll use a Symbol layer at the centroid, with an offset.
    // Simplified: We rely on the HOVER tooltip for details,
    // BUT we can render the Project Icons.

    const iconLayer: LayerProps = {
        id: "project-icons",
        type: "circle",
        paint: {
            "circle-radius": 6,
            "circle-color": "#FFF",
            "circle-opacity": 0,
            "circle-stroke-width": 2,
            "circle-stroke-color": "#000",
            "circle-stroke-opacity": 0
        }
    };

    const labelLayer: LayerProps = {
        id: "project-labels",
        type: "symbol",
        layout: {
            "text-field": ["get", "name"],
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 10,
            "text-offset": [0, 1.5],
            "text-anchor": "top",
            "text-transform": "uppercase",
            "text-letter-spacing": 0.1
        },
        paint: {
            "text-color": "#FFF",
            "text-halo-color": "#000",
            "text-halo-width": 2
        }
    };

    return (
        <ChapterContainer
            chapterNumber={2}
            title="Geographic Shift"
            subtitle="From core districts to new growth corridors."
            isActive={isActive}
        >
            <div ref={containerRef} className="relative w-full h-[600px] md:h-[700px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0A0A0F]">

                {/* --- LEADERBOARD OVERLAY (Left Panel) --- */}
                <div className="absolute top-4 left-4 md:top-20 md:left-6 z-30 flex flex-col gap-3 pointer-events-auto max-w-[calc(100%-2rem)] md:max-w-none w-full md:w-auto">
                    <div className="flex items-center gap-2 justify-between md:justify-start">
                        <div className="text-xs font-mono text-gray-400 uppercase tracking-widest bg-black/50 backdrop-blur-md p-2 rounded w-fit border border-white/10 shadow-lg">
                            Market Leaders (2025)
                        </div>
                        {/* Mobile Toggle Button */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            className="md:hidden p-2 rounded bg-black/50 backdrop-blur-md border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                            onClick={() => {
                                triggerHaptic("light");
                                setIsMobileMenuOpen(!isMobileMenuOpen);
                            }}
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                {isMobileMenuOpen ? (
                                    <>
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </>
                                ) : (
                                    <>
                                        <line x1="3" y1="12" x2="21" y2="12"></line>
                                        <line x1="3" y1="6" x2="21" y2="6"></line>
                                        <line x1="3" y1="18" x2="21" y2="18"></line>
                                    </>
                                )}
                            </svg>
                        </motion.button>
                    </div>

                    <AnimatePresence>
                        {(isMobileMenuOpen || isDesktop) && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className={`flex flex-col gap-2 transition-all overflow-hidden md:overflow-visible ${isMobileMenuOpen ? 'bg-black/80 backdrop-blur-xl p-2 rounded-xl border border-white/10' : ''} md:bg-transparent md:p-0 md:border-0`}
                            >
                                {topFeatures.map((feature: any, idx: number) => {
                                    const isActiveItem = activeId === feature.properties.name;
                                    return (
                                        <motion.button
                                            key={feature.properties.name}
                                            whileHover={{ scale: 1.02, x: 5 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => {
                                                triggerHaptic("selection");
                                                // Toggle: If active, close. If inactive, open.
                                                setActiveId(isActiveItem ? null : feature.properties.name);
                                            }}
                                            className={`group flex items-center gap-3 p-3 rounded-xl backdrop-blur-md border transition-all duration-300 w-full md:w-64 text-left shadow-lg
                                                ${isActiveItem
                                                    ? 'bg-emerald-900/90 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)] md:translate-x-2'
                                                    : 'bg-black/60 border-white/10 hover:bg-black/80 hover:border-white/30'
                                                }
                                            `}
                                        >
                                            <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-colors shrink-0
                                                ${isActiveItem ? 'bg-emerald-500 text-black' : 'bg-white/10 text-gray-400 group-hover:bg-white/20'}
                                            `}>
                                                0{idx + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className={`text-sm font-bold truncate ${isActiveItem ? 'text-white' : 'text-gray-300'}`}>
                                                    {feature.properties.name}
                                                </div>
                                                <div className="flex flex-col mt-1">
                                                    <div className="text-[9px] text-gray-500 uppercase tracking-wider">Total Volume</div>
                                                    <div className="text-[10px] font-mono font-bold text-emerald-400">
                                                        AED {feature.properties.label.split(' ')[1]}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status Indicator */}
                                            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActiveItem ? 'bg-emerald-400 animate-pulse' : 'bg-gray-700'}`} />
                                        </motion.button>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <Map
                    ref={mapRef}
                    cooperativeGestures={true}
                    {...viewState}
                    onMove={evt => setViewState(evt.viewState)}
                    mapStyle={MAP_STYLE}
                    mapboxAccessToken={MAPBOX_TOKEN}
                    terrain={{ source: 'mapbox-dem', exaggeration: 1.5 }}
                    pitch={60}
                    bearing={-20}
                    onClick={(e) => {
                        triggerHaptic("light");
                        const features = e.features || [];
                        const pillar = features.find(f => f.layer?.id === "growth-pillars");

                        if (pillar) {
                            triggerHaptic("selection");
                            setActiveId(pillar.properties?.name || null);
                        } else {
                            setActiveId(null);
                        }
                    }}
                    interactiveLayerIds={['growth-pillars']}
                >
                    <Source id="mapbox-dem" type="raster-dem" url="mapbox://mapbox.mapbox-terrain-dem-v1" tileSize={512} maxzoom={14} />

                    {/* Growth Pillars */}
                    {pillarData && (
                        <Source id="pillars" type="geojson" data={pillarData}>
                            <Layer {...pillarLayer} />
                            <Layer
                                id="pillar-labels"
                                type="symbol"
                                layout={{
                                    "text-field": ["get", "name"],
                                    "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                                    "text-size": 10,
                                    "text-max-width": 10,
                                    "text-offset": [0, 0],
                                    "text-anchor": "center",
                                    "text-transform": "uppercase",
                                    "text-letter-spacing": 0.05
                                }}
                                paint={{
                                    "text-color": "#ffffff",
                                    "text-halo-color": "#000000",
                                    "text-halo-width": 2,
                                    "text-opacity": 0.9
                                }}
                            />
                        </Source>
                    )}

                    {/* Major Projects - Hidden Labels/Icons as per user request to show Area names instead */}
                    <Source id="projects" type="geojson" data={storyData as any}>
                        <Layer {...iconLayer} />
                        {/* Hide Project Labels */}
                        {/* <Layer {...labelLayer} /> */}
                    </Source>

                    {/* --- HUD Markers (All) controlled by Leaderboard --- */}
                    {sortedFeatures.map((feature: any, idx: number) => (
                        <HudMarker
                            key={feature.properties.name}
                            feature={feature}
                            idx={idx}
                            isOpen={activeId === feature.properties.name}
                            onClose={() => setActiveId(activeId === feature.properties.name ? null : feature.properties.name)}
                        />
                    ))}

                </Map>

                {/* Legend */}
                <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-30 p-3 md:p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex flex-col gap-3 scale-90 md:scale-100 origin-bottom-right shadow-xl">
                    <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold border-b border-white/10 pb-2 mb-1">
                        YoY Growth Index
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-sm bg-[#F59E0B] shadow-[0_0_8px_#F59E0B]"></span>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-white">&gt; 20% Growth</span>
                            <span className="text-[9px] text-gray-400">Booming Emerging Markets</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-sm bg-[#10B981] shadow-[0_0_8px_#10B981]"></span>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-white">10% - 20%</span>
                            <span className="text-[9px] text-gray-400">High Performance</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-sm bg-[#5B93FF] shadow-[0_0_8px_#5B93FF]"></span>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-white">&lt; 10% Growth</span>
                            <span className="text-[9px] text-gray-400">Steady / Mature Markets</span>
                        </div>
                    </div>
                </div>

                {/* Wipe Mask */}
                <div
                    className="map-reveal-mask absolute inset-0 bg-[#0A0A0F] z-20 pointer-events-none"
                    style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
                />
            </div>

            {/* Footnote */}
            <div className="mt-8 pt-6 border-t border-border-subtle">
                <p className="text-[11px] text-text-quaternary/70 leading-relaxed max-w-3xl">
                    <span className="text-text-tertiary font-medium">Source:</span> Dubai Land Department (DLD) transaction records.
                    Area boundaries mapped to DLD registration zones. Volume represents total transaction value (AED) for 2025.
                    YoY growth calculated against 2024 figures. Last updated: December 31st, 2025.
                </p>
            </div>
        </ChapterContainer>
    );
}
