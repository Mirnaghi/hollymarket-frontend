# PredictX - Prediction Markets

A mobile-first prediction market web application built with Next.js, TypeScript, and shadcn/ui with the cosmic nights theme.

## Features

- **Mobile-First Design**: Fully responsive design optimized for mobile devices
- **Real-time Markets**: Browse and interact with prediction markets
- **Category Filtering**: Filter markets by categories (All, Trending, Sports, Politics, Crypto, Entertainment)
- **Search Functionality**: Search for specific markets
- **Beautiful UI**: Cosmic nights theme with glass morphism effects
- **Market Cards**: Display market odds, volume, and trends

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui with custom cosmic nights theme
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. If you encounter npm cache issues, fix them first:
```bash
sudo chown -R $(whoami) ~/.npm
npm cache clean --force
```

3. Install dependencies:
```bash
npm install
```

Or use yarn:
```bash
yarn install
```

### Development

Run the development server:

```bash
npm run dev
```

Or with yarn:
```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/
│   ├── globals.css          # Global styles with cosmic nights theme
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page with markets
├── components/
│   ├── ui/                   # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── tabs.tsx
│   │   └── badge.tsx
│   ├── header.tsx            # App header with login
│   ├── category-tabs.tsx     # Category filter tabs
│   └── event-card.tsx        # Market event card
├── lib/
│   └── utils.ts              # Utility functions
├── tailwind.config.ts        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies
```

## Theme Customization

The app uses the "Cosmic Nights" theme with:
- Dark purple/blue gradient background
- Glass morphism effects on cards
- Purple and blue accent colors
- Glowing hover effects

You can customize the theme in [app/globals.css](app/globals.css) by modifying the CSS variables.

## Features to Implement

- User authentication
- Real-time price updates
- Market detail pages
- Trading functionality
- Portfolio tracking
- WebSocket integration for live data
- Charts and analytics

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT
