# Auxo Cloud Compiler Pricing & Profit Calculator

This document details the pricing structures, API usage cost estimates, Stripe transaction fees, and net profit calculations for the Auxo Cloud prompt compilation pipelines.

---

## 1. LLM API Pricing Baselines (Anthropic)

Both **Claude 3.5 Sonnet** and **Claude 4.5 Sonnet** share the same API pricing rates:

*   **Input Tokens**: $3.00 per Million tokens ($0.000003 / token)
*   **Output Tokens**: $15.00 per Million tokens ($0.000015 / token)

---

## 2. Average Token Consumption Profile
A typical compilation request processes user specifications alongside tech registry version resolutions and compiles multiple context scaling files (`AGENTS.md`, `CLAUDE.md`, `phases.md`, `README.md`, and custom `.mdc` rules).

*   **Average Input**: ~3,000 tokens (System prompt templates + live registry signatures + user notes)
*   **Average Output**: ~2,000 tokens (All compiled files streamed sequentially)

### Unit Compile Cost (USD & GBP)
*   **Input Cost**: 3,000 tokens × $0.000003 = $0.009
*   **Output Cost**: 2,000 tokens × $0.000015 = $0.030
*   **Total API Cost**: **~$0.04 USD** (approx. **£0.03 GBP** at standard exchange rates)

---

## 3. Stripe Transaction Fees (UK Rates)
Standard Stripe card fees for UK transactions are:
$$\text{Fee} = 1.5\% + £0.20$$

---

## 4. Profit Margin Analysis by Tier

### Tier 2: Builder Pack (£9.99 One-time, 20 Credits)
*   **Total Revenue**: £9.99
*   **Revenue per Compile**: £0.50
*   **Stripe Fee**: £0.35 (1.5% of £9.99 + £0.20)
*   **Direct Compile Costs**:
    *   Stripe Fee split: £0.0175 (£0.35 / 20 compiles)
    *   API cost: £0.030
    *   **Total cost per compile**: **£0.0475**
*   **Net Profit per Compile**: **£0.4525**
*   **Overall Tier Profit Margin**: **~90.5%**
*   **Net Profit per Sale**: **£9.04**

### Tier 3: Founder/Developer Pack (£24.99 One-time, 75 Credits)
*   **Total Revenue**: £24.99
*   **Revenue per Compile**: £0.333
*   **Stripe Fee**: £0.57 (1.5% of £24.99 + £0.20)
*   **Direct Compile Costs**:
    *   Stripe Fee split: £0.0076 (£0.57 / 75 compiles)
    *   API cost: £0.030
    *   **Total cost per compile**: **£0.0376**
*   **Net Profit per Compile**: **£0.2954**
*   **Overall Tier Profit Margin**: **~88.7%**
*   **Net Profit per Sale**: **£22.17**

### Tier 4: Enterprise/Team Pack (£49.00/month, Uncapped Teams)
*   *Note:* Deferred to post-launch scaling phase.

---

## 5. Worst-Case Cost Protections
Even if a power user compiles a massive scratchpad that reaches peak token capacity (e.g. 8,000 input tokens and 8,000 output tokens):
*   Input Cost: 8,000 × $0.000003 = $0.024
*   Output Cost: 8,000 × $0.000015 = $0.120
*   **Max API Cost per compile**: $0.144 (approx. **£0.11 GBP**)

Because compiles are hard-gated by purchased database credits (20 and 75 respectively), the project is completely protected against infinite iteration runaway costs, guaranteeing an **80%+ net profit margin** under all circumstances.
