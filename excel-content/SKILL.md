---
name: excel-content
description: Transform content requirements into structured, production-ready Excel/CSV/spreadsheet data. Use when creating product catalogs, inventory lists, pricing sheets, customer databases, content calendars, or any tabular data requiring consistency, validation, and professional formatting.
version: 1.0.0
license: MIT
---

# Excel Content Skill — Systematic Spreadsheet & Tabular Data Generation

**Skill Location**: `{project_path}/skills/excel-content/`

This skill transforms vague content requirements into structured, validated, and production-ready spreadsheet data. It ensures data consistency, proper formatting, formula integration, and business-ready outputs through a systematic token & schema approach.

---

## When to Use This Skill (Trigger Patterns)

**MUST apply this skill when:**

- User requests product catalogs, inventory lists, or pricing sheets
- Creating customer databases, contact lists, or CRM exports
- Building content calendars, editorial schedules, or task trackers
- Generating financial reports, budget sheets, or expense trackers
- Creating data for import into e-commerce platforms (Shopify, WooCommerce, Convex)
- Converting unstructured data into tabular format
- User mentions: "spreadsheet", "Excel", "CSV", "table", "catalog", "inventory"

**Trigger phrases:**
- "create a product spreadsheet"![alt text](image.png)
- "build an inventory list"
- "generate a pricing sheet"
- "export data to CSV"
- "create a catalog"
- "make a content calendar"
- "build a database"

**DO NOT use for:**
- Visual design (use frontend-design skill)
- Copywriting without data structure (use brand-voice skill)
- Backend code implementation
- Non-tabular content

---

## Core Principles (Non-Negotiable)

### 1. **Schema-First Methodology**

```
Data Schema → Column Definitions → Data Population → Validation → Formatting
```

**Never skip schema definition.** All data must conform to a predefined structure with types and validation rules.

### 2. **Data Token System**

Just as design uses tokens for consistency, spreadsheets use **data tokens**:

| Token Type | Examples | Purpose |
|------------|----------|---------|
| **ID Tokens** | SKU, Product ID, Order Number | Unique identifiers |
| **Category Tokens** | Product Type, Status, Priority | Enumerated values |
| **Currency Tokens** | Price, Cost, Discount | Monetary values |
| **Quantity Tokens** | Stock, Weight, Duration | Numeric measures |
| **Text Tokens** | Name, Description, Notes | Free-form content |
| **Date Tokens** | Created, Updated, Expires | Temporal values |
| **Boolean Tokens** | Active, Featured, InStock | True/False flags |
| **Reference Tokens** | Category ID, Variant Parent | Relational links |

### 3. **Consistency Rules**

- **Naming Convention**: Use consistent column headers (PascalCase, snake_case, or Title Case—pick one)
- **Data Types**: Enforce types per column (never mix text and numbers)
- **Enum Values**: Define allowed values for category columns
- **Required vs Optional**: Mark mandatory fields clearly
- **Default Values**: Specify fallbacks for optional fields

### 4. **Output Formats Supported**

| Format | Extension | Use Case |
|--------|-----------|----------|
| **CSV** | `.csv` | Universal import/export, programming |
| **TSV** | `.tsv` | Tab-separated for Excel paste |
| **Markdown Table** | `.md` | Documentation, README files |
| **JSON Array** | `.json` | API imports, databases |
| **Excel Formula** | `.xlsx` | Calculated fields, conditional formatting |

---

## Implementation Workflow

### Phase 1: Requirements Analysis

**Step 1: Understand Data Purpose**

```
- What business problem does this data solve?
- Who will use it? (Internal team, customers, API, import system)
- What actions will be taken from this data?
- What is the expected row count? (10s, 100s, 1000s?)
- What systems will consume this data? (Excel, Shopify, Database, API)
```

**Step 2: Define Schema**

Create a comprehensive column specification:

```markdown
## Schema Definition

| Column Name | Type | Required | Validation | Default | Example |
|-------------|------|----------|------------|---------|---------|
| product_id | String | Yes | SKU-XXX-NNN format | - | SKU-WIG-001 |
| name | String | Yes | 3-100 chars | - | "Luxury Deep Wave" |
| price | Currency | Yes | > 0 | - | 1400.00 |
| category | Enum | Yes | [Straight, Wavy, Curly, Pixie] | - | "Wavy" |
| stock | Integer | Yes | >= 0 | 0 | 25 |
| active | Boolean | No | true/false | true | true |
```

