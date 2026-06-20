# SignalSignal: Real-time Portfolio Tracker

## Section 1: Product Thesis & Vision

SignalSignal aims to be the premier real-time portfolio tracking application for crypto and stock positions. In an increasingly fragmented market, investors often struggle with disparate platforms and outdated information. SignalSignal provides a unified, dynamic, and collaborative environment where users can monitor their investments with live data, engage in shared research, and make informed decisions, all within a sleek, professional interface inspired by financial terminals. The core problem it solves is the lack of a centralized, real-time, and collaborative platform for managing diverse investment portfolios.

## Section 2: Core Functional Pillars

To achieve our vision, SignalSignal will focus on the following core functional pillars:

1.  **Real-time Portfolio Tracking**: Provide up-to-the-minute data on crypto and stock positions, displaying key metrics and changes dynamically.
2.  **Collaborative Research Environment**: Facilitate shared research rooms with real-time presence and collaborative note-taking for investment analysis.
3.  **Intuitive User Interface**: Deliver a clean, high-density information display with a "true-black Bloomberg terminal" aesthetic for efficient data consumption.
4.  **Robust Supabase Integration**: Leverage Supabase for secure data storage, authentication, and especially its Realtime capabilities for live updates and collaborative features.

## Section 3: Ubiquitous Domain Vocabulary

| Human Term          | Code Property         | Context Definition                                                              |
| :------------------ | :-------------------- | :------------------------------------------------------------------------------ |
| Portfolio           | `portfolio`           | The entire collection of assets owned by a user.                                |
| Position            | `position`            | A specific holding of an asset within a portfolio (e.g., 5 BTC, 100 shares AAPL). |
| Asset               | `asset`               | Any financial instrument or currency held (e.g., Bitcoin, Apple Stock).         |
| Ticker              | `ticker`              | The symbol used to identify a security or cryptocurrency (e.g., BTC, AAPL).     |
| Quantity            | `quantity`            | The number of units of an asset held in a position.                             |
| Average Cost        | `averageCost`         | The average price paid per unit for a specific position.                        |
| Current Price       | `currentPrice`        | The latest market price of an asset.                                            |
| Profit/Loss         | `profitLoss`          | The current gain or loss on a position or the entire portfolio.                 |
| Dashboard           | `dashboard`           | The main overview screen displaying portfolio summaries and activities.         |
| Research            | `research`            | Section dedicated to collaborative analysis and notes on assets.                |
| Settings            | `settings`            | User preferences and application configuration.                                 |
| Activity            | `activity`            | A record of a transaction or event related to a user's portfolio.               |
| Realtime Presence   | `realtimePresence`    | Live indication of users active in a shared space (e.g., cursor tracking).      |
| Collaborative Notes | `collaborativeNotes`  | Shared text notes editable by multiple users in real-time.                      |

## Section 4: Context Matrix Directory Map

This section provides direct pointers to key context files for specific development concerns:

*   **Agent Constitution**: `AGENTS.md` (Global constraints, coding philosophies, tech stack declarations)
*   **CLI Runtime Executive**: `CLAUDE.md` (Safe command-line operations)
*   **Project State Roadmap**: `phases.md` (Phased development tasks and progress tracking)
*   **System North Star**: `README.md` (This file: Product vision, core pillars, domain vocabulary)