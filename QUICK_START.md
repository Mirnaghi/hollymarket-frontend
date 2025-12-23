# Polymarket Trading - Quick Start Guide 🚀

Get your users trading on Polymarket in minutes!

---

## ⚡ Quick Overview

Your app now has **full Polymarket CLOB integration** with automatic builder attribution. Users can:
- Trade on any Polymarket market
- Buy/Sell Yes/No positions
- Place real orders on Polygon
- You earn builder rewards! 💰

---

## 🎯 For End Users

### First Time Setup (One-time, < 1 minute)

1. **Connect Wallet**
   - Click any Buy/Sell button on a market
   - Connect your Web3 wallet (MetaMask, etc.)

2. **Switch to Polygon** (if needed)
   - App will prompt you
   - Accept network switch in your wallet

3. **Setup Trading** (Automatic)
   - Click "Setup Trading Account"
   - Sign one message (free, no gas)
   - Setup complete! ✅

### Trading

Once setup is complete:

1. Click **Buy** or **Sell** on any market
2. Choose **Yes** or **No**
3. Enter amount in USD
4. Click **Buy/Sell** button
5. Confirm transaction in wallet
6. Done! 🎉

**That's it!** Your credentials are saved, so you only need to set up once.

---

## 👨‍💻 For Developers

### Testing the Integration

1. **Start backend** (if not already running)
   ```bash
   cd backend
   npm run dev
   ```

2. **Start frontend**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Open browser**
   ```
   http://localhost:3000
   ```

4. **Test flow:**
   - Connect wallet (use Polygon network)
   - Click Buy/Sell on any market card
   - Complete setup wizard
   - Place a test order
   - Check console for logs

### Environment Check

Verify your `.env.local` has:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_CLOB_API_URL=https://clob.polymarket.com
NEXT_PUBLIC_CHAIN_ID=137
```

### Backend Check

Verify backend has builder credentials:
```bash
curl http://localhost:4000/api/polymarket/builder-info
```

Should return:
```json
{
  "success": true,
  "data": {
    "builder": {
      "configured": true,
      "hasSecret": true,
      "hasPassphrase": true
    }
  }
}
```

---

## 🧪 Testing on Testnet (Recommended First!)

To test without real money:

1. **Update `.env.local`:**
   ```env
   NEXT_PUBLIC_CLOB_API_URL=https://clob-mumbai.polymarket.com
   NEXT_PUBLIC_CHAIN_ID=80001
   ```

2. **Switch wallet to Polygon Mumbai**
   - Add Mumbai network to MetaMask
   - Get test MATIC from faucet

3. **Test the flow**
   - Everything works the same
   - No real money at risk

4. **Switch back to mainnet when ready**
   - Change env vars back
   - Restart dev server

---

## 🎓 Common Scenarios

### Scenario 1: User's First Trade

```
User → Clicks "Buy Yes 65¢"
     → Modal opens
     → Sees "Setup Trading Account"
     → Clicks button
     → Signs message
     → Setup complete!
     → Enters $10
     → Clicks "Buy Yes for $10"
     → Confirms in wallet
     → Order placed! ✅
```

### Scenario 2: Returning User

```
User → Clicks "Sell No 42¢"
     → Modal opens (already set up!)
     → Enters $25
     → Clicks "Sell No for $25"
     → Confirms in wallet
     → Order placed! ✅
```

### Scenario 3: User on Wrong Network

```
User → Clicks "Buy"
     → Modal shows "Wrong Network"
     → Switches to Polygon
     → Trading enabled! ✅
```

---

## 📱 User Experience Flow

### Visual States

**1. Not Connected**
```
┌─────────────────────────────────┐
│  Connect Wallet to Trade        │
│  [Connect Wallet Button]        │
└─────────────────────────────────┘
```

**2. Wrong Network**
```
┌─────────────────────────────────┐
│  ⚠️  Wrong Network              │
│  Switch to Polygon (137)        │
└─────────────────────────────────┘
```

**3. Needs Setup**
```
┌─────────────────────────────────┐
│  Setup Trading                  │
│  ✓ Wallet Connected             │
│  ○ Trading Credentials          │
│  [Setup Trading Account]        │
└─────────────────────────────────┘
```

**4. Ready to Trade**
```
┌─────────────────────────────────┐
│  ✅ Ready to Trade              │
│  [Buy] [Sell]                   │
│  Amount: $ _____                │
│  [Buy Yes for $X]               │
└─────────────────────────────────┘
```

---

## 🔍 Debugging Tips

### "Setup fails with error"

1. **Check console logs** - Full error details
2. **Verify backend is running** - `http://localhost:4000`
3. **Check builder config** - `/api/polymarket/builder-info`
4. **Try refreshing** - Clear localStorage if needed

### "Orders not submitting"

1. **Check wallet balance** - Need USDC.e on Polygon
2. **Verify network** - Must be Polygon (137)
3. **Check backend logs** - Look for signing errors
4. **Test `/sign` endpoint** - Use curl/Postman

### "Setup works but can't trade"

1. **Refresh page** - Re-initialize CLOB client
2. **Check isReadyToTrade** - Should be `true`
3. **Clear credentials** - Remove from localStorage
4. **Setup again** - Generate new credentials

---

## 🎯 Key Files

If you need to customize anything:

| File | Purpose |
|------|---------|
| `components/trading-modal.tsx` | Main trading UI |
| `components/trading-setup.tsx` | Setup wizard |
| `lib/services/clob.service.ts` | CLOB operations |
| `lib/hooks/useTradingSetup.ts` | Setup state management |
| `types/trading.ts` | TypeScript types |

---

## 🚀 Going Live

### Pre-launch Checklist

- [ ] Test on Mumbai testnet
- [ ] Test end-to-end flow on mainnet (small amounts)
- [ ] Verify builder attribution shows in Polymarket dashboard
- [ ] Set up error monitoring
- [ ] Configure production environment variables
- [ ] Document for your team

### Launch Day

1. Deploy backend to production
2. Update frontend env vars to production URLs
3. Deploy frontend
4. Test with real wallet
5. Monitor builder dashboard
6. 🎉 Celebrate!

---

## 💡 Pro Tips

1. **Auto-setup:** The modal automatically shows setup UI when needed
2. **Persistent state:** Credentials saved per wallet, no re-setup needed
3. **Network handling:** App prompts network switch automatically
4. **Error recovery:** Clear localStorage to reset state if needed
5. **Testing:** Use small amounts first to verify everything works

---

## 📞 Need Help?

- **Implementation docs:** See `POLYMARKET_IMPLEMENTATION_COMPLETE.md`
- **Backend guide:** See `POLYMARKET_CLOB_INTEGRATION.md`
- **Polymarket docs:** https://docs.polymarket.com
- **Discord:** https://discord.gg/polymarket

---

## ✅ You're Ready!

Everything is set up and working. Just:

1. Start your servers
2. Connect a wallet
3. Trade!

**Happy trading!** 🎉📈

---

*For detailed technical documentation, see POLYMARKET_IMPLEMENTATION_COMPLETE.md*
