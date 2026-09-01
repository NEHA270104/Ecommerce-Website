Design a complete, production-ready ADMIN DASHBOARD UI for an e-commerce store called:

VRISHABHANVI VENTURE

This is the administration interface for a fashion e-commerce website.

IMPORTANT:
Use the uploaded Vrishabhanvi Venture logo as the brand logo.
Do NOT redesign, distort, recreate, or change the logo.

The customer storefront uses a premium navy + gold visual identity.

For the ADMIN PANEL:
Keep the same brand identity, but prioritize usability, clarity, speed and information hierarchy over decorative styling.

This is an MVP admin panel for a non-technical store operator.

==================================================
1. ADMIN DESIGN DIRECTION
==================================================

Visual style:

- Clean
- Professional
- Premium
- Minimal
- Modern
- Easy to operate
- Desktop-first
- Responsive
- Data-focused
- Accessible

The admin panel should NOT look like the customer storefront.

Avoid:
- Large hero banners
- Decorative fashion photography
- Excessive gold
- Heavy gradients
- Unnecessary animations
- Complex charts
- Overly decorative cards

Use the brand colors subtly:

Primary Navy: #0B1736
Gold Accent: #C99724
Light Gold: #E6C76A
Background: #F7F7F8
White: #FFFFFF
Text: #171717
Muted Text: #6B7280
Border: #E5E7EB

Use navy primarily for:
- Sidebar
- Primary buttons
- Active navigation
- Important headings

Use gold only as an accent:
- Logo
- Selected states
- Small highlights
- Important indicators

==================================================
2. ADMIN APP STRUCTURE
==================================================

Create a desktop admin application with:

LEFT SIDEBAR
TOP HEADER
MAIN CONTENT AREA

Desktop width:
1440px

Also design responsive versions for:
1024px
768px
390px

Sidebar desktop width:
240px approximately.

Mobile:
Sidebar becomes a slide-out drawer.

==================================================
3. SIDEBAR
==================================================

Sidebar should contain:

Vrishabhanvi Venture logo

Navigation:

Dashboard
Orders
Products
Categories
Inventory
Customers

Then at bottom:

Storefront
Settings / Account
Logout

IMPORTANT:
Do not create additional modules such as:
- Reviews
- Coupons
- Marketing
- Analytics
- AI
- Wishlist
- Returns management
- Loyalty
- Blog

These are NOT part of the MVP.

Use simple line icons.

Each navigation item should have:
- Icon
- Label
- Active state

Active state should use navy/gold branding without becoming visually loud.

==================================================
4. TOP HEADER
==================================================

Top header:

Left:
Page title / breadcrumb

Right:
- Storefront link
- Admin profile
- Admin name
- Logout

Optional notification icon only if necessary.

Do not create unnecessary notification functionality.

==================================================
5. ADMIN DASHBOARD
==================================================

Route:
 /admin

Page title:
"Dashboard"

Subtitle:
"Overview of your store"

--------------------------------------------------

SUMMARY CARDS

Create four primary cards:

1. ORDERS TODAY
Example:
24

2. REVENUE
Example:
₹42,850

3. LOW STOCK
Example:
8 variants

4. TOTAL PRODUCTS
Example:
126

Each card should include:
- Label
- Main number
- Small supporting information
- Minimal icon

Do NOT create fake advanced analytics.

--------------------------------------------------

RECENT ORDERS

Heading:
"Recent Orders"

Table columns:

Order ID
Customer
Date
Amount
Payment
Status
Action

Example:

#VV1024
Priya Sharma
01 Sep 2026
₹1,799
COD
Confirmed
View

Statuses:

Placed
Confirmed
Shipped
Delivered
Cancelled

Use subtle status badges.

--------------------------------------------------

LOW STOCK

Section:
"Low Stock Variants"

Columns:

Product
SKU
Size
Color
Stock
Action

Example:

Floral Kurti
FK-BLU-M
M
Blue
2
Adjust Stock

CTA:
"View Inventory"

