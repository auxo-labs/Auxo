# Project SignalSignal: System Overview & North Star

## 1. Product Thesis & Vision
SignalSignal is a high-density, real-time portfolio tracker and analytical canvas built for sovereign crypto and stock investors. It bridges the gap between chaotic retail trading interfaces and institutional-grade tooling, delivering split-second multi-asset portfolio visibility.

### The Core Problem It Solves:
Retail investors lose alpha because their data is fragmented across multiple exchanges, wallets, and slow, click-heavy web UIs. SignalSignal provides a unified, zero-latency "command center" layout.

---

## 2. Core Functional Pillars
To protect the product scope, the application is strictly bound to these launch execution vectors:
* **The Bloomberg Dashboard (Bento Layout):** A single-view, keyboard-navigable dashboard rendering live asset metrics, total PnL allocation charts, and historical performance tables.
* **The Research Sandbox (Shared Rooms):** Real-time collaborative workspaces utilizing transient state streams where co-investors can overlay macro charts, share text nodes, and analyze vectors simultaneously.
* **The Terminal Feed:** A high-density, monospaced HTML data stream aggregating volatile tickers and execution actions without nested pagination loops.

---

## 3. Ubiquitous Domain Vocabulary
To ensure consistent naming conventions across components and services, you must strictly adhere to this domain terminology:

| Human Term | Code Property | Context Definition |
| :--- | :--- | :--- |
| **Ticker/Symbol** | `ticker` | Standardized market identifier (e.g., `BTC`, `AAPL`). |
| **Average Fill Price** | `averagePrice` | The weighted average cost basis of an accumulated position. |
| **Current Market Value** | `totalValue` | `quantity` multiplied by the live asset `currentPrice`. |
| **Unrealized Gain/Loss** | `pnlValue` / `pnlPercent` | Net financial delta between cost basis and live valuation. |

---

## 4. Context Matrix Directory Map
For operational execution, do not dump system configs here. Navigate directly to these highly scoped files:
- **Global Developer Constraints & Constitution:** Check `./AGENTS.md`
- **Local CLI Runtime & Build Command Flags:** Check `./CLAUDE.md`
- **Target Feature Roadmaps & Phase Checklists:** Check `./docs/phases.md`
- **System Overview & North Star:** Check `./README.md`
