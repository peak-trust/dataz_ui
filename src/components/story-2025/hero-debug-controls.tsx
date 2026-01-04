"use client";

import * as React from "react";

export type TextConfig = {
    color: string;
    metalness: number;
    roughness: number;
    envMapIntensity: number;
    lightIntensity: number;
    environmentPreset: "city" | "studio" | "sunset" | "dawn" | "night" | "warehouse" | "forest" | "apartment" | "park" | "lobby";

    // Physical Material Props
    transmission: number;
    thickness: number;
    ior: number;

    // Iridescence
    iridescence: number;
    iridescenceIOR: number;
    iridescenceThickness: number;

    // Clearcoat
    clearcoat: number;
    clearcoatRoughness: number;

    // Advanced PBR (r182)
    dispersion: number;
    attenuationColor: string;
    attenuationDistance: number;
    specularIntensity: number;
    specularColor: string;
};

// Preset Definitions
const PRESETS: Record<string, Partial<TextConfig>> = {
    metal: {
        transmission: 0,
        metalness: 1.0,
        roughness: 0.2,
        color: "#ffffff",
        ior: 1.5,
        thickness: 0.5,
        iridescence: 0,
        dispersion: 0,
        specularIntensity: 1.0,
        attenuationColor: "#ffffff",
        attenuationDistance: 1.0,
    },
    glass: {
        transmission: 1.0,
        metalness: 0,
        roughness: 0,
        color: "#ffffff",
        ior: 1.5,
        thickness: 1.5,
        iridescence: 0,
        dispersion: 2.0,
        specularIntensity: 1.0,
        attenuationColor: "#ffffff",
        attenuationDistance: 2.0,
    },
    bubble: { // "Dark Bubble" / Glass Chrome
        transmission: 0.9,
        metalness: 0.4,
        roughness: 0.1,
        color: "#1a1a1a", // Dark base
        ior: 1.45,
        thickness: 1.2,
        iridescence: 1.0, // Max iridescent
        iridescenceIOR: 1.8,
        iridescenceThickness: 600,
        dispersion: 4.0, // High fire
        specularIntensity: 1.5,
        attenuationColor: "#000033", // Deep blue inside
        attenuationDistance: 0.6, // Denser
        envMapIntensity: 3.0,
    }
};

interface DebugControlsProps {
    config: TextConfig;
    onChange: (newConfig: TextConfig) => void;
    onForceRefresh?: () => void;
}

// Default Configuration
// Default Configuration
export const DEFAULT_TEXT_CONFIG: TextConfig = {
    // Finalized Settings
    color: "#4e76a2",
    metalness: 0.4,
    roughness: 0.3,
    envMapIntensity: 3,
    lightIntensity: 1.5,
    environmentPreset: "dawn",
    transmission: 0.8,
    thickness: 1.1,
    ior: 1.49,
    dispersion: 4,
    attenuationColor: "#000033",
    attenuationDistance: 0,
    iridescence: 1,
    iridescenceIOR: 2,
    iridescenceThickness: 580,
    clearcoat: 1,
    clearcoatRoughness: 0,
    specularIntensity: 1.5,
    specularColor: "#862323"
};

export function DebugControls({ config, onChange, onForceRefresh }: DebugControlsProps) {
    const handleChange = (key: keyof TextConfig, value: string | number) => {
        onChange({ ...config, [key]: value });
    };

    const applyPreset = (presetName: string) => {
        const patch = PRESETS[presetName];
        if (patch) {
            onChange({ ...config, ...patch });
        }
    };

    const [copyLabel, setCopyLabel] = React.useState("Copy Settings");

    const copyToClipboard = () => {
        const json = JSON.stringify(config, null, 4);
        navigator.clipboard.writeText(json).then(() => {
            setCopyLabel("Copied!");
            setTimeout(() => setCopyLabel("Copy Settings"), 2000);
        });
    };

    return (
        <div className="fixed top-24 right-4 z-50 p-4 bg-black/80 backdrop-blur-md rounded-lg border border-white/10 w-80 text-xs text-white shadow-2xl max-h-[80vh] overflow-y-auto overscroll-contain">
            <div className="flex justify-between items-center mb-4 gap-2">
                <h3 className="font-bold text-sm text-cyan-400 uppercase tracking-widest shrink-0">Iridescent Chrome</h3>

                <div className="flex gap-1 ml-auto">
                    <button
                        onClick={onForceRefresh}
                        className="bg-red-500/20 hover:bg-red-500/40 border border-red-500/40 rounded px-2 py-1 text-[10px] text-red-200 transition-colors whitespace-nowrap"
                    >
                        Force Set
                    </button>
                    <button
                        onClick={copyToClipboard}
                        className="bg-white/10 hover:bg-white/20 border border-white/20 rounded px-2 py-1 text-[10px] text-white transition-colors whitespace-nowrap"
                    >
                        {copyLabel}
                    </button>
                </div>
            </div>


            <div className="space-y-4">
                {/* Presets */}
                <div className="flex gap-2 pb-2 border-b border-white/10">
                    {Object.keys(PRESETS).map((preset) => (
                        <button
                            key={preset}
                            onClick={() => applyPreset(preset)}
                            className="px-2 py-1 text-[10px] uppercase tracking-wider bg-cyan-900/40 hover:bg-cyan-800/60 border border-cyan-700/50 rounded text-cyan-100 transition-colors"
                        >
                            {preset}
                        </button>
                    ))}
                </div>

                {/* Environment Preset */}
                <div className="flex flex-col gap-1">
                    <label className="text-white/60">Environment</label>
                    <select
                        value={config.environmentPreset}
                        onChange={(e) => handleChange("environmentPreset", e.target.value)}
                        className="bg-white/10 border border-white/20 rounded px-2 py-1 outline-none focus:border-cyan-500"
                    >
                        {["city", "studio", "sunset", "dawn", "night", "warehouse", "forest", "apartment", "park", "lobby"].map(p => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                </div>

                {/* Color */}
                <div className="flex flex-col gap-1">
                    <label className="text-white/60">Base Color</label>
                    <div className="flex gap-2">
                        <input
                            type="color"
                            value={config.color}
                            onChange={(e) => handleChange("color", e.target.value)}
                            className="bg-transparent border-0 w-8 h-8 p-0 cursor-pointer"
                        />
                        <input
                            type="text"
                            value={config.color}
                            onChange={(e) => handleChange("color", e.target.value)}
                            className="flex-1 bg-white/10 border border-white/20 rounded px-2 text-white/90 font-mono"
                        />
                    </div>
                </div>

                <div className="w-full h-[1px] bg-white/10 my-2" />

                {/* Core Physics */}
                <h4 className="font-bold text-white/80">Glass / Metal Physics</h4>

                {/* Transmission */}
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between">
                        <label className="text-white/60">Transmission (Glass)</label>
                        <span className="text-cyan-400 font-mono">{config.transmission.toFixed(2)}</span>
                    </div>
                    <input type="range" min="0" max="1" step="0.05" value={config.transmission} onChange={(e) => handleChange("transmission", parseFloat(e.target.value))} className="accent-cyan-500" />
                </div>

                {/* Metalness */}
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between">
                        <label className="text-white/60">Metalness</label>
                        <span className="text-cyan-400 font-mono">{config.metalness.toFixed(2)}</span>
                    </div>
                    <input type="range" min="0" max="1" step="0.05" value={config.metalness} onChange={(e) => handleChange("metalness", parseFloat(e.target.value))} className="accent-cyan-500" />
                </div>

                {/* Roughness */}
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between">
                        <label className="text-white/60">Roughness</label>
                        <span className="text-cyan-400 font-mono">{config.roughness.toFixed(2)}</span>
                    </div>
                    <input type="range" min="0" max="1" step="0.05" value={config.roughness} onChange={(e) => handleChange("roughness", parseFloat(e.target.value))} className="accent-cyan-500" />
                </div>

                {/* IOR */}
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between">
                        <label className="text-white/60">IOR (Refraction)</label>
                        <span className="text-cyan-400 font-mono">{config.ior.toFixed(2)}</span>
                    </div>
                    <input type="range" min="1" max="2.33" step="0.01" value={config.ior} onChange={(e) => handleChange("ior", parseFloat(e.target.value))} className="accent-cyan-500" />
                </div>

                {/* Thickness */}
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between">
                        <label className="text-white/60">Thickness</label>
                        <span className="text-cyan-400 font-mono">{config.thickness.toFixed(1)}</span>
                    </div>
                    <input type="range" min="0" max="5" step="0.1" value={config.thickness} onChange={(e) => handleChange("thickness", parseFloat(e.target.value))} className="accent-cyan-500" />
                </div>


                {/* Dispersion (Rainbows) */}
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between">
                        <label className="text-white/60">Dispersion (Prism)</label>
                        <span className="text-cyan-400 font-mono">{config.dispersion.toFixed(1)}</span>
                    </div>
                    <input type="range" min="0" max="10" step="0.5" value={config.dispersion} onChange={(e) => handleChange("dispersion", parseFloat(e.target.value))} className="accent-cyan-500" />
                </div>

                <div className="w-full h-[1px] bg-white/10 my-2" />

                {/* Volume Attenuation */}
                <h4 className="font-bold text-white/80">Volume <span className="text-[9px] font-normal text-white/40 ml-1">(Req. Glass &gt; 0)</span></h4>

                {/* Attenuation Color */}
                <div className="flex flex-col gap-1">
                    <label className="text-white/60">Atten. Color</label>
                    <div className="flex gap-2">
                        <input
                            type="color"
                            value={config.attenuationColor}
                            onChange={(e) => handleChange("attenuationColor", e.target.value)}
                            className="bg-transparent border-0 w-8 h-8 p-0 cursor-pointer"
                        />
                        <input
                            type="text"
                            value={config.attenuationColor}
                            onChange={(e) => handleChange("attenuationColor", e.target.value)}
                            className="flex-1 bg-white/10 border border-white/20 rounded px-2 text-white/90 font-mono"
                        />
                    </div>
                </div>

                {/* Attenuation Distance */}
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between">
                        <label className="text-white/60">Atten. Distance</label>
                        <span className="text-cyan-400 font-mono">{config.attenuationDistance.toFixed(1)}</span>
                    </div>
                    <input type="range" min="0" max="5" step="0.1" value={config.attenuationDistance} onChange={(e) => handleChange("attenuationDistance", parseFloat(e.target.value))} className="accent-cyan-500" />
                </div>


                <div className="w-full h-[1px] bg-white/10 my-2" />

                {/* Iridescence */}
                <h4 className="font-bold text-white/80">Iridescence (Surface)</h4>

                {/* Iridescence */}
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between">
                        <label className="text-white/60">Intensity</label>
                        <span className="text-cyan-400 font-mono">{config.iridescence.toFixed(2)}</span>
                    </div>
                    <input type="range" min="0" max="1" step="0.05" value={config.iridescence} onChange={(e) => handleChange("iridescence", parseFloat(e.target.value))} className="accent-cyan-500" />
                </div>

                {/* Iridescence IOR */}
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between">
                        <label className="text-white/60">Irid. IOR</label>
                        <span className="text-cyan-400 font-mono">{config.iridescenceIOR.toFixed(2)}</span>
                    </div>
                    <input type="range" min="1" max="2.5" step="0.05" value={config.iridescenceIOR} onChange={(e) => handleChange("iridescenceIOR", parseFloat(e.target.value))} className="accent-cyan-500" />
                </div>

                {/* Iridescence Thickness */}
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between">
                        <label className="text-white/60">Irid. Thickness</label>
                        <span className="text-cyan-400 font-mono">{config.iridescenceThickness}nm</span>
                    </div>
                    <input type="range" min="0" max="800" step="10" value={config.iridescenceThickness} onChange={(e) => handleChange("iridescenceThickness", parseFloat(e.target.value))} className="accent-cyan-500" />
                </div>

                <div className="w-full h-[1px] bg-white/10 my-2" />

                {/* Reflections */}
                <h4 className="font-bold text-white/80">Reflections & Specular</h4>

                {/* Clearcoat */}
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between">
                        <label className="text-white/60">Clearcoat</label>
                        <span className="text-cyan-400 font-mono">{config.clearcoat.toFixed(2)}</span>
                    </div>
                    <input type="range" min="0" max="1" step="0.05" value={config.clearcoat} onChange={(e) => handleChange("clearcoat", parseFloat(e.target.value))} className="accent-cyan-500" />
                </div>

                {/* Specular Intensity */}
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between">
                        <label className="text-white/60">Specular Intensity</label>
                        <span className="text-cyan-400 font-mono">{config.specularIntensity.toFixed(2)}</span>
                    </div>
                    <input type="range" min="0" max="2" step="0.05" value={config.specularIntensity} onChange={(e) => handleChange("specularIntensity", parseFloat(e.target.value))} className="accent-cyan-500" />
                </div>

                {/* Specular Color */}
                <div className="flex flex-col gap-1">
                    <label className="text-white/60">Specular Tint <span className="text-[9px] text-white/30 ml-1">(Reflections)</span></label>
                    <div className="flex gap-2">
                        <input
                            type="color"
                            value={config.specularColor}
                            onChange={(e) => handleChange("specularColor", e.target.value)}
                            className="bg-transparent border-0 w-8 h-8 p-0 cursor-pointer"
                        />
                        <input
                            type="text"
                            value={config.specularColor}
                            onChange={(e) => handleChange("specularColor", e.target.value)}
                            className="flex-1 bg-white/10 border border-white/20 rounded px-2 text-white/90 font-mono"
                        />
                    </div>
                </div>



                <div className="w-full h-[1px] bg-white/10 my-2" />

                {/* Lighting */}
                <h4 className="font-bold text-white/80">Scene Lighting</h4>

                <div className="flex flex-col gap-1">
                    <div className="flex justify-between">
                        <label className="text-white/60">Env Map Intensity</label>
                        <span className="text-cyan-400 font-mono">{config.envMapIntensity.toFixed(1)}</span>
                    </div>
                    <input type="range" min="0" max="10" step="0.1" value={config.envMapIntensity} onChange={(e) => handleChange("envMapIntensity", parseFloat(e.target.value))} className="accent-cyan-500" />
                </div>

                {/* Light Intensity removed duplicate, already handled by sliders above mostly, just simplified layout */}
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between">
                        <label className="text-white/60">Light Sources</label>
                        <span className="text-cyan-400 font-mono">{config.lightIntensity.toFixed(1)}</span>
                    </div>
                    <input type="range" min="0" max="10" step="0.1" value={config.lightIntensity} onChange={(e) => handleChange("lightIntensity", parseFloat(e.target.value))} className="accent-cyan-500" />
                </div>
            </div>

            <div className="mt-6 text-[10px] text-white/30 italic text-center">
                Three.js r182 Physics Enabled
            </div>
        </div>
    );
}
