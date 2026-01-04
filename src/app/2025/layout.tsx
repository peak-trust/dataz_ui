import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Dubai Real Estate Story 2025 | Visual Journey',
    description: "A visual journey through Dubai's property landscape in 2025. Explore data-driven insights, price trends, and market analysis through an immersive story.",
    openGraph: {
        title: 'Dubai Real Estate Story 2025 | Visual Journey',
        description: "A visual journey through Dubai's property landscape in 2025. Explore data-driven insights, price trends, and market analysis through an immersive story.",
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Dubai Real Estate Story 2025 | Visual Journey',
        description: "A visual journey through Dubai's property landscape in 2025. Explore data-driven insights, price trends, and market analysis through an immersive story.",
    },
    keywords: [
        "Dubai Real Estate",
        "Dubai Property Market 2025",
        "Dubai Housing Trends",
        "Dubai Off-plan Market",
        "Real Estate Analytics",
        "Dubai Neighborhoods",
        "Property Investment Dubai"
    ],
    authors: [{ name: "DataZ Team" }],
    robots: {
        index: true,
        follow: true,
    }
};

export default function Story2025Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative w-full h-full">
            {children}
        </div>
    );
}
