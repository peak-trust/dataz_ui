"use client";

import * as React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text3D, Center, Float, Environment } from "@react-three/drei";
import * as THREE from "three";
import { DebugControls, TextConfig } from "./hero-debug-controls";

interface Text3DHeroProps {
    className?: string;
    config: TextConfig;
    onReady?: () => void;
}

import { useGsap, easingPresets } from "@/lib/hooks/useGsap";

interface Dubai2025TextProps {
    config: TextConfig;
    onReady?: () => void;
}

function Dubai2025Text({ config, onReady }: Dubai2025TextProps) {
    const textRef = React.useRef<THREE.Group>(null);
    const matRef1 = React.useRef<THREE.MeshPhysicalMaterial>(null);
    const matRef2 = React.useRef<THREE.MeshPhysicalMaterial>(null);

    // GSAP Intro Animation
    useGsap((gsap) => {
        if (textRef.current) {
            // Signal readiness immediately after mount since R3F suspends for assets
            if (onReady) onReady();

            gsap.from(textRef.current.scale, {
                x: 0,
                y: 0,
                z: 0,
                duration: 2,
                ease: easingPresets.smooth,
                delay: 0.2
            });
            gsap.from(textRef.current.rotation, {
                y: Math.PI / 4,
                duration: 2.5,
                ease: "power3.out",
                delay: 0.2
            });
        }
    }, []);

    useFrame((state) => {
        if (textRef.current) {
            // 1. Floating Animation (Sine wave)
            const floatY = Math.sin(state.clock.elapsedTime * 0.4) * 0.03;
            const floatX = Math.sin(state.clock.elapsedTime * 0.3) * 0.01;

            // 2. Mouse Interaction (Tilt towards cursor)
            // Smoothly interpolate current rotation to target rotation based on mouse position
            const targetRotX = (state.pointer.y * -0.15); // Tilt up/down
            const targetRotY = (state.pointer.x * 0.15);  // Tilt left/right

            // Apply smooth transition (lerp)
            // We mix the float rotation with the mouse rotation
            textRef.current.rotation.x = THREE.MathUtils.lerp(
                textRef.current.rotation.x,
                targetRotX + floatY,
                0.05 // Smoothing factor (lower = smoother/slower)
            );

            textRef.current.rotation.y = THREE.MathUtils.lerp(
                textRef.current.rotation.y,
                targetRotY + floatX,
                0.05
            );
        }
    });

    // Imperatively update colors to ensure stability
    React.useLayoutEffect(() => {
        const updateMaterial = (mat: THREE.MeshPhysicalMaterial | null) => {
            if (mat) {
                mat.color.set(config.color);
                mat.attenuationColor.set(config.attenuationColor);
                mat.specularColor.set(config.specularColor);
            }
        };
        updateMaterial(matRef1.current);
        updateMaterial(matRef2.current);
    }, [config.color, config.attenuationColor, config.specularColor]);

    // Heuristic: If Attenuation is Pure White (#ffffff), the user likely wants "White Glass/Cloud" 
    // rather than "Invisible Clear Glass". In this case, we clamp transmission to show the Base Color.
    const isWhiteAttenuation = config.attenuationColor.toLowerCase() === "#ffffff";
    const effectiveTransmission = (isWhiteAttenuation && config.transmission > 0.2)
        ? 0.2
        : config.transmission;

    // Use strings for colors directly where possible, R3F handles conversion.
    // For arrays or ranges, ensure they are stable or just pass them.

    return (
        <group ref={textRef}>
            <Center>
                <Float
                    speed={2}
                    rotationIntensity={0.1}
                    floatIntensity={0.3}
                    floatingRange={[-0.05, 0.05]}
                >
                    {/* Main "DUBAI" text */}
                    <Text3D
                        font="/fonts/inter-bold.json"
                        size={1}
                        height={0.3}
                        curveSegments={12}
                        bevelEnabled
                        bevelThickness={0.03}
                        bevelSize={0.02}
                        bevelOffset={0}
                        bevelSegments={5}
                        position={[-2.8, 0.6, 0]}
                    >
                        DUBAI
                        <meshPhysicalMaterial
                            ref={matRef1}
                            color={config.color}
                            metalness={config.metalness}
                            roughness={config.roughness}
                            envMapIntensity={config.envMapIntensity}

                            // Glass / Transmission properties
                            transmission={effectiveTransmission}
                            thickness={config.thickness}
                            ior={config.ior}
                            dispersion={config.dispersion}

                            // Volume Attenuation
                            attenuationColor={config.attenuationColor}
                            attenuationDistance={config.attenuationDistance}

                            // Iridescence (Rainbow effect)
                            iridescence={config.iridescence}
                            iridescenceIOR={config.iridescenceIOR}
                            iridescenceThicknessRange={[0, config.iridescenceThickness]}

                            // Clearcoat & Specular
                            clearcoat={config.clearcoat}
                            clearcoatRoughness={config.clearcoatRoughness}
                            specularIntensity={config.specularIntensity}
                            specularColor={config.specularColor}
                        />
                    </Text3D>

                    {/* "2025" text */}
                    <Text3D
                        font="/fonts/inter-bold.json"
                        size={1}
                        height={0.3}
                        curveSegments={12}
                        bevelEnabled
                        bevelThickness={0.03}
                        bevelSize={0.02}
                        bevelOffset={0}
                        bevelSegments={5}
                        position={[-2.2, -0.8, 0]}
                    >
                        2025
                        <meshPhysicalMaterial
                            ref={matRef2}
                            color={config.color}
                            metalness={config.metalness}
                            roughness={config.roughness}
                            envMapIntensity={config.envMapIntensity}

                            // Inherit physical props
                            transmission={effectiveTransmission}
                            thickness={config.thickness}
                            ior={config.ior}
                            dispersion={config.dispersion}

                            attenuationColor={config.attenuationColor}
                            attenuationDistance={config.attenuationDistance}

                            iridescence={config.iridescence}
                            iridescenceIOR={config.iridescenceIOR}
                            iridescenceThicknessRange={[0, config.iridescenceThickness]}

                            clearcoat={config.clearcoat}
                            clearcoatRoughness={config.clearcoatRoughness}
                            specularIntensity={config.specularIntensity}
                            specularColor={config.specularColor}
                        />
                    </Text3D>
                </Float>
            </Center>
        </group>
    );
}

export function Text3DHero({ className, config, onReady }: Text3DHeroProps) {
    return (
        <div className={className} style={{ width: "100%", height: "100%" }}>

            <Canvas
                camera={{ position: [0, 0, 6], fov: 50 }}
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: true }}
                style={{ background: "transparent" }}
            >
                {/* Dynamic lighting */}
                <ambientLight intensity={config.lightIntensity * 0.4} />
                <directionalLight position={[10, 10, 5]} intensity={config.lightIntensity} color="#ffffff" />
                <directionalLight position={[-10, -5, -5]} intensity={config.lightIntensity * 0.5} color="#f1f5f9" />
                <pointLight position={[0, 5, 5]} intensity={config.lightIntensity * 0.6} color="#ffffff" />
                <pointLight position={[-5, -5, 3]} intensity={config.lightIntensity * 0.3} color="#e2e8f0" />

                {/* Dynamic Environment */}
                <Environment preset={config.environmentPreset} />

                {/* 3D Text with dynamic props */}
                <React.Suspense fallback={null}>
                    <Dubai2025Text config={config} onReady={onReady} />
                </React.Suspense>
            </Canvas>
        </div>
    );
}
