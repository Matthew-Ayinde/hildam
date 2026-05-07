# Fabric Creation Form - World-Class Implementation Prompt

## Overview
This document defines the specification for the **Add New Fabric** form in the client-manager module, which enables staff to register dropped-off fabric details, upload photos, and track receiving staff.

---

## Feature Requirements

### 1. Customer Auto-Suggest (Advanced Autocomplete)

#### Functionality
- **Real-time Filtering**: Filter customers by name or ID as user types
- **Relevance Sorting**: Prioritize name prefix matches over partial matches
- **Debouncing**: 150ms debounce on search input to optimize performance
- **Keyboard Navigation**: Full arrow key support (Up/Down), Enter to select, Escape to close
- **Visual Feedback**: Highlight currently navigated item, show checkmark on selection
- **Empty State Handling**: Display "No customers found" message when no matches
- **Initial Load**: Show first 8 customers on focus if input is empty

#### Input Validation
- Input must match at least one customer (name or ID)
- Display error message if customer not selected before submission
- Clear customer selection when user starts new search

#### API Integration
**Endpoint**: `GET /customers/all`

**Response Structure**:
```json
{
  "success": "success",
  "data": [
    {
      "id": 1,
      "name": "oju adebayo",
      "email": null,
      "phone_number": "+234",
      "gender": "female",
      "address": null,
      "date_of_birth": "1994-01-06",
      "customer_description": "small",
      "bust": null,
      "waist": "40",
      "hip": "63",
      ...
    }
  ]
}
```

#### Data Processing
- Extract `id` and `name` fields
- Generate display text: `{name} • {phone_number}` (if available)
- Normalize text to lowercase for case-insensitive search
- Cache customer list in component state

#### UX Enhancements
- Show phone number in dropdown list when available
- Display customer ID for clarity
- Show checkmark (✓) when customer is selected
- Smooth transitions with Framer Motion animations
- Change input border color to green when customer is selected

---

### 2. Staff Member Dropdown (Enhanced Select)

#### Functionality
- **Lazy Loading**: Load staff from API on component mount
- **Role Display**: Show staff role alongside name in dropdown
- **Email Display**: Display staff email when member is selected
- **Required Field**: Mark as mandatory with asterisk (*)
- **Visual Confirmation**: Show selected staff info below dropdown

#### Input Validation
- Field is required before form submission
- Display error message if staff member not selected

#### API Integration
**Endpoint**: `GET /users/staff`

**Response Structure**:
```json
{
  "message": "Staff list retrieved successfully.",
  "data": [
    {
      "id": 1,
      "name": "Alpha",
      "email": "admin@gmail.com",
      "role": "admin"
    },
    {
      "id": 21,
      "name": "Stephanie",
      "email": "stephanine@gmail.com",
      "role": "client manager"
    },
    ...
  ]
}
```

#### Data Processing
- Map response `data` array to staff options
- Include `name`, `email`, and `role` fields
- Format display as: `{name} ({role})`
- Handle missing data gracefully

#### UX Enhancements
- Show rotating chevron icon on focus
- Display selected staff details with email below dropdown
- Color-coded visual state (blue theme for staff field)
- Show checkmark (✓) next to selected staff email

---

### 3. Form Validation & Submission

#### Required Fields
1. **Customer** - Must select from dropdown
2. **Staff Member** - Must select from dropdown
3. **Description** - Non-empty text
4. **Dropped Off Date** - Valid date
5. **Fabric Images** - At least 1 image

#### Validation Error Messages
- "Please select a customer from the list."
- "Please select a staff member who received the fabric."
- "Please provide a fabric description."
- "Please select the dropped off date."
- "Please upload at least one fabric image."

#### Success Handling
- Display success toast: "✓ Fabric added successfully"
- Redirect to `/client-manager/fabrics` after 1.5 seconds
- Auto-dismiss status messages after 5 seconds

#### Error Handling
- Catch API errors and display server message
- Fallback message: "Unable to create fabric right now. Please check your fields and try again."
- Show errors in toast notification with red gradient background

---

## TypeScript Interfaces

```typescript
/**
 * Customer data structure from API
 */
interface Customer {
  id: number
  name: string
  email?: string | null
  phone_number?: string
  gender?: string
  customer_description?: string
  [key: string]: any
}

/**
 * User/Staff data structure from API
 */
interface Staff {
  id: number
  name: string
  email: string
  role: "admin" | "client manager" | "head of tailoring" | "tailor"
}

/**
 * Processed customer option for UI
 */
interface CustomerOption {
  id: string
  name: string
  displayText: string
}

/**
 * Processed staff option for UI
 */
interface StaffOption {
  id: string
  name: string
  email: string
  role: string
  displayText: string
}
```

---

## State Management

### Component State Variables
```typescript
// Data
const [customers, setCustomers] = useState<CustomerOption[]>([])
const [staffMembers, setStaffMembers] = useState<StaffOption[]>([])

// Customer autocomplete
const [customerQuery, setCustomerQuery] = useState("")
const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false)
const [filteredCustomers, setFilteredCustomers] = useState<CustomerOption[]>([])
const [customerHighlightedIndex, setCustomerHighlightedIndex] = useState<number>(-1)

// Form data
const [formData, setFormData] = useState({
  customer_id: "",
  description: "",
  received_by_staff_id: "",
  dropped_off_at: "",
  fabric_images: [] as File[],
})

// UI
const [isLoadingLookups, setIsLoadingLookups] = useState(true)
const [isSubmitting, setIsSubmitting] = useState(false)
const [statusMessage, setStatusMessage] = useState<string | null>(null)
const [statusType, setStatusType] = useState<"success" | "error">("success")
```

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `↓` Arrow Down | Move to next suggestion |
| `↑` Arrow Up | Move to previous suggestion |
| `Enter` | Select highlighted suggestion |
| `Escape` | Close suggestions dropdown |

