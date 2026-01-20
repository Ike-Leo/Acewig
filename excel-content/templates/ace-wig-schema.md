# Ace Wig Product Schema

This document defines the data schema for the Ace Wig product catalog, following the Excel Content Skill methodology.

---

## Schema Version

| Attribute | Value |
|-----------|-------|
| Schema Name | ace-wig-products |
| Version | 1.0.0 |
| Created | 2026-01-19 |
| Currency | GH₵ (Ghana Cedis) |
| Target Systems | Shopify, Convex API, Internal Excel |

---

## Column Specifications

| Column | Type | Required | Validation | Default | Example |
|--------|------|----------|------------|---------|---------|
| product_id | String | Yes | WIG-NNN format | - | WIG-001 |
| handle | String | Yes | lowercase-with-hyphens | - | luxury-deep-wave |
| title | String | Yes | 3-100 chars | - | "Luxury Deep Wave" |
| description | Text | Yes | 20-500 chars | - | "Raw Hair SDD, 250g..." |
| vendor | String | Yes | Fixed value | "Ace Wig" | Ace Wig |
| product_type | Enum | Yes | See enum below | - | Wavy |
| tags | String | No | Comma-separated | - | "deep wave,raw,sdd" |
| price | Currency | Yes | > 0, 2 decimals | - | 1400.00 |
| compare_at_price | Currency | No | > price | - | 1600.00 |
| sku | String | Yes | SKU-WIG-NNN format | - | SKU-WIG-006 |
| inventory_qty | Integer | Yes | >= 0 | 0 | 18 |
| weight | Decimal | No | > 0 | - | 250 |
| weight_unit | Enum | No | [g, kg] | g | g |
| image_url | URL | No | Valid HTTPS URL | - | https://... |
| status | Enum | Yes | See enum below | active | active |

---

## Data Tokens

### ID Pattern: product_id
```
Format: WIG-{SEQUENCE}
Sequence: 001-999, zero-padded
Examples: WIG-001, WIG-042, WIG-100
```

### ID Pattern: sku
```
Format: SKU-WIG-{SEQUENCE}
Sequence: Matches product_id sequence
Examples: SKU-WIG-001, SKU-WIG-042
```

### ID Pattern: handle
```
Format: {title-in-lowercase-hyphens}
Rules:
- All lowercase
- Spaces become hyphens
- Remove special characters (×, /, etc.)
- Max 50 characters
Examples:
- "Luxury Deep Wave" → "luxury-deep-wave"
- "Vietnamese SDD 5×5" → "vietnamese-sdd-5x5"
```

### Enum: product_type
```json
{
  "allowed_values": ["Straight", "Wavy", "Curly", "Pixie", "Custom"],
  "case_sensitive": false,
  "default": "Straight"
}
```

### Enum: status
```json
{
  "allowed_values": ["active", "draft", "archived"],
  "case_sensitive": true,
  "default": "active"
}
```

### Enum: weight_unit
```json
{
  "allowed_values": ["g", "kg"],
  "default": "g"
}
```

---

## Currency Formatting

| Field | Format | Currency | Range |
|-------|--------|----------|-------|
| price | 0.00 | GH₵ | 100.00 - 5000.00 |
| compare_at_price | 0.00 | GH₵ | must be > price |

**Storage Format**: Numbers only, no symbols (e.g., `1400.00`)
**Display Format**: GH₵1,400.00

---

## Tag Vocabulary

Standard tags for consistent categorization:

### Hair Type Tags
- `straight`, `wavy`, `curly`, `pixie`

### Construction Tags
- `sdd` (Super Double Drawn)
- `dd` (Double Drawn)
- `raw` (Raw/Unprocessed)

### Length Tags
- `8-inch`, `12-inch`, `14-inch`, `18-inch`

### Feature Tags
- `5x5`, `2x6` (Closure sizes)
- `fringe`, `bangs`
- `bouncy`, `layered`
- `virgin hair`
- `premium`, `luxury`, `signature`

### Style Tags
- `bob`, `band`, `closure`
- `pre-styled`, `ready to wear`

---

## Validation Rules

### Required Field Check
All rows MUST have non-empty values for:
- product_id
- handle
- title
- description
- vendor
- product_type
- price
- sku
- inventory_qty
- status

### Uniqueness Constraints
- `product_id`: Globally unique
- `sku`: Globally unique
- `handle`: Globally unique

### Price Logic
- `price` must be > 0
- `compare_at_price` must be > `price` (if present)
- `compare_at_price` is optional (only for sale items)

### Inventory Logic
- `inventory_qty` must be >= 0
- Zero inventory should trigger "Out of Stock" display

---

## Import Notes

### For Shopify
- File must be UTF-8 encoded
- Use `active` for published products
- Use `draft` for unpublished products
- Image URL must be publicly accessible HTTPS

### For Convex API
- Convert CSV to JSON array
- Use camelCase for field names
- Convert price to cents (integer)

### For Excel
- First row is header
- Freeze row 1
- Format price columns as Currency
- Add conditional formatting for low inventory

---

## Example Data

See `ace-wig-products.csv` for complete product catalog.

| product_id | title | price | compare_at_price | inventory_qty |
|------------|-------|-------|------------------|---------------|
| WIG-001 | SDD Fringe Bob | 499.00 | 580.00 | 25 |
| WIG-002 | Vietnamese SDD 5×5 | 1600.00 | 1800.00 | 15 |
| WIG-003 | DD Bouncy Fringe | 699.00 | 799.00 | 30 |
| WIG-004 | Raw Vietnamese Bouncy | 1050.00 | 1200.00 | 20 |
| WIG-005 | SDD Pixie Band Wig | 1300.00 | 1500.00 | 10 |
| WIG-006 | Luxury Deep Wave | 1400.00 | 1600.00 | 18 |

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-19 | Initial schema creation from brand profile |
