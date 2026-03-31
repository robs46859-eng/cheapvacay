# CheapVacay India Launch Checklist

## Product

- Replace or validate each destination image URL so launch assets are stable.
- Decide whether launch messaging is "trip planner" or "cheap India vacations" and keep that language consistent across landing copy.
- Add 5 to 10 more India destinations so the homepage feels intentional instead of demo-sized.

## Trust

- Add a short disclaimer that estimates are planning aids, not live booking quotes.
- Add contact/support information before public launch.
- Decide whether saved trips remaining local-only is acceptable for the first beta.

## Engineering

- Set `GEMINI_API_KEY` in the deployment environment.
- Add basic analytics for planner starts, route generation, trip saves, and assistant usage.
- Add one smoke test path for homepage -> planner -> save trip.
- If bundle size matters, split the assistant into a lazy-loaded chunk.

## Distribution

- Ship a simple landing message on Product Hunt, Reddit travel communities, or India budget travel groups.
- Recruit 10 to 20 beta users and ask them to plan a real trip, not a hypothetical one.
- Track where estimates feel wrong and prioritize live data integrations only after repeated demand.

## First Post-Launch Features

- Account-based saved trips
- Real hotel and rail or bus data sources
- Sharable itineraries
- Email capture and follow-up reminders