==================================================
6. PRODUCTS PAGE
==================================================

Route:
 /admin/products

Header:

Products

Subtitle:
"Manage your store products, variants and images."

Primary CTA:

"+ Add Product"

--------------------------------------------------

PRODUCT TABLE

Columns:

Image
Product
Category
Price
Variants
Stock
Status
Actions

Example:

Product:
Elegant Floral Kurti

Category:
Women / Kurtis

Price:
₹1,499

Variants:
6

Stock:
24

Status:
Active

Actions:
Edit
Archive

--------------------------------------------------

FILTERS

Create:

Search products...

Category dropdown

Status:
All
Draft
Active
Archived

Sort:
Newest
Price Low to High
Price High to Low

--------------------------------------------------

PRODUCT STATUS

Draft:
Neutral badge

Active:
Green badge

Archived:
Grey badge

==================================================
7. CREATE PRODUCT PAGE
==================================================

Route:
 /admin/products/new

Title:
"Add Product"

Create a clean multi-section form.

SECTION 1 — BASIC INFORMATION

Product Name
Slug
Description
Category
Base Price
Status

Status options:

Draft
Active
Archived

Base price must visually display INR.

Example:
₹1,499

Do not use decimals.

--------------------------------------------------

SECTION 2 — CATEGORY

Create a category selector that supports hierarchical categories.

Example:

Women
  → Dresses
  → Tops & Kurtis
  → Bottom Wear

Accessories

IMPORTANT:

The category selector must NOT hard-code only clothing categories.

It must visually communicate that administrators can create future top-level categories.

Example:

+ Create New Category

--------------------------------------------------

SECTION 3 — PRODUCT IMAGES

Create an image upload area.

Large dropzone:

"Drag & drop product images here"

Secondary:
"or Browse Files"

Below:

Image thumbnails

Each thumbnail has:
- Preview
- Primary indicator
- Drag handle
- Delete button

Actions:

Set as Primary
Reorder
Remove

Show example:

[Image 1] PRIMARY
[Image 2]
[Image 3]
[Image 4]

Do not add AI image generation.

--------------------------------------------------

SECTION 4 — VARIANTS

Heading:
"Product Variants"

Create a table.

Columns:

SKU
Size
Color
Price Override
Stock
Active
Actions

Example:

VV-KURTI-BLU-M
M
Blue
₹1,499
12
Active

VV-KURTI-BLU-L
L
Blue
₹1,499
8
Active

Buttons:

"+ Add Variant"

"Duplicate Variant"

--------------------------------------------------

VARIANT FORM

Fields:

SKU
Size
Color
Price Override
Stock Quantity
Active

Attributes can exist behind the scenes for future product types.

Do NOT expose JSON editing to normal store operators.

--------------------------------------------------

SECTION 5 — SAVE

Bottom sticky action bar:

Cancel

Save Draft

Save & Publish

Make the primary action obvious.

==================================================
8. EDIT PRODUCT
==================================================

Route:
 /admin/products/[id]

Use the same structure as Create Product.

Top:

"Edit Product"

Show:

Product Status

Last Updated

Actions:

Save Changes
Archive Product

Allow editing:

Name
Slug
Description
Category
Base Price
Variants
Images
Status

==================================================
9. ARCHIVE CONFIRMATION
==================================================

When admin clicks Archive:

Open confirmation modal.

Title:
"Archive Product?"

Message:

"This product will no longer appear as an active product in the storefront."

Buttons:

Cancel
Archive Product

Do not permanently delete products from the primary UI.

==================================================
10. CATEGORIES PAGE
==================================================

Route:
 /admin/categories

This page is extremely important.

Title:
"Categories"

Subtitle:
"Organize products using a flexible category structure."

Primary CTA:

"+ Add Category"

--------------------------------------------------

CATEGORY TREE

Display:

Women
├── Dresses
├── Tops & Kurtis
└── Bottom Wear

Accessories

The tree should support:

- Top-level categories
- Nested categories
- Reordering
- Editing
- Activating/deactivating