### Phase 2: Data Token Configuration

**Step 3: Configure Data Tokens**

Define all enumerated values, ID patterns, and formatting rules:

```markdown
## Data Tokens

### ID Pattern: product_id
- Format: SKU-{CATEGORY_CODE}-{SEQUENCE}
- Category Codes: WIG, ACC, SRV
- Sequence: 001-999, zero-padded
- Example: SKU-WIG-042

### Enum: category
- Allowed Values: ["Straight", "Wavy", "Curly", "Pixie", "Custom"]
- Case Sensitive: No
- Default: "Straight"

### Enum: status
- Allowed Values: ["active", "draft", "discontinued"]
- Default: "active"

### Currency: All price fields
- Format: 0.00 (two decimal places)
- Currency: GH₵ (Ghana Cedis)
- Minimum: 0.00
- Maximum: 99999.99

### Date: All date fields
- Format: YYYY-MM-DD (ISO 8601)
- Timezone: UTC
```

### Phase 3: Data Population

**Step 4: Generate Data Rows**

Follow this structure for each row:

1. **Generate unique ID** using the ID pattern
2. **Populate required fields** first
3. **Apply enum validation** for category fields
4. **Calculate derived fields** (totals, percentages, durations)
5. **Apply formatting rules** (currency, dates, percentages)
6. **Validate constraints** (min/max, uniqueness, references)

### Phase 4: Output Generation

**Step 5: Format for Target System**

| Target | Considerations |
|--------|----------------|
| **Excel** | Add headers, freeze row 1, column widths, conditional formatting |
| **CSV Import** | Quote strings with commas, escape quotes, UTF-8 encoding |
| **Shopify** | Follow Shopify CSV template, include all required columns |
| **Database** | Match schema exactly, handle NULL vs empty string |
| **API** | JSON with proper types (numbers as numbers, not strings) |

---

## Schema Templates

### Template 1: E-Commerce Product Catalog

```csv
product_id,handle,title,description,vendor,product_type,tags,price,compare_at_price,sku,barcode,inventory_qty,weight,weight_unit,image_url,status
```

**Column Specifications:**

| Column | Type | Required | Validation | Notes |
|--------|------|----------|------------|-------|
| product_id | String | Yes | Unique | Internal ID |
| handle | String | Yes | Lowercase, hyphens | URL-friendly slug |
| title | String | Yes | 3-200 chars | Product display name |
| description | Text | Yes | 10-5000 chars | HTML allowed |
| vendor | String | Yes | - | Brand name |
| product_type | Enum | Yes | Category list | Main category |
| tags | String | No | Comma-separated | Search keywords |
| price | Currency | Yes | > 0 | Selling price |
| compare_at_price | Currency | No | > price | Original price (for sales) |
| sku | String | Yes | Unique | Stock keeping unit |
| barcode | String | No | - | UPC/EAN |
| inventory_qty | Integer | Yes | >= 0 | Stock count |
| weight | Decimal | No | > 0 | Product weight |
| weight_unit | Enum | No | [g, kg, lb, oz] | Weight unit |
| image_url | URL | No | Valid URL | Main image |
| status | Enum | Yes | [active, draft, archived] | Publication status |

**Example Row:**
```csv
WIG-001,luxury-deep-wave,"Luxury Deep Wave","100% raw Vietnamese hair, super double drawn for that full, natural flow.",Ace Wig,Wigs,"deep wave,vietnamese,sdd,premium",1400.00,1600.00,SKU-WIG-001,,25,250,g,https://example.com/deep-wave.jpg,active
```

---

### Template 2: Inventory Tracker

```csv
sku,product_name,category,location,quantity,reorder_level,unit_cost,total_value,last_updated,supplier,notes
```

**Column Specifications:**

| Column | Type | Required | Validation | Calculation |
|--------|------|----------|------------|-------------|
| sku | String | Yes | Unique | - |
| product_name | String | Yes | - | - |
| category | Enum | Yes | Category list | - |
| location | String | No | - | Warehouse/shelf |
| quantity | Integer | Yes | >= 0 | - |
| reorder_level | Integer | Yes | >= 0 | Alert threshold |
| unit_cost | Currency | Yes | >= 0 | Cost per unit |
| total_value | Currency | Yes | - | `=quantity * unit_cost` |
| last_updated | Date | Yes | ISO format | - |
| supplier | String | No | - | Vendor name |
| notes | Text | No | - | Additional info |

---

### Template 3: Content Calendar

```csv
content_id,title,content_type,platform,status,author,created_date,scheduled_date,published_date,tags,url,notes
```

**Column Specifications:**

| Column | Type | Validation |
|--------|------|------------|
| content_id | String | Unique: CC-YYYY-NNN |
| title | String | 5-200 chars |
| content_type | Enum | [Post, Story, Reel, Blog, Email] |
| platform | Enum | [Instagram, TikTok, Facebook, Website, Email] |
| status | Enum | [Idea, Draft, Ready, Scheduled, Published] |
| author | String | Team member name |
| created_date | Date | YYYY-MM-DD |
| scheduled_date | Date | YYYY-MM-DD HH:MM |
| published_date | Date | YYYY-MM-DD HH:MM |
| tags | String | Comma-separated |
| url | URL | Full URL when published |
| notes | Text | Internal notes |

---

### Template 4: Customer Database

```csv
customer_id,first_name,last_name,email,phone,address,city,region,country,postal_code,customer_type,total_orders,total_spent,first_order_date,last_order_date,notes,tags
```

**Column Specifications:**

| Column | Type | Required | Validation |
|--------|------|----------|------------|
| customer_id | String | Yes | Unique: CUS-NNNNNN |
| first_name | String | Yes | 1-50 chars |
| last_name | String | Yes | 1-50 chars |
| email | Email | Yes | Valid email format |
| phone | Phone | No | E.164 format (+233...) |
| address | String | No | Street address |
| city | String | No | City name |
| region | String | No | State/Region |
| country | String | No | ISO 3166 country code |
| postal_code | String | No | - |
| customer_type | Enum | No | [Regular, VIP, Wholesale] |
| total_orders | Integer | No | >= 0, calculated |
| total_spent | Currency | No | >= 0, calculated |
| first_order_date | Date | No | YYYY-MM-DD |
| last_order_date | Date | No | YYYY-MM-DD |
| notes | Text | No | Internal notes |
| tags | String | No | Comma-separated |

---

### Template 5: Pricing Sheet

```csv
product_id,product_name,category,base_cost,markup_pct,wholesale_price,retail_price,sale_price,sale_active,margin_pct,effective_date,notes
```

**Column Specifications:**

| Column | Type | Calculation |
|--------|------|-------------|
| product_id | String | Reference |
| product_name | String | - |
| category | Enum | - |
| base_cost | Currency | Raw cost |
| markup_pct | Percentage | Markup percentage |
| wholesale_price | Currency | `=base_cost * (1 + markup_pct/2)` |
| retail_price | Currency | `=base_cost * (1 + markup_pct)` |
| sale_price | Currency | Discounted price |
| sale_active | Boolean | Is sale running |
| margin_pct | Percentage | `=(retail_price - base_cost) / retail_price * 100` |
| effective_date | Date | Price effective from |
| notes | Text | Pricing notes |

---

## Validation Rules

### Data Type Validation

```markdown
## Type Validators

### String
- Min length: 0 (unless specified)
- Max length: 255 (default) or specified
- Trim whitespace: Yes
- Empty allowed: Only if not required

### Integer
- Whole numbers only
- No decimal points
- No thousands separators in raw data
- Negative allowed: Only if specified

### Currency
- Exactly 2 decimal places
- No currency symbols in raw data
- Positive only (unless specified)
- Format: 1234.56 (not 1,234.56)

### Date
- Format: YYYY-MM-DD (ISO 8601)
- No time unless specified
- Valid date required (no 2024-02-30)

### Boolean
- Allowed values: true, false, TRUE, FALSE, 1, 0
- Standardize to: true/false (lowercase)

### Email
- Must contain @ and domain
- Validate format: ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$

### URL
- Must start with http:// or https://
- Valid domain required

### Phone
- E.164 format preferred: +233249494156
- Alternative: Allow local formats with note
```

### Uniqueness Validation

```markdown
## Uniqueness Constraints

| Column | Scope | On Duplicate |
|--------|-------|--------------|
| product_id | Global | Error: Must be unique |
| sku | Global | Error: Must be unique |
| email | Per table | Error: Duplicate email |
| handle | Global | Auto-append number: slug-2 |
```

### Referential Integrity

```markdown
## References

| Column | References | On Missing |
|--------|------------|------------|
| category_id | categories.id | Error: Invalid category |
| parent_id | products.id | NULL: Top-level product |
| variant_of | products.id | Error: Parent required |
```

---

## Output Formatting

### CSV Best Practices

