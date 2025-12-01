# API Endpoints Quick Reference

## Base URL
```
http://localhost:4000/api
```

## Authentication
All admin endpoints require JWT token:
```
Authorization: Bearer <jwt-token>
```

---

## Products

### List Products
```http
GET /api/products?category=Apparel&limit=20&offset=0
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "sku": "TEE-BLK-M",
      "name": "Classic Black T-Shirt",
      "category": "Apparel",
      "variants": [...]
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 150
  }
}
```

### Get Product Details
```http
GET /api/products/:id
```

### Create Product (Admin)
```http
POST /api/products
Content-Type: application/json

{
  "sku": "TEE-BLK-001",
  "name": "Classic Black T-Shirt",
  "description": "Premium cotton t-shirt",
  "category": "Apparel",
  "brand": "BasicWear",
  "images": ["https://..."]
}
```

---

## Inventory

### Get Inventory by SKU
```http
GET /api/inventory/TEE-BLK-M-001
```

**Response with AI Recommendations:**
```json
{
  "sku": "TEE-BLK-M-001",
  "qty_available": 15,
  "qty_reserved": 5,
  "safety_stock": 20,
  "reorder_point": 30,
  "status": "low_stock",
  "recentSales": 28,
  "forecastedDemand": 85,
  "aiRecommendation": {
    "should_reorder": true,
    "suggested_qty": 100,
    "reasoning": "Current stock (15) is below reorder point (30)...",
    "urgency": "high"
  }
}
```

### Update Inventory
```http
PUT /api/inventory/TEE-BLK-M-001
Content-Type: application/json

{
  "qtyChange": 50,
  "changeType": "restock",
  "reason": "Received PO-2025-001"
}
```

### Get Low Stock Alerts
```http
GET /api/inventory/alerts/low-stock
```

---

## Forecasting

### Generate Forecast
```http
POST /api/forecast/generate
Content-Type: application/json

{
  "skus": ["TEE-BLK-M-001", "JEAN-BLU-32-001"],
  "horizon_days": 30,
  "force_refresh": false
}
```

**Response:**
```json
{
  "results": [
    {
      "sku": "TEE-BLK-M-001",
      "success": true,
      "forecast": {
        "predictions": [...],
        "summary": {
          "total_predicted": 85,
          "daily_average": 2.8
        },
        "explanation": "Demand expected to increase by 15%..."
      }
    }
  ]
}
```

### Get Latest Forecast
```http
GET /api/forecast/TEE-BLK-M-001?horizon=30
```

### Get Forecast History
```http
GET /api/forecast/TEE-BLK-M-001/history?limit=10
```

---

## Purchase Orders

### Generate AI Draft PO
```http
POST /api/po/draft
Content-Type: application/json

{
  "skus": ["TEE-BLK-M-001", "JEAN-BLU-32-001"],
  "supplier_id": "uuid-supplier-id",
  "reason": "weekly_reorder",
  "notes": "Urgent - festival season",
  "created_by": "user-uuid"
}
```

**Response:**
```json
{
  "id": "po-uuid",
  "po_number": "PO-2025-0042",
  "status": "draft",
  "line_items": [
    {
      "sku": "TEE-BLK-M-001",
      "qty": 100,
      "unit_price_inr": 250,
      "total_inr": 25000
    }
  ],
  "total_amount_inr": 65000,
  "expected_delivery_date": "2025-12-15",
  "ai_reasoning": "Reorder analysis: TEE-BLK-M-001 (100 units)...",
  "draft_email_subject": "Purchase Order PO-2025-0042...",
  "draft_email_body": "Dear Supplier,\n\nPlease process..."
}
```

### List Purchase Orders
```http
GET /api/po?status=draft&limit=50
```

**Status Options:** `draft`, `pending_approval`, `approved`, `sent`, `received`, `cancelled`

### Approve PO
```http
POST /api/po/:id/approve
Content-Type: application/json

{
  "approved_by": "user-uuid"
}
```

### Send PO
```http
POST /api/po/:id/send
```

### Receive PO (Updates Inventory)
```http
POST /api/po/:id/receive
Content-Type: application/json

{
  "received_by": "user-uuid"
}
```

---

## Suppliers

### List Suppliers
```http
GET /api/suppliers
```

### Create Supplier
```http
POST /api/suppliers
Content-Type: application/json

{
  "name": "TextileCorp India",
  "contact_person": "Rajesh Kumar",
  "email": "orders@textilecorp.in",
  "phone": "+91-9876543210",
  "address": "Plot 45, Surat, Gujarat",
  "payment_terms": "Net 30",
  "lead_time_days": 7
}
```

### Update Supplier Prices
```http
POST /api/suppliers/:id/prices
Content-Type: application/json

{
  "sku": "TEE-BLK-M-001",
  "unit_price_inr": 245,
  "moq": 50,
  "valid_until": "2026-12-31"
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": {
    "message": "Product not found",
    "statusCode": 404,
    "timestamp": "2025-12-01T10:30:00Z"
  }
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

---

## Testing with cURL

### Check API Health
```bash
curl http://localhost:4000/health
```

### Get Inventory with Recommendations
```bash
curl http://localhost:4000/api/inventory/TEE-BLK-M-001
```

### Generate Forecast
```bash
curl -X POST http://localhost:4000/api/forecast/generate \
  -H "Content-Type: application/json" \
  -d '{
    "skus": ["TEE-BLK-M-001"],
    "horizon_days": 30
  }'
```

### Create Draft PO
```bash
curl -X POST http://localhost:4000/api/po/draft \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "skus": ["TEE-BLK-M-001"],
    "supplier_id": "uuid-here",
    "reason": "weekly_reorder"
  }'
```

---

## Rate Limits

- **Default**: 100 requests per 15 minutes per IP
- **Forecast Generation**: 10 forecasts per minute (OpenAI rate limit consideration)
- **Batch Operations**: Maximum 50 SKUs per request

---

## Webhooks (Future)

Coming soon: Real-time notifications for:
- Low stock alerts
- Forecast generation completion
- PO status changes
- Inventory updates
