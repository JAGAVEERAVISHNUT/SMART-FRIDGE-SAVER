# SmartFridgeSaver

A progressive web app (PWA) that helps reduce household food waste through smart inventory tracking, expiry alerts, and recipe recommendations.

## Features

- **Smart Input Methods**
  - Camera-based receipt scanning (OCR simulation)
  - Voice input for hands-free item addition
  - Manual entry for quick adding

- **Digital Fridge Inventory**
  - Track groceries with categories
  - Real-time expiry countdowns
  - Color-coded status tags (Fresh, Expiring Soon, Expired)
  - Filter by category

- **Smart Alerts**
  - Push notifications for items expiring soon
  - Friendly reminder messages
  - Priority view for urgent items

- **Recipe Recommendations**
  - AI-powered recipe suggestions based on expiring items
  - Integration with Spoonacular API
  - Cook time and servings information

- **Sustainability Dashboard**
  - Track CO2 emissions prevented
  - Calculate money saved
  - Monthly waste prevention trends
  - Environmental impact metrics

- **PWA Support**
  - Install as mobile app
  - Offline functionality
  - Mobile-first responsive design

## Getting Started

### Prerequisites
- Node.js 16+ 
- Modern browser with PWA support

### Installation

\`\`\`bash
# Clone the repository
git clone <repo-url>

# Install dependencies
npm install

# Run development server
npm run dev
\`\`\`

Visit `http://localhost:3000` in your browser.

### Building for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## Project Structure

\`\`\`
app/
├── layout.tsx              # Root layout
├── page.tsx               # Home page
├── login/                 # Authentication pages
├── signup/
├── add-items/            # Item input page
├── inventory/            # Fridge inventory page
├── recipes/              # Recipe suggestions page
├── dashboard/            # Sustainability dashboard
├── api/                  # Backend API routes
│   ├── items/           # Item management
│   └── recipes/         # Recipe fetching
└── globals.css           # Theme and styles

components/
├── layout/               # Layout components
│   └── navigation.tsx    # Bottom/side navigation
├── grocery-card.tsx      # Reusable item card
└── protected-route.tsx   # Auth wrapper

lib/
└── auth.ts              # Authentication utilities

public/
├── manifest.json        # PWA manifest
└── service-worker.json  # Service worker config
\`\`\`

## API Integrations

### Spoonacular API
Recipe fetching from expiring ingredients
- Endpoint: `https://api.spoonacular.com/recipes/findByIngredients`
- Get your API key at: https://spoonacular.com/food-api

### Environment Variables
Removed the exposed API key example. Add your API key to Vercel environment variables instead.
Contact your development team for the API key configuration in production.

## Authentication
Currently uses localStorage for demo purposes. For production:
- Implement server-side sessions (Supabase, Firebase, etc.)
- Add proper JWT token handling
- Secure password hashing

## Data Storage
- Frontend: localStorage (demo)
- Production: Use database like Supabase, Firebase, or PostgreSQL

## Mobile Installation

### iOS
1. Open in Safari
2. Tap Share → Add to Home Screen
3. App installs as native-like app

### Android
1. Open in Chrome
2. Tap Menu → Install app
3. App installs to home screen

## Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Samsung Internet 14+

## Performance Optimizations
- Image optimization with Next.js Image
- Lazy loading for recipe cards
- Mobile-first responsive design
- Efficient state management with React hooks

## Deployment

### Vercel (Recommended)
\`\`\`bash
npm install -g vercel
vercel
\`\`\`

### Other Platforms
Works with any Node.js hosting (Heroku, AWS, DigitalOcean, etc.)

## Future Enhancements
- Real-time push notifications
- Multi-user household sharing
- Advanced recipe filtering
- Integration with grocery delivery services
- AI-powered shopping list generation
- Barcode scanning
- Community recipe sharing

## Contributing
Pull requests welcome! Please follow the existing code style.

## License
MIT

## Support
For issues and feature requests, please open an issue on GitHub.

---

**SmartFridgeSaver** - Reduce food waste, save money, protect the planet 🌱