Each row:

Drag handle
Category name
Slug
Parent
Products count
Status
Actions

--------------------------------------------------

ADD CATEGORY

Fields:

Category Name
Slug
Parent Category
Sort Order
Active

Parent Category:

None
Women
Dresses
Tops & Kurtis
etc.

If Parent Category = None,
the category becomes a top-level category.

This is critical.

The UI must demonstrate that the administrator can add:

Accessories

or any completely new category without developer involvement.

==================================================
11. CATEGORY REORDERING
==================================================

Show drag-and-drop UI.

Example:

Women
  ↕ Dresses
  ↕ Tops & Kurtis
  ↕ Bottom Wear

Admin should be able to change ordering.

Provide:

"Save Order"

button.

==================================================
12. INVENTORY PAGE
==================================================

Route:
 /admin/inventory

Title:
"Inventory"

Subtitle:
"Monitor and adjust product stock."

--------------------------------------------------

FILTERS

Search SKU/product

Category

Stock status:

All
In Stock
Low Stock
Out of Stock

--------------------------------------------------

INVENTORY TABLE

Columns:

Product
SKU
Size
Color
Current Stock
Status
Adjust

Example:

Elegant Floral Kurti
VV-KURTI-BLU-M
M
Blue
12
In Stock
Adjust

--------------------------------------------------

STOCK STATUS

In Stock:
Green

Low Stock:
Amber

Out of Stock:
Red

Define low-stock visually without exposing technical rules.

--------------------------------------------------

ADJUST STOCK

Clicking Adjust opens modal:

Product:
Elegant Floral Kurti

SKU:
VV-KURTI-BLU-M

Current Stock:
12

New Stock Quantity:
[ 20 ]

or:

Adjustment:
[ +8 ]

Buttons:

Cancel
Update Stock

Show success state:

"Inventory updated successfully."

==================================================
13. ORDERS PAGE
==================================================

Route:
 /admin/orders

Title:
"Orders"

Subtitle:
"Manage customer orders."

--------------------------------------------------

FILTER BAR

Search Order ID

Search Customer

Status:

All
Placed
Confirmed
Shipped
Delivered
Cancelled

Payment:

All
COD
Razorpay

Payment Status:

Pending
Paid
Failed

--------------------------------------------------

ORDER TABLE

Columns:

Order ID
Customer
Date
Items
Total
Payment
Payment Status
Order Status
Action

Example:

#VV1024
Priya Sharma
01 Sep 2026
2
₹1,799
COD
Pending
Placed
View

--------------------------------------------------
14. ORDER DETAIL PAGE
==================================================

Route:
 /admin/orders/[id]

Header:

Order #VV1024

Status:
Confirmed

Date:
01 Sep 2026

--------------------------------------------------

ORDER STATUS STEPPER

Placed
↓
Confirmed
↓
Shipped
↓
Delivered

Highlight current status.

Admin controls:

Confirm Order
Mark as Shipped
Mark as Delivered
Cancel Order

Only show valid next actions.

--------------------------------------------------

CUSTOMER INFORMATION

Name
Phone
Email

--------------------------------------------------

SHIPPING ADDRESS

Show complete shipping address snapshot.

--------------------------------------------------

ORDER ITEMS

Columns:

Product
Image
SKU
Size
Color
Qty
Unit Price
Total

Example:

Elegant Floral Kurti
M
Blue
1
₹1,499
₹1,499

--------------------------------------------------

PAYMENT

Payment Method:
Cash on Delivery

Payment Status:
Pending

--------------------------------------------------

ORDER TOTAL

Subtotal
₹1,499

Shipping
₹100

Total
₹1,599

All money is represented as Indian Rupees.

==================================================
15. CANCEL ORDER
==================================================

Confirmation modal:

"Cancel Order?"

Message:

"Are you sure you want to cancel this order?"

Buttons:

Keep Order
Cancel Order

Use destructive styling only for the cancellation action.

