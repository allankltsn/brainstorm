# Financial model: <product>
Date: <UTC> | Currency: <...> | Horizon: <12 to 24 months> | Status: draft / reviewed by <instance>

## Assumptions
| # | Assumption | Value | Type (data / reference / estimate) | Source and date |
## Revenue and pricing
<plans, price, billing period, discounts, payment-provider fees, justification against alternatives>
## Unit economics
| Indicator | Formula | Value |
| ARPU | monthly revenue / active customers | |
| Gross margin | (revenue - variable cost) / revenue | |
| Monthly churn | customers lost in month / customers at start | |
| Lifetime (months, capped at <n>) | 1 / monthly churn | |
| LTV | ARPU x gross margin x lifetime | |
| CAC | acquisition spend / new customers | |
| LTV / CAC | | |
| CAC payback (months) | CAC / (ARPU x gross margin) | |
## Monthly costs
| Item | Fixed or variable | Value | Basis |
## Projection
| Month | Customers | Revenue | Cost | Result | Cumulative cash |
<pessimistic, base and optimistic; state which assumptions differ>
## Break-even and runway
Customers to break even = fixed cost / (ARPU x gross margin). Runway = cash / monthly burn.
## Sensitivity
| Assumption | Variation | Effect on break-even | Effect on cash at 12 months |
## Risks and recommendation
<proceed / adjust (what) / stop; what to validate first>
[ACCOUNTING-REVIEW] items: <tax regime, invoicing, statutory obligations>