```markdown
## CSV Formatting Rules

1. **Header Row**: First row must contain column names
2. **Encoding**: UTF-8 with BOM for Excel compatibility
3. **Line Endings**: CRLF (\r\n) for Windows, LF (\n) for Unix
4. **Quoting**: 
   - Quote fields containing commas
   - Quote fields containing newlines
   - Quote fields containing quotes (escape as "")
5. **Empty Values**: Empty string "" not NULL
6. **Numbers**: No thousand separators (1000 not 1,000)
7. **Dates**: ISO format YYYY-MM-DD
8. **Booleans**: true/false lowercase
```

### Markdown Table Formatting

```markdown
## Markdown Tables

| ID | Name | Price | Stock |
|----|------|-------|-------|
| 001 | Product A | $10.00 | 25 |
| 002 | Product B | $15.00 | 0 |

Rules:
- Align headers with dashes
- Right-align numbers
- Left-align text
- Fixed-width for ID columns
```

### JSON Array Formatting

```json
[
  {
    "id": "WIG-001",
    "name": "Luxury Deep Wave",
    "price": 1400.00,
    "stock": 25,
    "active": true,
    "created_at": "2026-01-19"
  }
]
```

**JSON Rules:**
- Use proper types (numbers as numbers, not strings)
- Use camelCase for keys
- Include null for missing optional values
- ISO dates as strings

---

## Master Prompt Templates

### Schema Generation Prompt

```
You are a Data Architect specializing in spreadsheet design and database schemas.

[CONTEXT]
Business: {{BUSINESS_NAME}}
Purpose: {{DATA_PURPOSE}}
Target System: {{TARGET_SYSTEM = CSV/Excel}}
Row Count: {{EXPECTED_ROWS}}

[TASK]
Design a complete data schema for: {{SCHEMA_NAME}}

Requirements:
1. List ALL columns with:
   - Column name (consistent naming convention)
   - Data type (String, Integer, Currency, Date, Boolean, Enum, URL, Email)
   - Required/Optional
   - Validation rules
   - Default value (if optional)
   - Example value

2. Define Data Tokens:
   - ID patterns with format specification
   - Enum values for all category columns
   - Currency formatting rules
   - Date format specification

3. Include Relationships:
   - Reference columns (foreign keys)
   - Calculated columns with formulas

4. Output as Markdown table with complete specifications

DO NOT generate sample data yet. Schema only.
```

### Data Population Prompt

```
Using the established schema, generate {{ROW_COUNT}} rows of data for {{SCHEMA_NAME}}.

[SCHEMA]
{{PASTE_SCHEMA}}

[DATA TOKENS]
{{PASTE_TOKENS}}

[REQUIREMENTS]
- Generate realistic, varied data
- Follow all validation rules
- Use proper ID sequences (no gaps)
- Vary enum distribution realistically
- Include edge cases (0 stock, high price, etc.)
- Dates should be chronologically logical

[OUTPUT FORMAT]
{{FORMAT = CSV}}

[SPECIFIC CONTENT]
{{CONTENT_NOTES}}

Generate production-ready data with no validation errors.
```

### Validation Review Prompt

```
You are a Data Quality Analyst. Review the following dataset for errors.

[SCHEMA]
{{PASTE_SCHEMA}}

[DATA]
{{PASTE_DATA}}

Check for:
1. Type violations (string in number field, etc.)
2. Missing required values
3. Duplicate unique keys
4. Invalid enum values
5. Format errors (dates, emails, phones)
6. Referential integrity issues
7. Range violations (negative stock, etc.)
8. Logical inconsistencies (sale_price > retail_price)

Output:
- Error count by category
- Specific rows with issues
- Suggested fixes
```

---

## Quick Start Examples

### Example 1: Ace Wig Product Catalog

```
Create a product catalog for Ace Wig with the following:

Schema: E-Commerce Product Catalog
Products: 6 signature wigs
Currency: GH₵ (Ghana Cedis)
Categories: Straight, Wavy, Curly, Pixie

Include:
- Real product names from brand profile
- Accurate pricing (GH₵499 - GH₵1,800)
- SEO-friendly descriptions
- Stock quantities
- Image placeholders

Output: CSV format ready for Shopify import
```

**Result:**