==================================================
16. CUSTOMERS PAGE
==================================================

Route:
 /admin/customers

Title:
"Customers"

Subtitle:
"View registered customers."

IMPORTANT:
This page is READ-ONLY.

Do not create customer editing functionality.

Table:

Customer
Email
Phone
Orders
Joined

Example:

Priya Sharma
priya@example.com
98XXXXXX21
4
Aug 2026

Actions:
View

==================================================
17. CUSTOMER DETAIL
==================================================

Create a simple read-only customer detail screen.

Show:

Customer Name
Email
Phone
Joined Date

Order History:

Order ID
Date
Total
Status

Do not allow changing customer information.

==================================================
18. ADMIN LOGIN
==================================================

Create a dedicated admin login screen.

Logo at top.

Heading:

"Admin Sign In"

Fields:

Email
Password

Primary button:

"Sign In"

Error state:

"Invalid email or password."

Do not show customer sign-up on the admin login screen.

Admin access must be role-based.

A normal customer must NOT be able to access /admin.

==================================================
19. EMPTY STATES
==================================================

Create empty states for every major section.

Products:

"No products yet."

CTA:
"Add Product"

Categories:

"No categories yet."

CTA:
"Create Category"

Orders:

"No orders found."

Inventory:

"No inventory issues."

Customers:

"No customers found."

Keep empty states simple.

==================================================
20. LOADING STATES
==================================================

Create skeleton loading states for:

Dashboard cards
Product table
Orders table
Inventory table
Customer table

Use neutral skeleton blocks.

==================================================
21. ERROR STATES
==================================================

Create clean error states.

Example:

"Something went wrong."

"Please try again."

Button:
"Try Again"

Do not expose technical errors to the admin user.

==================================================
22. SUCCESS TOASTS
==================================================

Create reusable toast notifications:

"Product created successfully."

"Product updated successfully."

"Product archived."

"Category created successfully."

"Category order updated."

"Inventory updated successfully."

"Order status updated."

Keep toast messages short.

==================================================
23. RESPONSIVE ADMIN DESIGN
==================================================

DESKTOP — 1440px

Full sidebar
Data tables
Multi-column forms

TABLET — 768px

Collapsible sidebar
Reduced table columns
Stacked form sections

MOBILE — 390px

Hamburger menu

Cards instead of wide tables where necessary.

Product management becomes card/list layout.

Orders become stacked cards.

Inventory becomes stacked cards.

Forms become single-column.

Primary actions remain fixed/sticky where useful.

Never introduce horizontal scrolling unnecessarily.

==================================================
24. DESIGN SYSTEM
==================================================

Create reusable components.

BUTTONS:

Primary
Secondary
Outline
Danger
Disabled

BUTTON SIZES:

Small
Medium
Large

--------------------------------------------------

INPUTS:

Text Input
Search
Select
Textarea
Number Input
Password

States:

Default
Focus
Error
Disabled
Success

--------------------------------------------------

STATUS BADGES:

Active
Draft
Archived
Placed
Confirmed
Shipped
Delivered
Cancelled
Paid
Pending
Failed
Low Stock
Out of Stock

--------------------------------------------------

DATA COMPONENTS:

Table
Pagination
Filter Bar
Search
Dropdown
Modal
Drawer
Toast
Tabs
Breadcrumb
Card

--------------------------------------------------

FORM COMPONENTS:

Form Section
Field Label
Help Text
Validation Error
Image Upload
Variant Table
Category Tree

Use Auto Layout and component variants.

==================================================
25. ACCESSIBILITY
==================================================

Ensure:

- High text contrast
- Clear focus states
- Minimum touch target around 44px
- Labels for every input
- Do not rely only on color for status
- Clear error messages
- Keyboard-friendly controls
- Consistent button hierarchy

==================================================
26. ADMIN NAVIGATION
==================================================

Create these routes in the design:

/admin
/admin/login
/admin/products
/admin/products/new
/admin/products/[id]
/admin/categories
/admin/inventory
/admin/orders
/admin/orders/[id]
/admin/customers
/admin/customers/[id]