---

## UI/UX Design Guidelines

### Color Scheme
- **Orange** (#f97316): Primary CTA, customer field icon, file upload button
- **Blue** (#3b82f6): Staff field icon
- **Green** (#10b981): Confirmation states, success messages
- **Red** (#ef4444): Error messages, required field indicators
- **Gray**: Neutral UI elements

### Icons (React Icons - io5)
- `IoPeopleOutline`: Customer and staff fields
- `IoDocumentTextOutline`: Description field
- `IoCalendarOutline`: Date field
- `IoCloudUploadOutline`: File upload
- `IoCheckmark`: Selection confirmation
- `IoChevronDown`: Dropdown indicator
- `IoArrowBack`: Navigation back button

### Animation Specifications
- **Entrance**: opacity 0 → 1, scale 0.98 → 1
- **Exit**: opacity 1 → 0, y offset -18
- **Duration**: 150-350ms
- **Library**: Framer Motion with AnimatePresence

### Responsive Design
- **Mobile**: Single column layout
- **Tablet & Desktop**: 2-column grid for customer/staff fields
- **Dropdown Max Height**: 224px (56 → 448px equivalent)

---

## Performance Optimizations

1. **Debouncing**: 150ms delay on customer search to reduce filter operations
2. **Memoization**: `useMemo` for derived data (selected staff, selected customer, file text)
3. **useCallback**: Memoized event handlers to prevent unnecessary re-renders
4. **Lazy Loading**: Customer and staff data loaded only once on mount
5. **Cleanup**: Debounce timer cleared on unmount to prevent memory leaks

---

## Accessibility Features

- **ARIA Labels**: `aria-autocomplete="list"`, `aria-expanded`, `aria-controls`
- **HTML Semantics**: Proper `<label>` elements linked with `htmlFor`
- **Keyboard Navigation**: Full keyboard support for autocomplete
- **Required Indicators**: Visual asterisk (*) for mandatory fields
- **Error Messages**: Clear, actionable error text

---

## API Calls

### Load Lookups (Component Mount)
```typescript
Promise.all([fetchAllCustomers(), fetchAllUsersForClient()])
```

### Submit Fabric
```typescript
createFabric(formData: FormData)
// FormData payload:
// - customer_id: string
// - description: string
// - received_by_staff_id: string
// - dropped_off_at: string
// - fabric_images[]: File[]
```

---

## Implementation Checklist

- [x] TypeScript interfaces for API responses
- [x] Customer autocomplete with debouncing
- [x] Keyboard navigation (Arrow keys, Enter, Escape)
- [x] Keyboard event handlers with proper key detection
- [x] Visual feedback (checkmarks, highlighting, color changes)
- [x] Staff dropdown with role display
- [x] Selected staff info display with email
- [x] Form validation for all required fields
- [x] Error handling with user-friendly messages
- [x] Success feedback with redirect
- [x] Framer Motion animations and transitions
- [x] Accessibility ARIA attributes
- [x] Mobile-responsive layout
- [x] Click-outside detection for dropdown closure
- [x] Performance optimization (debouncing, memoization)

---

## Testing Scenarios

### Customer Autocomplete
- [ ] Search by customer name
- [ ] Search by customer ID
- [ ] Keyboard navigation through suggestions
- [ ] Select customer with mouse click
- [ ] Select customer with Enter key
- [ ] Close dropdown with Escape key
- [ ] No results message displays
- [ ] Initial suggestions load on focus

### Staff Dropdown
- [ ] Dropdown displays all staff members
- [ ] Selected staff email displays below
- [ ] Form cannot submit without staff selection
- [ ] Staff role displays correctly

### Form Submission
- [ ] All validations work correctly
- [ ] Form submits with valid data
- [ ] Error toast appears on API failure
- [ ] Success toast appears and redirects
- [ ] File upload works with multiple images
- [ ] Date field accepts valid dates

### Responsive Testing
- [ ] Mobile layout (single column)
- [ ] Tablet layout (2 columns)
- [ ] Desktop layout (2 columns)
- [ ] Dropdown positioning on small screens

---

## Production Considerations

1. **Error Boundaries**: Wrap form in error boundary for crash handling
2. **Loading States**: Show spinner while loading customers/staff
3. **Network Timeouts**: Implement retry logic for failed API calls
4. **Token Expiration**: Handle 401/403 responses appropriately
5. **Input Sanitization**: Sanitize file names before upload
6. **File Size Limits**: Validate image file sizes before submission
7. **Rate Limiting**: Implement backoff for rapid form submissions
8. **Analytics**: Track form completion rate and error patterns

---

## Future Enhancements

- [ ] Customer search with fuzzy matching
- [ ] Recent customers quick access
- [ ] Batch fabric import with CSV
- [ ] Advanced image preview before upload
- [ ] Fabric categorization/tagging
- [ ] AI-powered fabric quality assessment
- [ ] Customer profile quick view on hover
- [ ] Save draft functionality
- [ ] Auto-suggest based on customer history
