# Trading Modal Features

## Overview
The trading modal opens when users click on the Yes or No buttons in any market card, providing a full trading interface.

## Key Features

### 🎨 Animations
- **Backdrop Fade**: Smooth fade-in backdrop with blur effect
- **Slide In**: Modal slides up from bottom on mobile, scales in on desktop
- **Button Interactions**: Scale effects on hover/click
- **Potential Return**: Animates in when amount is entered

### 🎯 Functionality
1. **Buy/Sell Toggle**: Switch between buying and selling positions
2. **Yes/No Selection**: Large, colorful buttons with active state
3. **Amount Input**: Real-time calculation of shares and potential returns
4. **Price Display**: Shows current market prices
5. **Interest Rate**: Displays earning potential (3.5%)

### 🌈 Cosmic Nights Theme Integration
- **Yes Button**: Blue gradient with blue glow effects
- **No Button**: Purple gradient with purple glow effects  
- **Glass Morphism**: Backdrop blur and transparency
- **Gradient Action Button**: Changes color based on Yes/No selection
- **Smooth Transitions**: 200-300ms animations throughout

### 📱 Mobile-First Design
- **Bottom Sheet**: Slides from bottom on mobile devices
- **Centered Modal**: Centered with padding on desktop
- **Responsive Layout**: Adapts to all screen sizes
- **Touch-Friendly**: Large tap targets, smooth interactions

### 💡 User Experience
- Click backdrop or X button to close
- Prevents card click when opening modal
- Dynamic button text showing trade details
- Real-time calculations as you type
- Smooth state transitions

## Components Modified
1. `components/event-card.tsx` - Added modal integration
2. `components/trading-modal.tsx` - New modal component
3. `app/globals.css` - Added animation keyframes

## Color Scheme
- **Yes**: Blue (#3b82f6) with blue shadows
- **No**: Purple (#a855f7) with purple shadows
- **Success**: Green (#22c55e)
- **Background**: Dark cosmic gradient
