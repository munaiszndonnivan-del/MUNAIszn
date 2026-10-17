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

export default function MunaisznApp() {
  const [activeTab, setActiveTab] = useState('pos');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<any[]>([]);
  const [customerPhone, setCustomerPhone] = useState('');

  // STK State Machine
  const [stkState, setStkState] = useState('IDLE');
  const [stkReceiptNumber, setStkReceiptNumber] = useState('');
  const [receiptData, setReceiptData] = useState<any>(null);

  // M-Pesa Hub Configuration
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [methods, setMethods] = useState({
    personal: '0712 345 678',
    pochi: '0798 765 432',
    till: '849201',
    paybill: '174379',
    accountRef: 'STORE-MARA',
  });

  // Subscription State
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [subRef, setSubRef] = useState('');
  const [subSubmitted, setSubSubmitted] = useState(false);

  // Products Catalog
  const [products] = useState([
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

  const addToCart = (product: any) => {
    const existing = cart.find(i => i.product.id === product.id);
    if (!product.is_service && existing && existing.quantity >= product.current_stock) {
      alert(`Safety rule: Cannot exceed stock of ${product.current_stock}.`);
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

    setTimeout(() => {
      setStkState('APPROVED');
      setStkReceiptNumber(`QGD${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
    }, 3500);
  };

  const handleSubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subRef || subRef.length !== 10) {
      alert('Please enter a valid 10-character M-Pesa transaction reference (e.g. QGD82XXXXX)');
      return;
    }
    setSubSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#060908] text-[#F3F7F4] flex flex-col md:flex-row antialiased font-sans">
      <aside className="w-full md:w-64 bg-[#0B1210] border-r border-[#16E6A5]/10 flex flex-col justify-between p-4 shrink-0">
        <div>
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

          <div className="mt-4 px-3 py-2 bg-[#101A16] border border-[#16E6A5]/20 rounded-xl flex items-center justify-between">
            <div className="truncate">
              <p className="text-xs font-semibold text-[#F3F7F4] truncate">Savannah Tech & Retail</p>
              <p className="text-[10px] text-[#16E6A5]">Nairobi, Kenya • KES</p>
            </div>
            <span className="text-[9px] bg-[#D4B16A]/20 text-[#D4B16A] px-1.5 py-0.5 rounded font-mono font-bold">
              PRO
            </span>
          </div>

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
          {activeTab === 'pos' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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

          {activeTab === 'hub' && (
            <div className="max-w-3xl space-y-6">
              <div className="bg-[#101A16] border border-[#16E6A5]/20 p-6 rounded-2xl">
                <h3 className="text-sm font-bold text-[#F3F7F4]">Configure Customer-Facing M-Pesa Hub</h3>
                <p className="text-xs text-[#A2B2AA] mt-1">
                  Configure the numbers displayed to your customers during sales and printed on your thermal receipts.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div className="bg-[#101A16] border border-[#16E6A5]/10 p-5 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono uppercase bg-[#15231D] text-[#35D9EA] px-2 py-0.5 rounded">
                      Pochi la Biashara
                    </span>
                    <button onClick={() => copyToClipboard(methods.pochi, 'pochi')} className="text-xs text-[#35D9EA] hover:underline flex items-center space-x-1">
                      {copiedKey === 'pochi' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'pochi' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div>
                    <label className="text-[10px] text-[#A2B2AA] block mb-1">Pochi Mobile Number</label>
                    <input
                      type="text"
                      value={methods.pochi}
                      onChange={e => setMethods({ ...methods, pochi: e.target.value })}
                      className="w-full bg-[#15231D] border border-[#16E6A5]/20 rounded-xl px-3 py-2 text-xs font-mono text-[#F3F7F4]"
                    />
                  </div>
                </div>

                <div className="bg-[#101A16] border border-[#16E6A5]/10 p-5 rounded-2xl space-y-3 md:col-span-2">
                  <span className="text-[10px] font-mono uppercase bg-[#15231D] text-[#D4B16A] px-2 py-0.5 rounded">
                    Customer Paybill
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    <div>
                      <label className="text-[10px] text-[#A2B2AA] block mb-1">Paybill Number</label>
                      <input
                        type="text"
                        value={methods.paybill}
                        onChange={e => setMethods({ ...methods, paybill: e.target.value })}
                        className="w-full bg-[#15231D] border border-[#16E6A5]/20 rounded-xl px-3 py-2 text-xs font-mono text-[#F3F7F4]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#A2B2AA] block mb-1">Account Reference Instructions</label>
                      <input
                        type="text"
                        value={methods.accountRef}
                        onChange={e => setMethods({ ...methods, accountRef: e.target.value })}
                        className="w-full bg-[#15231D] border border-[#16E6A5]/20 rounded-xl px-3 py-2 text-xs font-mono text-[#F3F7F4]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => alert('Payment hub configurations saved successfully.')}
                  className="px-6 py-2.5 bg-[#16E6A5] text-black font-bold text-xs rounded-xl flex items-center space-x-2 hover:bg-[#16E6A5]/90 transition"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Payment Hub Settings</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'subscriptions' && (
            <div className="max-w-3xl space-y-6">
              <div className="bg-[#101A16] border border-[#16E6A5]/20 p-6 rounded-2xl">
                <h3 className="text-sm font-bold text-[#F3F7F4] flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[#D4B16A]" />
                  <span>Platform Subscriptions & Billing</span>
                </h3>
                <p className="text-xs text-[#A2B2AA] mt-1">
                  Pay your monthly SaaS subscription to unlock unlimited sales, multi-user accounts, and customer M-Pesa hub integration.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  onClick={() => setSelectedPlan('pro')}
                  className={`p-5 rounded-2xl border cursor-pointer transition ${
                    selectedPlan === 'pro' ? 'bg-[#15231D] border-[#16E6A5]' : 'bg-[#101A16] border-[#16E6A5]/10'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-[#F3F7F4]">Pro Merchant</h4>
                      <p className="text-xs text-[#A2B2AA]">Single-shop professional</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#16E6A5]">KSh 499/mo</span>
                  </div>
                  <ul className="mt-4 space-y-1.5 text-xs text-[#A2B2AA]">
                    <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-[#16E6A5]" /> <span>Unlimited monthly sales</span></li>
                    <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-[#16E6A5]" /> <span>M-Pesa Payment Hub</span></li>
                    <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-[#16E6A5]" /> <span>Thermal receipts & exports</span></li>
                  </ul>
                </div>

                <div
                  onClick={() => setSelectedPlan('business')}
                  className={`p-5 rounded-2xl border cursor-pointer transition ${
                    selectedPlan === 'business' ? 'bg-[#15231D] border-[#16E6A5]' : 'bg-[#101A16] border-[#16E6A5]/10'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-[#F3F7F4]">Enterprise Scale</h4>
                      <p className="text-xs text-[#A2B2AA]">Multi-staff operations</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#D4B16A]">KSh 999/mo</span>
                  </div>
                  <ul className="mt-4 space-y-1.5 text-xs text-[#A2B2AA]">
                    <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-[#16E6A5]" /> <span>Up to 10 staff cashiers</span></li>
                    <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-[#16E6A5]" /> <span>All Pro Merchant perks</span></li>
                    <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-[#16E6A5]" /> <span>Priority Safaricom support</span></li>
                  </ul>
                </div>
              </div>

              <div className="bg-[#101A16] border border-[#16E6A5]/20 p-6 rounded-2xl space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4B16A]">Payment Instructions (Paybill 174379)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                  <div className="bg-[#15231D] p-3 rounded-xl">
                    <p className="text-[10px] text-[#A2B2AA]">Platform Paybill</p>
                    <p className="text-sm font-bold text-[#F3F7F4] mt-1">174379</p>
                  </div>
                  <div className="bg-[#15231D] p-3 rounded-xl">
                    <p className="text-[10px] text-[#A2B2AA]">Account Number</p>
                    <p className="text-sm font-bold text-[#16E6A5] mt-1">MUNAISZN-BIZ1</p>
                  </div>
                  <div className="bg-[#15231D] p-3 rounded-xl">
                    <p className="text-[10px] text-[#A2B2AA]">Amount</p>
                    <p className="text-sm font-bold text-[#D4B16A] mt-1">
                      KES {selectedPlan === 'pro' ? '499.00' : '999.00'}
                    </p>
                  </div>
                </div>

                {subSubmitted ? (
                  <div className="p-4 bg-[#15231D] border border-[#16E6A5]/30 rounded-xl text-xs space-y-2">
                    <p className="font-bold text-[#16E6A5]">Payment Verification in Progress</p>
                    <p className="text-[#A2B2AA]">
                      Reference <span className="font-mono text-[#F3F7F4]">{subRef}</span> has been logged. An administrator will verify it against the Paybill 174379 statement within 30 minutes. Your store remains fully active.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubSubmit} className="space-y-3 pt-2">
                    <div>
                      <label className="text-[10px] text-[#A2B2AA] block mb-1">M-Pesa Transaction Reference Code</label>
                      <input
                        type="text"
                        maxLength={10}
                        placeholder="e.g. QGD82XXXXX"
                        value={subRef}
                        onChange={e => setSubRef(e.target.value.toUpperCase())}
                        className="w-full bg-[#15231D] border border-[#16E6A5]/20 rounded-xl px-4 py-2.5 text-xs text-[#F3F7F4] font-mono tracking-widest focus:outline-none focus:border-[#16E6A5]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-[#16E6A5] text-black font-bold text-xs rounded-xl hover:bg-[#16E6A5]/90 transition"
                    >
                      Submit M-Pesa Proof for Verification
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#101A16] border border-[#16E6A5]/10 p-4 rounded-xl">
                  <p className="text-xs text-[#A2B2AA]">Today's Reconciled Sales</p>
                  <p className="text-lg font-bold text-[#16E6A5] mt-1">KES 24,850.00</p>
                  <span className="text-[10px] text-[#A2B2AA]">12 recorded orders</span>
                </div>
                <div className="bg-[#101A16] border border-[#16E6A5]/10 p-4 rounded-xl">
                  <p className="text-xs text-[#A2B2AA]">Operating Expenses</p>
                  <p className="text-lg font-bold text-amber-400 mt-1">KES 4,200.00</p>
                  <span className="text-[10px] text-[#A2B2AA]">Packaging & Delivery</span>
                </div>
                <div className="bg-[#101A16] border border-[#16E6A5]/10 p-4 rounded-xl">
                  <p className="text-xs text-[#A2B2AA]">Estimated Net Margin</p>
                  <p className="text-lg font-bold text-[#35D9EA] mt-1">KES 13,650.00</p>
                  <span className="text-[10px] text-[#A2B2AA]">Cost of goods accounted</span>
                </div>
                <div className="bg-[#101A16] border border-[#16E6A5]/10 p-4 rounded-xl">
                  <p className="text-xs text-[#A2B2AA]">Customer Balances Due</p>
                  <p className="text-lg font-bold text-rose-400 mt-1">KES 1,500.00</p>
                  <span className="text-[10px] text-[#A2B2AA]">1 active credit account</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {stkState !== 'IDLE' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101A16] border border-[#16E6A5]/30 rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl space-y-4">
            {stkState === 'WAITING_FOR_PAYMENT' && (
              <>
                <Loader2 className="w-12 h-12 text-[#16E6A5] animate-spin mx-auto" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#F3F7F4]">Enter M-Pesa PIN</h3>
                <p className="text-xs text-[#A2B2AA]">
                  STK prompt sent to <span className="text-[#16E6A5] font-mono font-semibold">{customerPhone}</span>. Awaiting buyer handset confirmation...
                </p>
                <div className="p-3 bg-[#15231D] rounded-xl text-xs font-mono text-[#16E6A5]">
                  Amount: KES {cartTotal.toLocaleString()}
                </div>
              </>
            )}

            {stkState === 'APPROVED' && (
              <>
                <CheckCircle className="w-12 h-12 text-[#16E6A5] mx-auto animate-bounce" />
                <h3 className="text-base font-bold text-[#16E6A5]">PAYMENT APPROVED</h3>
                <div className="bg-[#15231D] p-3 rounded-xl text-left text-xs font-mono space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#A2B2AA]">M-Pesa Ref:</span>
                    <span className="text-[#F3F7F4] font-bold">{stkReceiptNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A2B2AA]">Amount:</span>
                    <span className="text-[#16E6A5]">KES {cartTotal.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setReceiptData({
                        receiptNumber: `RCP-${Date.now().toString().slice(-6)}`,
                        businessName: 'Savannah Tech & Retail',
                        date: new Date().toISOString(),
                        items: cart.map(i => ({ name: i.product.name, qty: i.quantity, total: i.product.selling_price * i.quantity })),
                        total: cartTotal,
                        paymentMethod: 'MPESA_STK',
                        ref: stkReceiptNumber
                      });
                      setStkState('IDLE');
                      setCart([]);
                    }}
                    className="flex-1 py-2 bg-[#15231D] hover:bg-[#15231D]/80 border border-[#16E6A5]/20 text-xs font-semibold rounded-lg flex items-center justify-center space-x-1"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>View Receipt</span>
                  </button>
                  <button
                    onClick={() => {
                      setStkState('IDLE');
                      setCart([]);
                    }}
                    className="flex-1 py-2 bg-[#16E6A5] hover:bg-[#16E6A5]/90 text-black text-xs font-bold rounded-lg"
                  >
                    Done
                  </button>
                </div>
              </>
            )}

            {stkState === 'DENIED' && (
              <>
                <XCircle className="w-12 h-12 text-rose-500 mx-auto" />
                <h3 className="text-base font-bold text-rose-500">PAYMENT DENIED</h3>
                <p className="text-xs text-[#A2B2AA]">The customer cancelled the prompt on their phone.</p>
                <button
                  onClick={() => setStkState('IDLE')}
                  className="w-full py-2 bg-[#15231D] text-[#F3F7F4] text-xs font-semibold rounded-lg border border-[#16E6A5]/20"
                >
                  Dismiss
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {receiptData && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101A16] border border-[#16E6A5]/20 rounded-2xl max-w-sm w-full p-6 text-xs text-[#F3F7F4] shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-[#16E6A5]/10 no-print">
              <span className="font-bold text-[#16E6A5]">Official Receipt</span>
              <button onClick={() => setReceiptData(null)} className="text-[#A2B2AA] hover:text-[#F3F7F4]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div id="receipt-print-area" className="my-4 font-mono space-y-3 bg-[#060908] p-4 rounded-xl border border-[#16E6A5]/10">
              <div className="text-center space-y-1">
                <h3 className="font-bold text-sm text-[#F3F7F4] uppercase">{receiptData.businessName}</h3>
                <p className="text-[10px] text-[#A2B2AA]">Ref: {receiptData.receiptNumber}</p>
                <p className="text-[10px] text-[#A2B2AA]">{new Date(receiptData.date).toLocaleString('en-KE')}</p>
              </div>

              <div className="border-t border-dashed border-[#16E6A5]/20 pt-2 space-y-1">
                {receiptData.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-[11px]">
                    <span className="truncate pr-2">{item.qty}x {item.name}</span>
                    <span>KES {item.total?.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-[#16E6A5]/20 pt-2 space-y-1 text-[11px]">
                <div className="flex justify-between font-bold text-[#16E6A5]">
                  <span>TOTAL PAID</span>
                  <span>KES {receiptData.total?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[10px] text-[#A2B2AA]">
                  <span>Method</span>
                  <span>{receiptData.paymentMethod}</span>
                </div>
                {receiptData.ref && (
                  <div className="flex justify-between text-[10px] text-[#A2B2AA]">
                    <span>Reference</span>
                    <span className="text-[#D4B16A]">{receiptData.ref}</span>
                  </div>
                )}
              </div>

              <p className="text-center text-[9px] text-[#A2B2AA] pt-2 border-t border-dashed border-[#16E6A5]/20">
                Thank you for your business! Asante sana.
              </p>
            </div>

            <div className="flex space-x-2 no-print">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-[#15231D] hover:bg-[#15231D]/80 border border-[#16E6A5]/20 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
              <button
                onClick={() => setReceiptData(null)}
                className="flex-1 py-2.5 bg-[#16E6A5] text-black rounded-xl text-xs font-bold hover:bg-[#16E6A5]/90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
