const API_BASE = '/api';

const FALLBACK_PRODUCTS = [
  {
    id: "iphone-16-pro-max",
    name: "iPhone 16 Pro Max",
    category: "iPhone",
    series: "16 Pro",
    tagline: "Hello, Apple Intelligence.",
    price: 144900,
    rating: 4.9,
    reviewCount: 342,
    isNew: true,
    featured: true,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
    description: "Forged in Grade 5 Titanium. Powered by A18 Pro chip. Features Camera Control button, 48MP Fusion camera, and 4K 120 fps Dolby Vision.",
    storageOptions: [
      { size: "256GB", price: 144900 },
      { size: "512GB", price: 164900 },
      { size: "1TB", price: 184900 }
    ],
    colors: [
      { name: "Desert Titanium", hex: "#b38b6d", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80" },
      { name: "Natural Titanium", hex: "#86868b", image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80" },
      { name: "White Titanium", hex: "#f5f5f7", image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80" },
      { name: "Black Titanium", hex: "#1c1c1e", image: "https://images.unsplash.com/photo-1574944985070-8f30c4397220?auto=format&fit=crop&w=800&q=80" }
    ],
    specs: { display: "6.9\" Super Retina XDR ProMotion", chip: "A18 Pro with 6-core GPU", camera: "48MP Fusion + 48MP Ultra Wide + 5x Telephoto", battery: "Up to 33 hours video playback" }
  },
  {
    id: "iphone-16-pro",
    name: "iPhone 16 Pro",
    category: "iPhone",
    series: "16 Pro",
    tagline: "Ultimate Pro performance.",
    price: 119900,
    rating: 4.8,
    reviewCount: 218,
    isNew: true,
    featured: true,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80",
    description: "Grade 5 Titanium frame, A18 Pro chip, 6.3-inch Super Retina XDR display with ProMotion 120Hz.",
    storageOptions: [
      { size: "128GB", price: 119900 },
      { size: "256GB", price: 129900 },
      { size: "512GB", price: 149900 }
    ],
    colors: [
      { name: "Desert Titanium", hex: "#b38b6d", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80" },
      { name: "Natural Titanium", hex: "#86868b", image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80" }
    ],
    specs: { display: "6.3\" Super Retina XDR ProMotion", chip: "A18 Pro", camera: "48MP Fusion + 48MP Ultra Wide", battery: "Up to 27 hours video playback" }
  },
  {
    id: "iphone-16",
    name: "iPhone 16",
    category: "iPhone",
    series: "16",
    tagline: "Built for Apple Intelligence.",
    price: 79900,
    rating: 4.7,
    reviewCount: 184,
    isNew: true,
    featured: true,
    image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80",
    description: "Vibrant colors infused with color-infused glass back, Action button, Camera Control, and A18 chip.",
    storageOptions: [
      { size: "128GB", price: 79900 },
      { size: "256GB", price: 89900 },
      { size: "512GB", price: 109900 }
    ],
    colors: [
      { name: "Ultramarine", hex: "#4b6cc1", image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80" },
      { name: "Teal", hex: "#52a399", image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80" },
      { name: "Pink", hex: "#e498b3", image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80" }
    ],
    specs: { display: "6.1\" Super Retina XDR", chip: "A18", camera: "48MP Fusion + 12MP Ultra Wide", battery: "Up to 22 hours video playback" }
  },
  {
    id: "macbook-pro-16-m3",
    name: "MacBook Pro 16\" M3 Max",
    category: "MacBook",
    series: "MacBook Pro",
    tagline: "Mind-blowing. Head-turning.",
    price: 349900,
    rating: 4.95,
    reviewCount: 96,
    isNew: true,
    featured: true,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    description: "Liquid Retina XDR display, up to 128GB unified memory, Space Black finish with anodization seal.",
    storageOptions: [
      { size: "1TB SSD", price: 349900 },
      { size: "2TB SSD", price: 389900 }
    ],
    colors: [
      { name: "Space Black", hex: "#2c2c2e", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80" },
      { name: "Silver", hex: "#e3e3e4", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80" }
    ],
    specs: { display: "16.2\" Liquid Retina XDR", chip: "M3 Max 16-Core CPU", camera: "1080p FaceTime HD", battery: "Up to 22 hours battery life" }
  }
];

export const fetchProducts = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== 'all') params.append('category', filters.category);
    if (filters.series && filters.series !== 'all') params.append('series', filters.series);
    if (filters.search) params.append('search', filters.search);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

    const res = await fetch(`${API_BASE}/products?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    return data.products || FALLBACK_PRODUCTS;
  } catch (err) {
    console.warn('API fetch notice, using fallback products:', err);
    let list = [...FALLBACK_PRODUCTS];
    if (filters.category && filters.category !== 'all') {
      list = list.filter(p => p.category.toLowerCase() === filters.category.toLowerCase());
    }
    if (filters.series && filters.series !== 'all') {
      list = list.filter(p => p.series.toLowerCase() === filters.series.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (filters.maxPrice) {
      list = list.filter(p => p.price <= filters.maxPrice);
    }
    return list;
  }
};

export const fetchProductById = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) throw new Error('Product not found');
    const data = await res.json();
    return data.product;
  } catch (err) {
    console.warn('API fetch notice, finding product in fallback:', err);
    return FALLBACK_PRODUCTS.find(p => p.id === id) || FALLBACK_PRODUCTS[0];
  }
};

export const sendSiriChatMessage = async (message, history = []) => {
  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, history }),
    });

    if (!res.ok) {
      throw new Error('Siri AI backend error');
    }

    const data = await res.json();
    return data.reply;
  } catch (err) {
    console.error('Siri API Error:', err);
    return "I'm having trouble connecting to my server. Please ensure the Python Flask backend is running on port 5000.";
  }
};

export const fetchStoreLocations = async (region = 'all') => {
  try {
    const res = await fetch(`${API_BASE}/stores?region=${region}`);
    if (!res.ok) throw new Error('Failed to fetch store locations');
    const data = await res.json();
    return data.stores || [];
  } catch (err) {
    console.error('Error fetching store locations:', err);
    throw err;
  }
};

export const sendContactMessage = async (contactData) => {
  try {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to submit contact message');
    return data;
  } catch (err) {
    console.error('Error submitting contact message:', err);
    throw err;
  }
};

export const fetchInboxMessages = async () => {
  try {
    const res = await fetch(`${API_BASE}/inbox`);
    if (!res.ok) throw new Error('Failed to fetch inbox messages');
    const data = await res.json();
    return data.messages || [];
  } catch (err) {
    console.error('Error fetching inbox messages:', err);
    return [];
  }
};

export const calculateTradeInValue = async (tradeInData) => {
  try {
    const res = await fetch(`${API_BASE}/trade-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tradeInData),
    });
    if (!res.ok) throw new Error('Failed to calculate trade-in value');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Error calculating trade-in value:', err);
    throw err;
  }
};

// ==========================================
// ADMIN & OWNER PORTAL API CALLS
// ==========================================

export const adminLogin = async (credentials) => {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data;
};

export const fetchAdminProducts = async () => {
  try {
    const res = await fetch(`${API_BASE}/admin/products`);
    if (!res.ok) throw new Error('Failed to fetch admin products');
    const data = await res.json();
    return data.products || [];
  } catch (err) {
    console.error('Error fetching admin products:', err);
    return [];
  }
};

export const addAdminProduct = async (productData) => {
  const res = await fetch(`${API_BASE}/admin/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to add product');
  return data;
};

export const updateAdminProduct = async (productData) => {
  const res = await fetch(`${API_BASE}/admin/products`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update product');
  return data;
};

export const deleteAdminProduct = async (id) => {
  const res = await fetch(`${API_BASE}/admin/products?id=${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete product');
  return data;
};

export const fetchAdminStaff = async () => {
  try {
    const res = await fetch(`${API_BASE}/admin/staff`);
    if (!res.ok) throw new Error('Failed to fetch staff roster');
    const data = await res.json();
    return data.staff || [];
  } catch (err) {
    console.error('Error fetching admin staff:', err);
    return [];
  }
};

export const addAdminStaff = async (staffData) => {
  const res = await fetch(`${API_BASE}/admin/staff`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(staffData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to add staff member');
  return data;
};

export const updateAdminStaffStatus = async (id, status) => {
  const res = await fetch(`${API_BASE}/admin/staff`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update staff status');
  return data;
};

export const fetchAdminPayments = async () => {
  try {
    const res = await fetch(`${API_BASE}/admin/payments`);
    if (!res.ok) throw new Error('Failed to fetch payment logs');
    const data = await res.json();
    return data.payments || [];
  } catch (err) {
    console.error('Error fetching admin payments:', err);
    return [];
  }
};

export const fetchAdminLogs = async () => {
  try {
    const res = await fetch(`${API_BASE}/admin/logs`);
    if (!res.ok) throw new Error('Failed to fetch admin logs');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Error fetching admin logs:', err);
    return { adminLogs: [], supportInquiries: [] };
  }
};

export const fetchProductReviews = async () => {
  try {
    const res = await fetch(`${API_BASE}/reviews`);
    if (!res.ok) throw new Error('Failed to fetch product reviews');
    const data = await res.json();
    return data.reviews || [];
  } catch (err) {
    console.error('Error fetching product reviews:', err);
    return [];
  }
};

export const submitProductReview = async (reviewData) => {
  const res = await fetch(`${API_BASE}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to submit review');
  return data;
};

export const deleteProductReview = async (id) => {
  const res = await fetch(`${API_BASE}/reviews?id=${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete review');
  return data;
};

export const fetchOwnerProfile = async () => {
  try {
    const res = await fetch(`${API_BASE}/admin/profile`);
    if (!res.ok) throw new Error('Failed to fetch owner profile');
    const data = await res.json();
    return data.profile || {};
  } catch (err) {
    console.error('Error fetching owner profile:', err);
    return {};
  }
};

export const updateOwnerProfile = async (profileData) => {
  const res = await fetch(`${API_BASE}/admin/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profileData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update profile');
  return data;
};

export const fetchChatThreads = async () => {
  try {
    const res = await fetch(`${API_BASE}/chat/threads`);
    if (!res.ok) throw new Error('Failed to fetch chat threads');
    const data = await res.json();
    return data.threads || [];
  } catch (err) {
    console.error('Error fetching chat threads:', err);
    return [];
  }
};

export const sendChatReply = async (threadId, text, staffName) => {
  const res = await fetch(`${API_BASE}/chat/reply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ threadId, text, staffName }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to send reply');
  return data;
};

export const sendCustomerChatMessage = async (chatData) => {
  const res = await fetch(`${API_BASE}/chat/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(chatData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to send message');
  return data;
};

export const connectMongoDB = async (password, uri) => {
  const res = await fetch(`${API_BASE}/admin/connect-mongodb`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password, uri }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to connect to MongoDB Atlas');
  return data;
};




