const API_BASE = '/api';

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
    return data.products || [];
  } catch (err) {
    console.error('Error fetching products:', err);
    throw err;
  }
};

export const fetchProductById = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) throw new Error('Product not found');
    const data = await res.json();
    return data.product;
  } catch (err) {
    console.error('Error fetching product:', err);
    throw err;
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
  const res = await fetch(`${API_BASE}/admin/products`);
  const data = await res.json();
  return data.products || [];
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

export const deleteAdminProduct = async (id) => {
  const res = await fetch(`${API_BASE}/admin/products?id=${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete product');
  return data;
};

export const fetchAdminStaff = async () => {
  const res = await fetch(`${API_BASE}/admin/staff`);
  const data = await res.json();
  return data.staff || [];
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
  return data;
};

export const fetchAdminPayments = async () => {
  const res = await fetch(`${API_BASE}/admin/payments`);
  const data = await res.json();
  return data.payments || [];
};

export const fetchAdminLogs = async () => {
  const res = await fetch(`${API_BASE}/admin/logs`);
  const data = await res.json();
  return data;
};

export const fetchProductReviews = async () => {
  const res = await fetch(`${API_BASE}/reviews`);
  const data = await res.json();
  return data.reviews || [];
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
  const res = await fetch(`${API_BASE}/admin/profile`);
  const data = await res.json();
  return data.profile || {};
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
  const res = await fetch(`${API_BASE}/chat/threads`);
  const data = await res.json();
  return data.threads || [];
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




