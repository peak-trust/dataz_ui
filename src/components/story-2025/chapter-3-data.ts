export const chapter3Data = {
    "stories": [
        {
            "id": "premium-threshold",
            "title": "The Premium Threshold",
            "stats": {
                "main": "AED 2,918/sqft",
                "sub": "Downtown Dubai"
            },
            "description": [
                "Downtown Dubai commands AED 2,918/sqft.",
                "+52% growth over 3 years."
            ],
            "keyFindings": [
                "3-year growth (Q1 2022 to Q4 2025): +52%",
                "Premium over citywide average: 62%",
                "Total transactions (2022-2025): 28,761"
            ],
            "citation": "Calculated from DLD transactions. Price per sqft = transaction value / property area. Source: Downtown Dubai (Burj Khalifa) area in DLD data.",
            "area": "Downtown Dubai",
            "chartType": "trend",
            "trendColor": "emerald",
            "data": [
                { "quarter": "Q1 22", "value": 1923, "contextValue": 1325, "volume": 1386 },
                { "quarter": "Q2 22", "value": 2212, "contextValue": 1365, "volume": 2186 },
                { "quarter": "Q3 22", "value": 1977, "contextValue": 1337, "volume": 1931 },
                { "quarter": "Q4 22", "value": 2101, "contextValue": 1678, "volume": 1407 },
                { "quarter": "Q1 23", "value": 2272, "contextValue": 1465, "volume": 1584 },
                { "quarter": "Q2 23", "value": 2146, "contextValue": 1523, "volume": 1930 },
                { "quarter": "Q3 23", "value": 2090, "contextValue": 1525, "volume": 1757 },
                { "quarter": "Q4 23", "value": 2313, "contextValue": 1552, "volume": 2239 },
                { "quarter": "Q1 24", "value": 2392, "contextValue": 1758, "volume": 1822 },
                { "quarter": "Q2 24", "value": 2278, "contextValue": 1626, "volume": 1612 },
                { "quarter": "Q3 24", "value": 2340, "contextValue": 1594, "volume": 1986 },
                { "quarter": "Q4 24", "value": 2402, "contextValue": 1662, "volume": 1822 },
                { "quarter": "Q1 25", "value": 2589, "contextValue": 1663, "volume": 1798 },
                { "quarter": "Q2 25", "value": 2375, "contextValue": 1761, "volume": 1871 },
                { "quarter": "Q3 25", "value": 2464, "contextValue": 1784, "volume": 1546 },
                { "quarter": "Q4 25", "value": 2918, "contextValue": 1806, "volume": 1884, "milestone": "Peak: 2,918" }
            ],
            "series": [
                { "id": "Downtown Dubai", "key": "value", "color": "emerald" },
                { "id": "City Average", "key": "contextValue", "color": "gray" }
            ]
        },
        {
            "id": "affordable-surge",
            "title": "The Affordable Surge",
            "stats": {
                "main": "+136%",
                "sub": "Still 36% Below Premium"
            },
            "description": [
                "Jabal Ali surged 136% over 3 years.",
                "Yet remains 36% below Downtown prices."
            ],
            "keyFindings": [
                "Q1 2022: 59% below Downtown → Q4 2025: still 36% below",
                "Price: 793 → 1,874 AED/sqft (+136% growth)",
                "Best value appreciation while staying affordable"
            ],
            "citation": "Calculated from DLD transactions. Discount = (Downtown - Jabal Ali) / Downtown. Source: Jabal Ali First and Burj Khalifa areas in DLD data.",
            "area": "Jabal Ali vs Downtown",
            "chartType": "comparison",
            "trendColor": "blue",
            "data": [
                { "quarter": "Q1 22", "value": 793, "compareValue": 1923, "volume": 1121, "milestone": "59% below Downtown" },
                { "quarter": "Q2 22", "value": 815, "compareValue": 2212, "volume": 954 },
                { "quarter": "Q3 22", "value": 886, "compareValue": 1977, "volume": 1431 },
                { "quarter": "Q4 22", "value": 1011, "compareValue": 2101, "volume": 1660 },
                { "quarter": "Q1 23", "value": 962, "compareValue": 2272, "volume": 1080 },
                { "quarter": "Q2 23", "value": 942, "compareValue": 2146, "volume": 1181 },
                { "quarter": "Q3 23", "value": 878, "compareValue": 2090, "volume": 1522 },
                { "quarter": "Q4 23", "value": 1113, "compareValue": 2313, "volume": 1356 },
                { "quarter": "Q1 24", "value": 1105, "compareValue": 2392, "volume": 1464 },
                { "quarter": "Q2 24", "value": 1124, "compareValue": 2278, "volume": 1671 },
                { "quarter": "Q3 24", "value": 1091, "compareValue": 2340, "volume": 2673 },
                { "quarter": "Q4 24", "value": 1242, "compareValue": 2402, "volume": 2187 },
                { "quarter": "Q1 25", "value": 1228, "compareValue": 2589, "volume": 2135 },
                { "quarter": "Q2 25", "value": 1290, "compareValue": 2375, "volume": 2134 },
                { "quarter": "Q3 25", "value": 1665, "compareValue": 2464, "volume": 2677 },
                { "quarter": "Q4 25", "value": 1874, "compareValue": 2918, "volume": 2572, "milestone": "Still 36% below" }
            ],
            "series": [
                { "id": "Jabal Ali", "key": "value", "color": "blue" },
                { "id": "Downtown Dubai", "key": "compareValue", "color": "emerald" }
            ]
        },
        {
            "id": "marina-adjustment",
            "title": "The Great Convergence",
            "stats": {
                "main": "48% → 4%",
                "sub": "Premium Collapsed"
            },
            "description": [
                "Marina's premium over JLT collapsed from 48% to 4%.",
                "JLT briefly overtook Marina in Q3 2024."
            ],
            "keyFindings": [
                "Q2 2023: Marina 48% premium over JLT",
                "Q3 2024: JLT overtakes Marina by 286 AED/sqft",
                "Q4 2025: Near parity - only 86 AED/sqft difference"
            ],
            "citation": "Calculated from DLD transactions. Both are high-rise tower markets with similar buyer profiles. Gap = Marina - JLT. Source: Marsa Dubai and Al Khairan First (JLT) areas in DLD data.",
            "area": "Dubai Marina vs JLT",
            "chartType": "convergence",
            "trendColor": "amber",
            "data": [
                { "quarter": "Q1 22", "value": 2249, "compareValue": 1758, "volume": 3002 },
                { "quarter": "Q2 22", "value": 2081, "compareValue": 1757, "volume": 3388 },
                { "quarter": "Q3 22", "value": 2054, "compareValue": 1739, "volume": 3459 },
                { "quarter": "Q4 22", "value": 2342, "compareValue": 1747, "volume": 3897 },
                { "quarter": "Q1 23", "value": 2590, "compareValue": 1958, "volume": 4628 },
                { "quarter": "Q2 23", "value": 2936, "compareValue": 1979, "volume": 5185, "milestone": "Peak gap: 48%" },
                { "quarter": "Q3 23", "value": 2934, "compareValue": 2083, "volume": 4068 },
                { "quarter": "Q4 23", "value": 2790, "compareValue": 1964, "volume": 3463 },
                { "quarter": "Q1 24", "value": 2788, "compareValue": 2110, "volume": 3228 },
                { "quarter": "Q2 24", "value": 2432, "compareValue": 2191, "volume": 3768 },
                { "quarter": "Q3 24", "value": 2232, "compareValue": 2518, "volume": 4747, "milestone": "JLT overtakes!" },
                { "quarter": "Q4 24", "value": 2465, "compareValue": 2346, "volume": 4088 },
                { "quarter": "Q1 25", "value": 2843, "compareValue": 2171, "volume": 4161 },
                { "quarter": "Q2 25", "value": 3030, "compareValue": 2264, "volume": 4563 },
                { "quarter": "Q3 25", "value": 2567, "compareValue": 2257, "volume": 3568 },
                { "quarter": "Q4 25", "value": 2436, "compareValue": 2350, "volume": 3167, "milestone": "Near parity: 4%" }
            ],
            "series": [
                { "id": "Dubai Marina", "key": "value", "color": "amber" },
                { "id": "JLT", "key": "compareValue", "color": "cyan" }
            ]
        },
        {
            "id": "volume-king",
            "title": "The Volume King",
            "stats": {
                "main": "66,147",
                "sub": "Transactions (2.3x Downtown)"
            },
            "description": [
                "JVC leads Dubai in transaction volume.",
                "2.3x more deals than Downtown in 3 years."
            ],
            "keyFindings": [
                "JVC total: 66,147 vs Downtown: 28,761 transactions",
                "Q4 2024 peak: 6,108 vs 1,822 (3.4x gap)",
                "Volume grew 254% while Downtown stayed flat"
            ],
            "citation": "Calculated from DLD transactions. JVC (Al Barsha South Fourth) leads in volume due to affordable entry prices. Source: Al Barsha South Fourth and Burj Khalifa areas in DLD data.",
            "area": "JVC vs Downtown",
            "chartType": "volume",
            "trendColor": "sky",
            "data": [
                { "quarter": "Q1 22", "value": 1466, "compareValue": 1386, "price": 1097 },
                { "quarter": "Q2 22", "value": 1443, "compareValue": 2186, "price": 915 },
                { "quarter": "Q3 22", "value": 1875, "compareValue": 1931, "price": 941 },
                { "quarter": "Q4 22", "value": 2470, "compareValue": 1407, "price": 926, "milestone": "JVC takes lead" },
                { "quarter": "Q1 23", "value": 3587, "compareValue": 1584, "price": 1453 },
                { "quarter": "Q2 23", "value": 3603, "compareValue": 1930, "price": 1056 },
                { "quarter": "Q3 23", "value": 4047, "compareValue": 1757, "price": 1351 },
                { "quarter": "Q4 23", "value": 4640, "compareValue": 2239, "price": 1202 },
                { "quarter": "Q1 24", "value": 4710, "compareValue": 1822, "price": 1210 },
                { "quarter": "Q2 24", "value": 4830, "compareValue": 1612, "price": 1235 },
                { "quarter": "Q3 24", "value": 5201, "compareValue": 1986, "price": 1291 },
                { "quarter": "Q4 24", "value": 6108, "compareValue": 1822, "price": 1339, "milestone": "Peak: 6,108 (3.4x)" },
                { "quarter": "Q1 25", "value": 4374, "compareValue": 1798, "price": 1349 },
                { "quarter": "Q2 25", "value": 6091, "compareValue": 1871, "price": 1411 },
                { "quarter": "Q3 25", "value": 6512, "compareValue": 1546, "price": 1431, "milestone": "Volume peak: 6,512" },
                { "quarter": "Q4 25", "value": 5190, "compareValue": 1884, "price": 1527 }
            ],
            "series": [
                { "id": "JVC Transactions", "key": "value", "color": "sky" },
                { "id": "Downtown Transactions", "key": "compareValue", "color": "emerald" }
            ]
        },
        {
            "id": "expo-effect",
            "title": "The Expo Effect",
            "stats": {
                "main": "53% → 18%",
                "sub": "Gap Closed"
            },
            "description": [
                "Dubai South started 53% below city average.",
                "Expo 2020 closed the gap to just 18%."
            ],
            "keyFindings": [
                "Q1 2022: 53% below average → Q4 2025: only 18% below",
                "Price surge: AED 615 → 1,475/sqft (+140%)",
                "Volume exploded: 378 → 2,893 transactions/quarter"
            ],
            "citation": "Calculated from DLD transactions. Dubai South (Madinat Al Mataar) benefited from Expo 2020 infrastructure and Al Maktoum Airport expansion. City Average = weighted avg across all areas. Source: Madinat Al Mataar area in DLD data.",
            "area": "Dubai South",
            "chartType": "trend",
            "trendColor": "orange",
            "data": [
                { "quarter": "Q1 22", "value": 615, "contextValue": 1325, "volume": 378, "milestone": "53% below average" },
                { "quarter": "Q2 22", "value": 581, "contextValue": 1365, "volume": 658 },
                { "quarter": "Q3 22", "value": 655, "contextValue": 1337, "volume": 776 },
                { "quarter": "Q4 22", "value": 734, "contextValue": 1678, "volume": 544 },
                { "quarter": "Q1 23", "value": 734, "contextValue": 1465, "volume": 389 },
                { "quarter": "Q2 23", "value": 753, "contextValue": 1523, "volume": 509 },
                { "quarter": "Q3 23", "value": 956, "contextValue": 1525, "volume": 1315 },
                { "quarter": "Q4 23", "value": 1106, "contextValue": 1552, "volume": 1370 },
                { "quarter": "Q1 24", "value": 1173, "contextValue": 1758, "volume": 1252 },
                { "quarter": "Q2 24", "value": 1184, "contextValue": 1626, "volume": 1373 },
                { "quarter": "Q3 24", "value": 1243, "contextValue": 1594, "volume": 3322, "milestone": "Volume peak" },
                { "quarter": "Q4 24", "value": 1444, "contextValue": 1662, "volume": 2934 },
                { "quarter": "Q1 25", "value": 1626, "contextValue": 1663, "volume": 2964, "milestone": "Nearly catches up!" },
                { "quarter": "Q2 25", "value": 1537, "contextValue": 1761, "volume": 2604 },
                { "quarter": "Q3 25", "value": 1399, "contextValue": 1784, "volume": 2886 },
                { "quarter": "Q4 25", "value": 1475, "contextValue": 1806, "volume": 2893, "milestone": "Gap: 18%" }
            ],
            "series": [
                { "id": "Dubai South", "key": "value", "color": "orange" },
                { "id": "City Average", "key": "contextValue", "color": "gray" }
            ]
        },
        {
            "id": "bedroom-distribution",
            "title": "The 1BR Dominance",
            "stats": {
                "main": "6% → 17%",
                "sub": "Gap Over 2BR"
            },
            "description": [
                "1BR grew from 32% to 40% market share.",
                "2BR declined from 26% to 23% - gap widened to 17%."
            ],
            "keyFindings": [
                "1BR: 32% → 40% (+8 pts), 2BR: 26% → 23% (-3 pts)",
                "Gap widened: Q1 2022 (6%) → Q4 2025 (17%)",
                "Total transactions (2022-2025): 628,459"
            ],
            "citation": "Calculated from DLD transactions. Distribution = room_type_count / total_count. Source: rooms_en field. 4BR+ aggregated.",
            "area": "Citywide",
            "chartType": "distribution",
            "trendColor": "rose",
            "distribution": [
                { "label": "Studio", "value": 19 },
                { "label": "1BR", "value": 38 },
                { "label": "2BR", "value": 25 },
                { "label": "3BR", "value": 13 },
                { "label": "4BR+", "value": 6 }
            ],
            "data": [
                { "quarter": "Q1 22", "value": 32, "compareValue": 26, "volume": 19147, "milestone": "Gap: 6%" },
                { "quarter": "Q2 22", "value": 35, "compareValue": 27, "volume": 21257 },
                { "quarter": "Q3 22", "value": 35, "compareValue": 27, "volume": 24956 },
                { "quarter": "Q4 22", "value": 38, "compareValue": 27, "volume": 28834 },
                { "quarter": "Q1 23", "value": 37, "compareValue": 25, "volume": 31907 },
                { "quarter": "Q2 23", "value": 37, "compareValue": 25, "volume": 31158 },
                { "quarter": "Q3 23", "value": 36, "compareValue": 25, "volume": 36793 },
                { "quarter": "Q4 23", "value": 38, "compareValue": 26, "volume": 36496 },
                { "quarter": "Q1 24", "value": 39, "compareValue": 25, "volume": 39058 },
                { "quarter": "Q2 24", "value": 38, "compareValue": 26, "volume": 45367 },
                { "quarter": "Q3 24", "value": 38, "compareValue": 26, "volume": 54035 },
                { "quarter": "Q4 24", "value": 40, "compareValue": 24, "volume": 54402 },
                { "quarter": "Q1 25", "value": 37, "compareValue": 25, "volume": 46293 },
                { "quarter": "Q2 25", "value": 39, "compareValue": 25, "volume": 54194 },
                { "quarter": "Q3 25", "value": 43, "compareValue": 23, "volume": 62304, "milestone": "Peak gap: 20%" },
                { "quarter": "Q4 25", "value": 40, "compareValue": 23, "volume": 57877, "milestone": "Gap: 17%" }
            ],
            "series": [
                { "id": "1BR Share (%)", "key": "value", "color": "rose" },
                { "id": "2BR Share (%)", "key": "compareValue", "color": "violet" }
            ]
        }
    ],
    "_metadata": {
        "dataSource": "Dubai Land Department (DLD) via data.gov.ae",
        "period": "January 2022 - December 2025 (3 years)",
        "generatedAt": "2025-01-03",
        "priceUnit": "AED per square foot",
        "dataGranularity": "Quarterly aggregation (16 data points per story)",
        "conversionNote": "Raw data in AED/sqm converted to AED/sqft (divided by 10.764)",
        "areaMapping": {
            "Downtown Dubai": "Burj Khalifa",
            "Dubai Marina": "Marsa Dubai",
            "Dubai Hills Estate": "Hadaeq Sheikh Mohammed Bin Rashid",
            "Jabal Ali": "Jabal Ali First",
            "Palm Jumeirah": "Palm Jumeirah",
            "Mirdif": "Mirdif",
            "Business Bay": "Business Bay",
            "JVC": "Al Barsha South Fourth",
            "Dubai South": "Madinat Al Mataar",
            "JLT": "Al Khairan First"
        },
        "calculationExamples": {
            "3YearGrowth": "Example: Downtown = (Q4 2025: 2,918 - Q1 2022: 1,923) / 1,923 = +52%",
            "Premium": "Example: Off-plan premium = (2,102 - 1,654) / 1,654 = +27%",
            "PricePerSqft": "Example: 31,436 AED/sqm / 10.764 = 2,918 AED/sqft",
            "MarketShare": "Example: 1BR = 72,850 units / 188,895 total = 39%"
        }
    }
};
