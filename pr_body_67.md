Implements interactive bill tracking for DebtPipe as requested in Issue #67.

**Features:**
- Checkboxes to mark bills paid per month
- Custom payment amounts for partial payments
- Dynamic timeline recalculation with carry-forward of remaining balances
- localStorage persistence (debtBills, debtPayments, debtCustomPayments)
- PDF export shows last 6 months with clear paid/unpaid status

**How to test:**
1. Visit `/debtpipe` after deployment
2. Enter bills JSON and monthly payments JSON (sample format provided in UI)
3. Click "Generate Timeline"
4. Use checkboxes and custom amount inputs to adjust payments
5. Remaining balances update automatically and carry to subsequent months

Deployed to gitchegumi.com/debtpipe for testing.

Closes #67.