Do not create routes outside the requested MVP.

==================================================
27. SAMPLE DATA
==================================================

Use realistic Indian store data.

Products:

Elegant Floral Kurti
Classic Cotton Dress
Everyday Comfort Top
Printed Casual Kurti
Minimalist Straight Pants
Festive Anarkali Dress
Classic Women's Top
Comfort Fit Bottom Wear
Statement Fashion Earrings
Elegant Everyday Accessories

Categories:

Women
├── Dresses
├── Tops & Kurtis
└── Bottom Wear

Accessories

Prices:

₹899
₹1,199
₹1,499
₹1,799
₹2,299

Customers:

Use realistic placeholder Indian names.

Orders:

Use order IDs such as:

#VV1001
#VV1002
#VV1003

==================================================
28. IMPORTANT SECURITY UX
==================================================

The UI should visually communicate that:

- Admin pages are protected.
- Only administrators can manage products.
- Only administrators can manage categories.
- Only administrators can adjust inventory.
- Only administrators can change order status.

Do not display service-role keys, database credentials or secrets anywhere in the UI.

Do not create a settings page for editing environment variables.

==================================================
29. IMPORTANT BUSINESS RULES
==================================================

The admin UI must respect these rules:

1. Product prices are shown in INR.

2. Stock cannot be negative.

3. Out-of-stock variants cannot be sold.

4. Product variants can have:
   - Size
   - Color
   - SKU
   - Stock
   - Price override

5. Products belong to categories.

6. Categories can be nested.

7. New top-level categories can be created without changing the product system.

8. Product images can be uploaded, reordered and marked primary.

9. Orders contain snapshots of purchased product information.

10. Order status progression:

Placed
→ Confirmed
→ Shipped
→ Delivered

Cancellation is available where appropriate.

==================================================
30. DO NOT ADD
==================================================

Absolutely do NOT design:

Reviews
Ratings
Wishlist
Coupons
Discount engine
AI features
Chatbot
Recommendations
Loyalty
Affiliate system
Blog
Advanced analytics
Returns dashboard
Refund management dashboard
Multi-vendor functionality
Subscriptions
Marketing automation
Social login
Multi-language

Keep this strictly MVP.

==================================================
31. FIGMA FILE ORGANIZATION
==================================================

Create these Figma pages:

01 — Admin Design System
02 — Admin Components
03 — Login
04 — Dashboard
05 — Products
06 — Categories
07 — Inventory
08 — Orders
09 — Customers
10 — Responsive Admin

Use:

Auto Layout
Components
Variants
Variables
Responsive constraints

Maintain consistent spacing.

Recommended spacing system:

4
8
12
16
24
32
48

==================================================
32. FINAL ADMIN EXPERIENCE
==================================================

The final admin panel should feel like a real internal business tool that a non-technical store operator can use without developer assistance.

The operator should immediately understand:

- What needs attention
- Which products are low stock
- Which orders need processing
- How to add a product
- How to add a category
- How to update inventory
- How to manage order status

The most important admin workflow should be:

LOGIN
→ DASHBOARD
→ PRODUCTS
→ ADD PRODUCT
→ ADD VARIANTS
→ UPLOAD IMAGES
→ ASSIGN CATEGORY
→ PUBLISH
→ PRODUCT APPEARS IN STOREFRONT

And:

DASHBOARD
→ ORDERS
→ VIEW ORDER
→ CONFIRM
→ SHIP
→ DELIVER

And:

CATEGORIES
→ ADD CATEGORY
→ CREATE NEW TOP-LEVEL CATEGORY
→ ADD PRODUCT
→ PRODUCT APPEARS UNDER NEW CATEGORY

The admin interface must make these workflows obvious and fast.

Final visual impression:

Professional Indian fashion business administration system.

Premium enough to match Vrishabhanvi Venture.

Simple enough for a non-technical store operator.

Functional enough to manage the entire MVP store.