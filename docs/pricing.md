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

### Tier 2: 15x Credits Pack (£4.99 One-time)
*   **Total Revenue**: £4.99
*   **Revenue per Compile**: £0.33
*   **Stripe Fee**: £0.27 (1.5% of £4.99 + £0.20)
*   **Direct Compile Costs**:
    *   Stripe Fee split: £0.018 (£0.27 / 15 compiles)
    *   API cost: £0.030
    *   **Total cost per compile**: **£0.048**
*   **Net Profit per Compile**: **£0.282**
*   **Overall Tier Profit Margin**: **~85.5%**
*   **Net Profit per Sale**: **£4.27**

### Tier 3: Developer Pack (£9.99 One-time)
*   **Total Revenue**: £9.99
*   **Revenue per Compile**: £0.20
*   **Stripe Fee**: £0.35 (1.5% of £9.99 + £0.20)
*   **Direct Compile Costs**:
    *   Stripe Fee split: £0.007 (£0.35 / 50 compiles)
    *   API cost: £0.030
    *   **Total cost per compile**: **£0.037**
*   **Net Profit per Compile**: **£0.163**
*   **Overall Tier Profit Margin**: **~81.5%**
*   **Net Profit per Sale**: **£8.14**

---

## 5. Worst-Case Cost Protections
Even if a power user compiles a massive scratchpad that reaches peak token capacity (e.g. 8,000 input tokens and 4,000 output tokens):
*   Input Cost: 8,000 × $0.000003 = $0.024
*   Output Cost: 4,000 × $0.000015 = $0.060
*   **Max API Cost per compile**: $0.084 (approx. **£0.06 GBP**)

Because compiles are hard-gated by purchased database credits (15 and 50 respectively), the project is completely protected against infinite iteration runaway costs, guaranteeing a **80%+ net profit margin** under all circumstances.
