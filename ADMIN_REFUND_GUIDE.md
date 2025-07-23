# Admin Refund System - Quick Reference Guide

## 🚀 How to Access the Admin Interface

1. **Open your browser** and go to: `http://localhost:9000/admin`
2. **Enter the admin API key**: `bma_admin_2024_kJ8mN3pQ7vX2zA9bC5fE1wR4tY6uI0oP`
3. **Click "Access Admin Panel"**
4. **Start managing payments and refunds!**

## 💳 Payment Management

### View All Payments
- The admin interface shows all payments with user details
- Payments are displayed with status indicators (completed, pending, failed)
- You can see payment amounts, user emails, and payment types

### Payment Statistics
- **Total Payments**: Count of all payments
- **Completed Payments**: Count of successful payments
- **Total Revenue**: Sum of all completed payment amounts
- **Refunds**: Count of all refunds processed

## 💰 Processing Refunds

### Step-by-Step Refund Process
1. **Select a Payment**: Click on any payment in the list
2. **Review Details**: Check payment amount, user, and date
3. **Enter Refund Amount**: Amount is auto-populated with payment amount
4. **Select Reason**: Choose from:
   - Requested by Customer
   - Duplicate Payment
   - Fraudulent
   - Other
5. **Add Admin Note** (optional): Add any notes about the refund
6. **Process Refund**: Click "Process Refund" button

### Refund Processing Details
- **Stripe Payments**: Automatically processed via Stripe API
- **PayPal Payments**: Currently require manual processing via PayPal dashboard
- **Validation**: System prevents over-refunding
- **Audit Trail**: All refunds are logged with timestamps

## 🔧 API Endpoints

### Get All Payments
```bash
GET /api/admin/payments
Headers: x-admin-key: your-admin-key
```

### Process Refund
```bash
POST /api/admin/refund
Headers:
  x-admin-key: your-admin-key
  Content-Type: application/json
Body:
{
  "paymentId": 123,
  "amount": "4.99",
  "reason": "requested_by_customer",
  "adminNote": "Customer requested refund via email"
}
```

### Get All Refunds
```bash
GET /api/admin/refunds
Headers: x-admin-key: your-admin-key
```

## 🛡️ Security Features

- **API Key Authentication**: All admin endpoints require the admin API key
- **Input Validation**: Amount and payment ID validation
- **No Sensitive Data**: Payment details are not exposed
- **Audit Logging**: All refund actions are logged

## 📊 Payment Tiers

The system supports two payment tiers:
- **$4.99**: Standard quiz payment
- **$9.99**: Premium tier payment

Refund amounts should match the original payment amount.

## 🔍 Troubleshooting

### Common Issues
1. **401 Unauthorized**: Check admin API key
2. **Payment Not Found**: Verify payment ID exists
3. **Over-Refund Error**: Check if payment was already refunded
4. **PayPal Refunds**: Currently require manual processing

### Error Messages
- **"Cannot refund $X"**: Payment amount exceeded or already refunded
- **"Payment not found"**: Invalid payment ID
- **"Unauthorized"**: Invalid admin API key

## 📈 Monitoring

### What to Watch
- Refund processing errors
- Payment provider API failures
- Invalid refund attempts
- Database connection issues

### Database Queries
```sql
-- View all refunds
SELECT * FROM refunds ORDER BY created_at DESC;

-- View refunds by status
SELECT * FROM refunds WHERE status = 'succeeded';

-- View total refunded amount
SELECT SUM(amount::decimal) FROM refunds WHERE status = 'succeeded';
```

## 🎯 Best Practices

1. **Always verify payment details** before processing refunds
2. **Add admin notes** for audit trail purposes
3. **Check existing refunds** to avoid duplicate refunds
4. **Use appropriate refund reasons** for accurate reporting
5. **Monitor refund success rates** and investigate failures

## 🚨 Emergency Contacts

If you encounter issues:
1. Check the server logs for error details
2. Verify database connectivity
3. Test payment provider API keys
4. Review the `REFUND_SYSTEM.md` file for detailed documentation

---

**Admin API Key**: `bma_admin_2024_kJ8mN3pQ7vX2zA9bC5fE1wR4tY6uI0oP`
**Admin URL**: `http://localhost:5073/admin` 