# # Global Firearm Dynamics: Laws, Poverty, and the Cycle of Violence

## Project Overview
This three-month research and development project investigates the complex correlation between firearm legislation strictness, socio-economic factors, and violence rates across global regions. Moving beyond broad national statistics, this project utilizes city-level "microscopes" to examine how variables like poverty, gang activity, and gun availability intersect to influence safety—especially among youth populations.

---

## Core Hypotheses & Research Areas
1. **The Ownership Risk Paradox**: Investigating data that suggests individuals in possession of a gun may be over 4 times more likely to be shot in an assault than those without.
2. **Legislative Impact vs. Socio-Economic Realities**: Comparing "Strict" regions that still face high violence (e.g., Mexico, Jamaica) against those with low rates (e.g., Japan, UK) to isolate the impact of poverty and illegal trafficking.
3. **Youth & Gang Dynamics**: Analyzing how gun availability drives recruitment and lethality in urban gang conflicts, and how exposure to this violence stunts educational and psychological development.

---

## Implementation Roadmap (3 Months)

### Month 1: Data Architecture & ETL
* **Global Normalization**: Standardizing disparate datasets from the UNODC, WHO, and the Gun Violence Archive to create a unified per capita comparison.
* **City-Level Selection**: Identifying key urban centers (e.g., Chicago, London, Rio de Janeiro, Tokyo) for deep-dive analysis into neighborhood poverty rates.
* **Policy Scoring**: Developing a "Strictness Index" to quantify national and local gun control measures (e.g., background checks, waiting periods, bans).

### Month 2: Interaction Design & Frontend Development
* **Interactive World Map**: A MapLibre-powered interface allowing users to toggle between gun law strictness and violence outcomes.
* **City Microscope**: A "drill-down" feature where clicking a city reveals a scatter plot correlating local poverty levels with shooting incidents.
* **The Risk Model**: A predictive tool based on historical data that simulates the probability of firearm incidents based on local ownership rates and law types.

### Month 3: Narrative Integration & Deployment
* **Causal Filtering**: Adding UI toggles to filter "Observed Violence" by type (e.g., gang-related vs. domestic vs. suicide).
* **Performance Optimization**: Minimizing GeoJSON payloads and optimizing 3D visualizations for the Netlify environment.
* **Final Netlify Launch**: Establishing a CI/CD pipeline to ensure the hosted site updates automatically as the data backend refreshes.

---

## Technical Stack
* **Frontend/Hosting**: React (Next.js) hosted on **Netlify**.
* **Visualizations**: **D3.js** for complex statistical charts and **MapLibre GL** for geospatial rendering.
* **Backend**: **FastAPI (Python)** for data processing; **Pandas** for causal analysis.
* **Data Sources**: UNODC Homicide Statistics, Institute for Health Metrics and Evaluation (IHME), and Everytown Research.

---

## Meaningful Interactions
* **The "What-If" Force Toggle**: Users can "switch off" or reduce a city's poverty rate in the model to see the projected impact on firearm violence based on regional trends.
* **Legislative Timeline**: A scrubbing tool to visualize the immediate and long-term changes in violence rates following major law changes (e.g., Australia’s 1996 National Firearms Agreement).
* **Exposure Visualization**: An interactive "Heat Map" showing where children are most at risk of witnessing or being victims of gun violence in their own homes.

---

## Academic & Social Value
This project serves as a transparency tool for policymakers and researchers by:
* **Isolating Root Causes**: Distinguishing between violence driven by legislation and violence driven by systemic poverty.
* **Debunking Myths**: Providing a data-driven look at whether carrying a firearm actually enhances personal safety in urban environments.