```csv
product_id,handle,title,description,vendor,product_type,tags,price,compare_at_price,sku,inventory_qty,status
WIG-001,sdd-fringe-bob,SDD Fringe Bob,"8-inch Super Double Drawn with bangs. Perfect for a chic, everyday look.",Ace Wig,Straight,"fringe,bob,sdd,bangs",499.00,580.00,SKU-WIG-001,25,active
WIG-002,vietnamese-sdd-5x5,Vietnamese SDD 5×5,"18-inch Vietnamese straight, 250g. Premium quality for the ultimate sleek look.",Ace Wig,Straight,"vietnamese,straight,sdd,5x5,premium",1600.00,1800.00,SKU-WIG-002,15,active
WIG-003,dd-bouncy-fringe,DD Bouncy Fringe,"12-inch Double Drawn bouncy curls, 200g. Fun and flirty with natural movement.",Ace Wig,Curly,"bouncy,curly,dd,fringe",699.00,799.00,SKU-WIG-003,30,active
WIG-004,raw-vietnamese-bouncy,Raw Vietnamese Bouncy,"14-inch Raw Vietnamese bouncy waves. 100% virgin hair for that natural flow.",Ace Wig,Wavy,"vietnamese,raw,bouncy,wavy",1050.00,1200.00,SKU-WIG-004,20,active
WIG-005,sdd-pixie-band-wig,SDD Pixie Band Wig,"Super Double Drawn pixie cut band wig. Bold, beautiful, and easy to wear.",Ace Wig,Pixie,"pixie,band,sdd,short",1300.00,1500.00,SKU-WIG-005,10,active
WIG-006,luxury-deep-wave,Luxury Deep Wave,"Raw Hair SDD, 250g. Our signature deep wave for effortless glamour.",Ace Wig,Wavy,"deep wave,raw,sdd,luxury,signature",1400.00,1600.00,SKU-WIG-006,18,active
```

---

### Example 2: Inventory with Formulas

```csv
sku,product_name,quantity,reorder_level,unit_cost,total_value,status
SKU-WIG-001,SDD Fringe Bob,25,10,350.00,=C2*E2,=IF(C2<=D2,"REORDER","OK")
SKU-WIG-002,Vietnamese SDD 5×5,15,5,1100.00,=C3*E3,=IF(C3<=D3,"REORDER","OK")
```

**Excel Formulas:**
- `total_value`: `=quantity * unit_cost`
- `status`: `=IF(quantity <= reorder_level, "REORDER", "OK")`

---

## Verification Checklist

Before delivering data, verify:

**Schema Compliance:**
- [ ] All columns defined in schema present
- [ ] Column order matches specification
- [ ] Header names exactly match schema

**Data Quality:**
- [ ] No empty required fields
- [ ] No type violations
- [ ] All enums use valid values
- [ ] Unique fields are unique
- [ ] Dates are valid and formatted correctly
- [ ] Numbers have correct precision

**Formatting:**
- [ ] Correct CSV/JSON/Markdown formatting
- [ ] Proper quoting and escaping
- [ ] UTF-8 encoding
- [ ] No trailing whitespace

**Business Logic:**
- [ ] Prices are realistic for the business
- [ ] Stock quantities are reasonable
- [ ] Dates are chronologically logical
- [ ] Calculated fields are correct

**Import Ready:**
- [ ] Matches target system requirements
- [ ] All required columns present
- [ ] No duplicate identifiers
- [ ] Test import successful

---

## Tips for Excellence

1. **Always define schema first** — Never start populating without structure
2. **Validate as you go** — Check each column type as you add data
3. **Use realistic data** — Test with actual content, not "Lorem ipsum"
4. **Handle edge cases** — Include zero stock, maximum values, optional nulls
5. **Maintain referential integrity** — All references must resolve
6. **Format for the target** — CSV differs from JSON differs from Excel
7. **Document your tokens** — Future editors need to understand the patterns
8. **Version your schemas** — Track changes over time
9. **Test imports** — Verify data works in the target system
10. **Keep it maintainable** — Clear naming, consistent formatting

---

## References & Resources

- **CSV Specification**: RFC 4180
- **JSON Specification**: RFC 8259
- **Excel Limits**: 1,048,576 rows × 16,384 columns
- **Shopify CSV Guide**: https://help.shopify.com/en/manual/products/import-export
- **Date Formats (ISO 8601)**: https://en.wikipedia.org/wiki/ISO_8601
- **E.164 Phone Format**: https://en.wikipedia.org/wiki/E.164
- **Country Codes (ISO 3166)**: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2

---

**Version**: 1.0.0  
**Created**: 2026-01-19  
**License**: MIT  
**Maintained by**: Ace Wig & More project
