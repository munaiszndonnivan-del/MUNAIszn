'use client';

import React, { useState } from 'react';
import { 
  ShoppingBag, 
  CreditCard, 
  TrendingUp, 
  Sparkles,
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Loader2, 
  Copy, 
  Printer, 
  ArrowUpRight,
  Search,
  Trash2,
  Check,
  Save,
  X
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  sku: string;
  selling_price: number;
  current_stock: number;
  is_service: boolean;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export default function MunaisznApp() {
  const [activeTab, setActiveTab] = useState<'pos' | 'hub' | 'subscriptions' | 'dashboard'>('pos');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerPhone, setCustomerPhone] = useState('');

  // STK State Machine: IDLE | WAITING_FOR_PAYMENT | APPROVED | DENIED | FAILED
  const [stkState, setStkState] = useState<string>('IDLE');
  const [stkReceiptNumber, setStkReceiptNumber] = useState<string>('');
  const [stkError, setStkError] = useState<string>('');
  const [receiptData, setReceiptData] = useState<any | null>(null);

  // M-Pesa Hub Configuration State
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [methods, setMethods] = useState({
    personal: '0712 345 678',
    pochi: '0798 765 432',
    till: '849201',
    paybill: '174379',
    accountRef: 'STORE-MARA',
  });

  // Subscription State
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'business'>('pro');
  const [subRef, setSubRef] = useState('');
  const [subSubmitted, setSubSubmitted] = useState(false);

  // Product Catalog
  const [products] = useState<Product[]>([
    { id: '1', name: 'Kitui Pure Raw Honey 1kg', sku: 'HNY-01', selling_price: 1200, current_stock: 5, is_service: false },
    { id: '2', name: 'Nairobi Amber Honey 500g', sku: 'HNY-02', selling_price: 650, current_stock: 2, is_service: false },
    { id: '3', name: 'Beard Grooming Elixir 50ml', sku: 'BRD-09', selling_price: 1500, current_stock: 10, is_service: false },
    { id: '4', name: 'Executive Haircut & Style', sku: 'SRV-01', selling_price: 800, current_stock: 999, is_service: true },
    { id: '5', name: 'Cotton Ankara Fabric 6yds', sku: 'ANK-06', selling_price: 2800, current_stock: 4, is_service: false }
  ]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const addToCart = (product: Product) => {
    const existing = cart.find(i => i.product.id === product.id);
    if (!product.is_service && existing && existing.quantity >= product.current_stock) {
      alert(`Safety rule: Cannot exceed available stock of ${product.current_stock}.`);
      return;
    }
    if (!product.is_service && product.current_stock <= 0) {
      alert('Stock is depleted for this item.');
      return;
    }

    if (existing) {
      setCart(cart.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(i => i.product.id !== id));
  };

  const cartTotal = cart.reduce((acc, i) => acc + (i.product.selling_price * i.quantity), 0);

  const handleCashCheckout = () => {
    if (cart.length === 0) return;
    const snap = {
      receiptNumber: `RCP-${Date.now().toString().slice(-6)}`,
      businessName: 'Savannah Tech & Retail',
      date: new Date().toISOString(),
      items: cart.map(i => ({ name: i.product.name, qty: i.quantity, total: i.product.selling_price * i.quantity })),
      total: cartTotal,
      paymentMethod: 'CASH',
      ref: 'N/A'
    };
    setReceiptData(snap);
    setCart([]);
  };

  const handleMpesaStkPush = () => {
    if (!customerPhone || customerPhone.length < 9) {
      alert('Please enter a valid Kenyan phone number (e.g. 0712345678)');
      return;
    }
    setStkState('WAITING_FOR_PAYMENT');

    // Simulate Daraja STK confirmation
    setTimeout(() => {
      setStkState('APPROVED');
      setStkReceiptNumber(`QGD${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
    }, 3500);
  };

  const handleSubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subRef || subRef.length !== 10) {
      alert('Please enter a valid 10-character M-Pesa transaction reference (e.g., QGD82XXXXX)');
      return;
    }
    setSubSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#060908] text-[#F3F7F4] flex flex-col md:flex-row antialiased font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0B1210] border-r border-[#16E6A5]/10 flex flex-col justify-between p-4 shrink-0">
        <div>
          {/* Brand Logo & Wordmark */}
          <div className="flex items-center space-x-3 px-2 py-4 border-b border-[#16E6A5]/10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#16E6A5] via-[#35D9EA] to-[#D4B16A] p-[1.5px]">
              <div className="w-full h-full bg-[#060908] rounded-xl flex items-center justify-center">
                <span className="text-[#16E6A5] font-black text-xl tracking-tighter">M</span>
              </div>
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-wider text-[#F3F7F4]">MUNAISZN</h1>
              <p className="text-[10px] text-[#A2B2AA] uppercase tracking-widest">Business Manager</p>
            </div>
          </div>

          {/* Active Store Workspace */}
          <div className="mt-4 px-3 py-2 bg-[#101A16] border border-[#16E6A5]/20 rounded-xl flex items-center justify-between">
            <div className="truncate">
              <p className="text-xs font-semibold text-[#F3F7F4] truncate">Savannah Tech & Retail</p>
              <p className="text-[10px] text-[#16E6A5]">Nairobi, Kenya • KES</p>
            </div>
            <span className="text-[9px] bg-[#D4B16A]/20 text-[#D4B16A] px-1.5 py-0.5 rounded font-mono font-bold">
              PRO
            </span>
          </div>

          {/* Nav Items */}
          <nav className="mt-6 space-y-1">
            <button
              onClick={() => setActiveTab('pos')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'pos'
                  ? 'bg-[#15231D] text-[#16E6A5] border border-[#16E6A5]/30 shadow-lg shadow-[#16E6A5]/5'
                  : 'text-[#A2B2AA] hover:bg-[#101A16] hover:text-[#F3F7F4]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Point of Sale Terminal</span>
            </button>

            <button
              onClick={() => setActiveTab('hub')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'hub'
                  ? 'bg-[#15231D] text-[#16E6A5] border border-[#16E6A5]/30'
                  : 'text-[#A2B2AA] hover:bg-[#101A16] hover:text-[#F3F7F4]'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>M-Pesa Payment Hub</span>
            </button>

            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'subscriptions'
                  ? 'bg-[#15231D] text-[#16E6A5] border border-[#16E6A5]/30'
                  : 'text-[#A2B2AA] hover:bg-[#101A16] hover:text-[#F3F7F4]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#D4B16A]" />
              <span>Billing & Paybill 174379</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-[#15231D] text-[#16E6A5] border border-[#16E6A5]/30'
                  : 'text-[#A2B2AA] hover:bg-[#101A16] hover:text-[#F3F7F4]'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Store Analytics</span>
            </button>
          </nav>
        </div>

        {/* Diagnostic Card */}
        <div className="bg-[#101A16] p-3 rounded-xl border border-[#16E6A5]/10 text-[11px] space-y-1.5 mt-6">
          <div className="flex items-center justify-between text-[#A2B2AA]">
            <span>Platform Paybill</span>
            <span className="font-mono text-[#D4B16A] font-bold">174379</span>
          </div>
          <div className="flex items-center justify-between text-[#A2B2AA]">
            <span>Timezone</span>
            <span className="text-[#F3F7F4]">Africa/Nairobi</span>
          </div>
          <div className="pt-2 border-t border-[#16E6A5]/10 flex items-center space-x-2 text-[#16E6A5]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="text-[10px] tracking-tight">PostgreSQL Stock Guard Active</span>
          </div>
        </div>
      </aside>

      {/* Main Operations Area */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen">
        <header className="h-16 border-b border-[#16E6A5]/10 px-6 flex items-center justify-between bg-[#060908]/80 backdrop-blur sticky top-0 z-30">
          <h2 className="text-sm font-semibold tracking-wide text-[#F3F7F4]">
            {activeTab === 'pos' && 'Point of Sale Terminal'}
            {activeTab === 'hub' && 'Configured M-Pesa Payment Hub'}
            {activeTab === 'subscriptions' && 'Subscriptions & Paybill 174379'}
            {activeTab === 'dashboard' && 'Live Performance Overview'}
          </h2>
          <span className="text-xs text-[#16E6A5] font-mono">KES Currency Active</span>
        </header>

        <div className="p-4 md:p-6 flex-1">
          {/* TAB 1: POS TERMINAL */}
          {activeTab === 'pos' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Product Catalog */}
              <div className="lg:col-span-7 space-y-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#A2B2AA]" />
                  <input
                    type="text"
                    placeholder="Search by product name or SKU..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full bg-[#101A16] border border-[#16E6A5]/20 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#16E6A5]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {products
                    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()))
                    .map(product => {
                      const isLow = !product.is_service && product.current_stock <= 2;
                      const isOut = !product.is_service && product.current_stock === 0;

                      return (
                        <div
                          key={product.id}
                          onClick={() => !isOut && addToCart(product)}
                          className={`p-4 rounded-xl border bg-[#101A16] transition-all cursor-pointer flex flex-col justify-between ${
                            isOut ? 'opacity-40 border-red-500/20 cursor-not-allowed' : 'border-[#16E6A5]/10 hover:border-[#16E6A5]/40 hover:bg-[#15231D]'
                          }`}
                        >
                          <div>
                            <div className="flex justify-between items-start">
                              <h4 className="text-xs font-semibold text-[#F3F7F4] line-clamp-1">{product.name}</h4>
                              <span className="text-[10px] font-mono text-[#A2B2AA]">{product.sku}</span>
                            </div>
                            <p className="text-sm font-bold text-[#16E6A5] mt-1.5">
                              KES {product.selling_price.toLocaleString()}
                            </p>
                          </div>

                          <div className="mt-3 flex items-center justify-between text-[11px]">
                            {product.is_service ? (
                              <span className="text-[#35D9EA]">Service</span>
                            ) : (
                              <span className={isLow ? 'text-amber-400 font-bold' : 'text-[#A2B2AA]'}>
                                Stock: {product.current_stock}
                              </span>
                            )}
                            <button
                              disabled={isOut}
                              className="px-2 py-1 bg-[#16E6A5]/10 text-[#16E6A5] rounded-md font-medium hover:bg-[#16E6A5] hover:text-black transition"
                            >
                              + Add
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Cart Register */}
              <div className="lg:col-span-5 bg-[#101A16] border border-[#16E6A5]/20 rounded-2xl p-5 flex flex-col justify-between shadow-2xl">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#16E6A5]/10">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#F3F7F4]">Current Order</h3>
                    <span className="text-xs text-[#16E6A5] font-mono">{cart.length} item(s)</span>
                  </div>

                  <div className="mt-4 space-y-2 max-h-60 overflow-y-auto pr-1">
                    {cart.length === 0 ? (
                      <div className="text-center py-12 text-[#A2B2AA] text-xs">
                        Register is clear. Tap catalog items to add.
                      </div>
                    ) : (
                      cart.map(i => (
                        <div key={i.product.id} className="flex items-center justify-between bg-[#15231D] p-3 rounded-xl text-xs">
                          <div className="flex-1 pr-2 truncate">
                            <p className="font-medium text-[#F3F7F4] truncate">{i.product.name}</p>
                            <p className="text-[10px] text-[#A2B2AA]">
                              {i.quantity} × KES {i.product.selling_price.toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="font-bold text-[#F3F7F4]">
                              KES {(i.product.selling_price * i.quantity).toLocaleString()}
                            </span>
                            <button onClick={() => removeFromCart(i.product.id)} className="text-red-400 hover:text-red-300">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#16E6A5]/10 space-y-3">
                  <div className="flex justify-between text-xs text-[#A2B2AA]">
                    <span>Subtotal</span>
                    <span>KES {cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[#16E6A5]">
                    <span>Total Payable</span>
                    <span>KES {cartTotal.toLocaleString()}</span>
                  </div>

                  <div>
                    <label className="text-[10px] text-[#A2B2AA] block mb-1">Customer Phone (M-Pesa STK)</label>
                    <input
                      type="text"
                      placeholder="0712345678"
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      className="w-full bg-[#15231D] border border-[#16E6A5]/20 rounded-xl px-3 py-2 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#16E6A5]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={handleCashCheckout}
                      disabled={cart.length === 0}
                      className="py-3 bg-[#15231D] hover:bg-[#15231D]/80 border border-[#16E6A5]/20 text-[#F3F7F4] text-xs font-bold rounded-xl transition disabled:opacity-30"
                    >
                      Cash Payment
                    </button>
                    <button
                      onClick={handleMpesaStkPush}
                      disabled={cart.length === 0 || !customerPhone}
                      className="py-3 bg-gradient-to-r from-[#16E6A5] to-[#35D9EA] text-black text-xs font-bold rounded-xl flex items-center justify-center space-x-1 shadow-lg shadow-[#16E6A5]/10 hover:opacity-95 transition disabled:opacity-30"
                    >
                      <span>M-Pesa STK</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: M-PESA PAYMENT HUB */}
          {activeTab === 'hub' && (
            <div className="max-w-3xl space-y-6">
              <div className="bg-[#101A16] border border-[#16E6A5]/20 p-6 rounded-2xl">
                <h3 className="text-sm font-bold text-[#F3F7F4]">Configure Customer-Facing M-Pesa Hub</h3>
                <p className="text-xs text-[#A2B2AA] mt-1">
                  Configure the numbers displayed to your customers during sales and printed on your thermal receipts.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Till */}
                <div className="bg-[#101A16] border border-[#16E6A5]/10 p-5 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono uppercase bg-[#15231D] text-[#16E6A5] px-2 py-0.5 rounded">
                      Buy Goods Till
                    </span>
                    <button onClick={() => copyToClipboard(methods.till, 'till')} className="text-xs text-[#16E6A5] hover:underline flex items-center space-x-1">
                      {copiedKey === 'till' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'till' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div>
                    <label className="text-[10px] text-[#A2B2AA] block mb-1">Till Number</label>
                    <input
                      type="text"
                      value={methods.till}
                      onChange={e => setMethods({ ...methods, till: e.target.value })}
                      className="w-full bg-[#15231D] border border-[#16E6A5]/20 rounded-xl px-3 py-2 text-xs font-mono text-[#F3F7F4]"
                    />
                  </div>
                </div>

                {/* Pochi */}
                <div className="bg-[#101A16] border border-[#16E6A5]/10 p-5 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono uppercase bg-[#15231D] text-[#35D9EA] px-2 py-0.5 rounded"
