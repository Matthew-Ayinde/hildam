Goal

When a user selects a ready-to-wear product in the sale form, the browser should request the server endpoint `sales/get-product-with-variant/{productId}` to retrieve the product's variant records. The developer will inspect the browser network response and paste the exact JSON shape back here so the code can be adapted to the real response format.

Requirements

- Trigger an HTTP GET from the browser to the path `/sales/get-product-with-variant/{productId}` immediately when a product is selected.
- Keep the request simple and discoverable in browser DevTools (use `fetch(url)` with console.debug logging).
- Support multiple plausible response shapes in the client (e.g., `{ variants: [...] }`, `{ data: [...] }`, `{ product: { variants: [...] } }`) until the exact format is provided.
- Populate the variant select with the returned variants; while loading, disable the variant select and show a "Loading variants..." placeholder.
- Reset the selected variant when the product changes.
- Log errors to the console and fall back to the product object’s embedded `variants` if present.

What I will paste after inspection

- The full JSON response body returned by `/sales/get-product-with-variant/{productId}` (copy the network response preview or raw body).

How you should respond after I paste the response

1. Confirm the exact path and whether the endpoint includes a prefix (e.g., `/api/sales/...`) or is at the root (`/sales/...`).
2. Provide a minimal patch to the SaleFormComponent(s) mapping the real response shape to the `variantOptions` variable.
3. If needed, add TypeScript interfaces describing the variant object shape and update UI labels/placeholders to reflect real fields (for example, `size`, `color`, `sku`, `price`).

Testing checklist for me (developer)

- [ ] Select a product in the Sale form and open DevTools → Network → XHR/Fetch.
- [ ] Inspect the request to `/sales/get-product-with-variant/{productId}` and copy the response body.
- [ ] Paste the response body into the chat.

Notes

- The client code already includes a tolerant response parsing strategy and will show the request in DevTools.
- After you paste the response, I'll update the mapping to be precise and add any missing UI improvements (labels, placeholders, tooltip showing SKU/stock, etc.).
