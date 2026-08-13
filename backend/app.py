import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import json
import datetime
import random
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import requests

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Load product data
PRODUCTS_FILE = os.path.join(os.path.dirname(__file__), 'data', 'products.json')
with open(PRODUCTS_FILE, 'r', encoding='utf-8') as f:
    PRODUCTS_DATA = json.load(f)

from db import (
    get_mongo_db, save_contact_message, save_chat_log, get_contact_messages,
    get_staff_list, add_staff_member, update_staff_status,
    get_payment_logs, save_payment_log, log_admin_action, get_admin_logs,
    get_customer_reviews, add_customer_review, delete_customer_review,
    get_owner_profile, update_owner_profile, get_chat_threads, send_chat_reply,
    add_customer_chat_message, seed_database
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MONGODB_URI = os.getenv("MONGODB_URI")




STORES_DATA = [
    {
        "id": "bkc-mumbai",
        "name": "Apple BKC",
        "city": "Mumbai",
        "country": "India",
        "region": "India",
        "address": "G1-G2, Jio World Drive, BKC, Bandra East, Mumbai, Maharashtra 400051",
        "lat": 19.0653,
        "lng": 72.8687,
        "phone": "+91 22 6123 4500",
        "hours": "11:00 AM - 10:00 PM Daily",
        "status": "Open Now • Closes at 10:00 PM",
        "tagline": "India's First Apple Flagship Store",
        "image": "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=800&q=80",
        "features": ["Genius Bar", "Today at Apple", "Pickup Available", "Trade-In Desk"]
    },
    {
        "id": "saket-delhi",
        "name": "Apple Saket",
        "city": "New Delhi",
        "country": "India",
        "region": "India",
        "address": "F-11, Select CITYWALK, District Centre, Saket, New Delhi, Delhi 110017",
        "lat": 28.5286,
        "lng": 77.2191,
        "phone": "+91 11 4123 7800",
        "hours": "10:00 AM - 10:00 PM Daily",
        "status": "Open Now • Closes at 10:00 PM",
        "tagline": "Capital Flagship at Select CITYWALK",
        "image": "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80",
        "features": ["Genius Bar", "Today at Apple", "Trade-In", "Business Team"]
    },
    {
        "id": "apple-park",
        "name": "Apple Park Visitor Center",
        "city": "Cupertino",
        "country": "USA",
        "region": "USA",
        "address": "10600 N Tantau Ave, Cupertino, CA 95014, United States",
        "lat": 37.3349,
        "lng": -122.0090,
        "phone": "+1 408-961-1560",
        "hours": "9:00 AM - 7:00 PM PST",
        "status": "Open • Closes at 7:00 PM PST",
        "tagline": "Apple Headquarters Visitor Experience",
        "image": "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
        "features": ["AR Experience", "Genius Bar", "Exclusive HQ Merchandise", "Caffe Macs"]
    },
    {
        "id": "fifth-avenue",
        "name": "Apple Fifth Avenue",
        "city": "New York",
        "country": "USA",
        "region": "USA",
        "address": "767 5th Ave, New York, NY 10153, United States",
        "lat": 40.7635,
        "lng": -73.9734,
        "phone": "+1 212-336-1440",
        "hours": "24 Hours / 7 Days a Week",
        "status": "Open 24/7",
        "tagline": "The Iconic Glass Cube on 5th Avenue",
        "image": "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80",
        "features": ["Open 24/7", "Genius Plaza", "Today at Apple Studio", "Personal Setup"]
    },
    {
        "id": "regent-street",
        "name": "Apple Regent Street",
        "city": "London",
        "country": "United Kingdom",
        "region": "UK",
        "address": "235 Regent St., London W1B 2EL, United Kingdom",
        "lat": 51.5141,
        "lng": -0.1412,
        "phone": "+44 20 7153 9000",
        "hours": "10:00 AM - 8:00 PM GMT",
        "status": "Open Now • Closes at 8:00 PM",
        "tagline": "Apple Europe Flagship",
        "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
        "features": ["Genius Grove", "Today at Apple Forum", "Personal Shopping", "Support"]
    },
    {
        "id": "marina-bay",
        "name": "Apple Marina Bay Sands",
        "city": "Singapore",
        "country": "Singapore",
        "region": "Asia Pacific",
        "address": "2 Bayfront Ave, B2-06, Singapore 018972",
        "lat": 1.2838,
        "lng": 103.8591,
        "phone": "+65 1800 692 7753",
        "hours": "10:00 AM - 10:00 PM SGT",
        "status": "Open Now • Closes at 10:00 PM",
        "tagline": "The Floating Glass Dome on Marina Bay",
        "image": "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=800&q=80",
        "features": ["Floating Sphere Store", "Underwater Boardroom", "Genius Bar", "Pickup"]
    }
]

def get_product_context():
    """Generates a text summary of all products for the AI system prompt."""
    lines = []
    for p in PRODUCTS_DATA:
        storage_str = ", ".join([f"{s['size']}: ₹{s['price']:,}" for s in p['storageOptions']])
        colors_str = ", ".join([c['name'] for c in p['colors']])
        lines.append(
            f"- Product: {p['name']} (ID: {p['id']})\n"
            f"  Series: {p['series']} | Tagline: \"{p['tagline']}\"\n"
            f"  Starting Price: ₹{p['price']:,} | Rating: {p['rating']}⭐ ({p['reviewCount']} reviews)\n"
            f"  Storage & Pricing: {storage_str}\n"
            f"  Colors Available: {colors_str}\n"
            f"  Key Specs: Display ({p['specs']['display']}), Chip ({p['specs']['chip']}), Camera ({p['specs']['camera']}), Battery ({p['specs']['battery']})\n"
            f"  Description: {p['description']}\n"
        )
    return "\n".join(lines)

SYSTEM_PROMPT = f"""You are Siri, Apple's official AI assistant on the ani Apple Store web app owned and founded by Andrew.
Your personality is warm, elegant, concise, highly intelligent, and authentically Apple-inspired.
You speak with clarity, modern tone, and enthusiasm for technology.

Store Owner & Founder: Andrew

Here is the current official product catalog across all Apple categories (iPhones, MacBooks, iPads, Apple Watches, AirPods) and pricing in Indian Rupees (₹):
{get_product_context()}

EMI Calculation Policy (No Cost & Bank Offers):
- 3 Months No Cost EMI: Price / 3 per month (0% interest)
- 6 Months No Cost EMI: Price / 6 per month (0% interest)
- 12 Months No Cost EMI: Price / 12 per month (0% interest)
- 24 Months Low Cost EMI: Approx (Price * 1.14) / 24 per month
- HDFC & ICICI Credit Cards: Instant ₹5,000 to ₹10,000 instant cashback on 6+ month EMIs!

Store Policies:
- Shipping: Free Express Next-Day Delivery across India.
- Trade-In: Get up to ₹67,500 credit when trading in iPhone, Mac, or iPad devices.
- AppleCare+: Available for all devices with unlimited accidental damage protection.
- Returns: 14-day hassle-free return policy.

Instructions:
1. Keep answers concise, helpful, and formatted with clean bullet points or bold text.
2. When asked about ANY product price, ALWAYS include the exact price in ₹ AND the EMI monthly cost breakdown (e.g. 3-mo, 6-mo, 12-mo No Cost EMI per month).
3. Suggest products tailored to user needs (e.g. photography -> iPhone 16 Pro Max, portability -> MacBook Air 15", heavy AI work -> iPad Pro 13" M4, fitness -> Apple Watch Ultra 2).
4. If asked "Who is the owner?" or "Who created this store?", state proudly that this store is owned and curated by Andrew.
5. Maintain session history context when answering follow-up questions.
"""

def generate_siri_response(user_message, chat_history=[]):
    """Calls Gemini API using google-genai or direct REST requests, with Groq API as fallback."""
    if GEMINI_API_KEY:
        # Try using google-genai SDK first
        try:
            from google import genai
            client = genai.Client(api_key=GEMINI_API_KEY)
            
            contents = [SYSTEM_PROMPT]
            for msg in chat_history[-6:]:
                role_prefix = "User: " if msg.get('sender') == 'user' else "Siri: "
                contents.append(f"{role_prefix}{msg.get('text', '')}")
            contents.append(f"User: {user_message}\nSiri:")

            response = client.models.generate_content(
                model='gemini-2.0-flash',
                contents="\n\n".join(contents)
            )
            if response and response.text:
                return response.text.strip()
        except Exception as e:
            print(f"GenAI SDK notice (falling back to REST API): {e}")

    # Fallback to direct Gemini REST API call
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"

        contents_payload = []
        contents_payload.append({
            "role": "user",
            "parts": [{"text": SYSTEM_PROMPT}]
        })
        contents_payload.append({
            "role": "model",
            "parts": [{"text": "Understood. I am Siri, ready to assist customers with Apple products, prices in Indian Rupees (₹), specifications, and support."}]
        })

        for msg in chat_history[-6:]:
            role = "user" if msg.get('sender') == 'user' else "model"
            contents_payload.append({
                "role": role,
                "parts": [{"text": msg.get('text', '')}]
            })

        contents_payload.append({
            "role": "user",
            "parts": [{"text": user_message}]
        })

        payload = {"contents": contents_payload}
        headers = {"Content-Type": "application/json"}
        
        res = requests.post(url, json=payload, headers=headers, timeout=15)
        if res.status_code == 200:
            data = res.json()
            candidates = data.get('candidates', [])
            if candidates and 'content' in candidates[0]:
                parts = candidates[0]['content'].get('parts', [])
                if parts:
                    return parts[0].get('text', '').strip()
        print(f"Gemini REST error: {res.status_code} - {res.text}")
    except Exception as e:
        print(f"REST API call notice: {e}")

    # Fallback to Groq / generate_ai_chat_response if available
    try:
        groq_reply = generate_ai_chat_response(user_message, persona="Siri AI Assistant")
        if groq_reply and "Namaste! Thank you for reaching out" not in groq_reply:
            return groq_reply
    except Exception:
        pass

    # Fallback pattern matchers if offline/rate-limited
    query_lower = user_message.lower()
    if "price" in query_lower or "cost" in query_lower or "how much" in query_lower:
        if "16 pro max" in query_lower:
            return "The **iPhone 16 Pro Max** starts at **₹1,44,900** for 256GB, **₹1,64,900** for 512GB, and **₹1,84,900** for 1TB."
        if "16 pro" in query_lower:
            return "The **iPhone 16 Pro** starts at **₹1,19,900** for 128GB, **₹1,29,900** for 256GB, **₹1,49,900** for 512GB, and **₹1,69,900** for 1TB."
        if "16 plus" in query_lower:
            return "The **iPhone 16 Plus** starts at **₹89,900** for 128GB, **₹99,900** for 256GB, and **₹1,19,900** for 512GB."
        if "16" in query_lower:
            return "The **iPhone 16** starts at **₹79,900** for 128GB, **₹89,900** for 256GB, and **₹1,09,900** for 512GB."
        if "se" in query_lower:
            return "The **iPhone SE (3rd Gen)** starts at **₹47,600** for 64GB, **₹52,600** for 128GB, and **₹62,600** for 256GB."
        return "Here are starting prices in India:\n• iPhone SE: **₹47,600**\n• iPhone 15: **₹69,900**\n• iPhone 16: **₹79,900**\n• iPhone 16 Plus: **₹89,900**\n• iPhone 16 Pro: **₹1,19,900**\n• iPhone 16 Pro Max: **₹1,44,900**"

    return "Namaste! I am Siri. How can I help you choose the perfect iPhone today? Ask me about prices in Indian Rupees (₹), camera specs, storage, or trade-in credit."

@app.route('/')
@app.route('/api')
@app.route('/api/health')
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "Apple AI Store API",
        "routes": ["/api/products", "/api/stores", "/api/contact", "/api/chat", "/api/inbox", "/api/trade-in"]
    })

@app.route('/api/products', methods=['GET'])
def get_products():
    category = request.args.get('category')
    series = request.args.get('series')
    search = request.args.get('search', '').lower()
    min_price = request.args.get('minPrice', type=float)
    max_price = request.args.get('maxPrice', type=float)

    filtered = PRODUCTS_DATA
    db = get_mongo_db()
    if db is not None:
        try:
            items = list(db['products'].find({}, {'_id': 0}))
            if items:
                filtered = items
        except Exception:
            pass

    if category and category != 'all':
        filtered = [p for p in filtered if p.get('category', '').lower() == category.lower()]

    if series and series != 'all':
        filtered = [p for p in filtered if p.get('series', '').lower() == series.lower()]

    if search:
        filtered = [
            p for p in filtered
            if search in p.get('name', '').lower()
            or search in p.get('description', '').lower()
            or search in p.get('tagline', '').lower()
        ]

    if min_price is not None:
        filtered = [p for p in filtered if p.get('price', 0) >= min_price]

    if max_price is not None:
        filtered = [p for p in filtered if p.get('price', 0) <= max_price]

    return jsonify({
        "status": "success",
        "count": len(filtered),
        "products": filtered
    })

@app.route('/api/products/<product_id>', methods=['GET'])
def get_product(product_id):
    db = get_mongo_db()
    if db is not None:
        try:
            p = db['products'].find_one({"id": product_id}, {'_id': 0})
            if p:
                return jsonify({"status": "success", "product": p})
        except Exception:
            pass
    product = next((p for p in PRODUCTS_DATA if p['id'] == product_id), None)
    if product:
        return jsonify({"status": "success", "product": product})
    return jsonify({"status": "error", "message": "Product not found"}), 404

@app.route('/api/stores', methods=['GET'])
def get_stores():
    region = request.args.get('region')
    if region and region.lower() != 'all':
        filtered = [s for s in STORES_DATA if s['region'].lower() == region.lower() or s['country'].lower() == region.lower()]
        return jsonify({"status": "success", "count": len(filtered), "stores": filtered})
    return jsonify({"status": "success", "count": len(STORES_DATA), "stores": STORES_DATA})

@app.route('/api/contact', methods=['POST'])
def handle_contact():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    topic = data.get('topic', 'General Inquiry')
    message = data.get('message', '').strip()
    store = data.get('storeLocation', 'Apple BKC Mumbai')
    priority = data.get('priority', 'Normal')

    if not name or not email or not message:
        return jsonify({"status": "error", "message": "Name, Email, and Message are required."}), 400

    import random
    import datetime
    ticket_id = f"APL-{random.randint(100000, 999999)}"
    timestamp = datetime.datetime.utcnow().isoformat() + "Z"
    target_email = "louieandrew11@gmail.com"

    message_record = {
        "ticketId": ticket_id,
        "timestamp": timestamp,
        "name": name,
        "email": email,
        "targetRecipient": target_email,
        "topic": topic,
        "storeLocation": store,
        "priority": priority,
        "message": message,
        "deliveryStatus": "Sent to louieandrew11@gmail.com"
    }

    # Persist message to MongoDB Atlas if connected
    save_contact_message(message_record)

    # Persist message to data/contact_messages.json
    try:
        contact_file = os.path.join(os.path.dirname(__file__), 'data', 'contact_messages.json')
        existing = []
        if os.path.exists(contact_file):
            try:
                with open(contact_file, 'r', encoding='utf-8') as cf:
                    existing = json.load(cf)
            except Exception:
                existing = []
        existing.append(message_record)
        with open(contact_file, 'w', encoding='utf-8') as cf:
            json.dump(existing, cf, indent=2)
    except Exception as e:
        print(f"Error persisting contact message: {e}")


    # Optional real SMTP sending if credentials provided in .env
    smtp_server = os.getenv("SMTP_SERVER")
    smtp_port = os.getenv("SMTP_PORT")
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASS")

    if smtp_server and smtp_user and smtp_pass:
        try:
            import smtplib
            from email.mime.text import MIMEText
            from email.mime.multipart import MIMEMultipart

            msg = MIMEMultipart()
            msg['From'] = smtp_user
            msg['To'] = target_email
            msg['Subject'] = f"[{ticket_id}] Apple Store Support Inquiry from {name}"
            
            body = f"""New Support Inquiry Received:

Ticket ID: {ticket_id}
Customer Name: {name}
Customer Email: {email}
Topic: {topic}
Preferred Store: {store}
Priority: {priority}

Message:
{message}

---
Delivered via ani Apple Store Support System to {target_email}
"""
            msg.attach(MIMEText(body, 'plain'))
            server = smtplib.SMTP(smtp_server, int(smtp_port or 587))
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.send_message(msg)
            server.quit()
            print(f"Successfully dispatched SMTP email to {target_email}")
        except Exception as smtp_err:
            print(f"SMTP notification notice (logged locally): {smtp_err}")

    return jsonify({
        "status": "success",
        "message": f"Your message has been sent directly to Louie Andrew ({target_email}). An Apple Specialist will respond to {email} within 24 hours.",
        "ticketId": ticket_id,
        "targetRecipient": target_email,
        "timestamp": timestamp
    })

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json() or {}
    message = data.get('message', '').strip()
    history = data.get('history', [])

    if not message:
        return jsonify({"status": "error", "message": "Message is required"}), 400

    reply = generate_siri_response(message, history)
    
    # Optionally save Siri chat log to MongoDB Atlas
    db = get_mongo_db()
    if db is not None:
        try:
            db['chat_logs'].insert_one({
                "user_message": message,
                "siri_reply": reply,
                "timestamp": datetime.datetime.utcnow().isoformat() + "Z"
            })
        except Exception:
            pass

    return jsonify({
        "status": "success",
        "reply": reply,
        "bot": "Siri"
    })

@app.route('/api/inbox', methods=['GET'])
def get_inbox():
    """Returns all support messages sent to louieandrew11@gmail.com."""
    # Try MongoDB Atlas first
    items = get_contact_messages()
    if items is not None:
        return jsonify({"status": "success", "source": "MongoDB Atlas", "count": len(items), "messages": items})

    # Fallback to data/contact_messages.json
    contact_file = os.path.join(os.path.dirname(__file__), 'data', 'contact_messages.json')
    if os.path.exists(contact_file):
        try:
            with open(contact_file, 'r', encoding='utf-8') as cf:
                data = json.load(cf)
                return jsonify({"status": "success", "source": "Local JSON Logs", "count": len(data), "messages": list(reversed(data))})
        except Exception:
            pass

    return jsonify({"status": "success", "source": "Empty", "count": 0, "messages": []})

@app.route('/api/trade-in', methods=['POST'])
def calculate_tradein():
    """Calculates instant trade-in value credit in Indian Rupees (₹)."""
    data = request.get_json() or {}
    device = data.get('device', 'iPhone 14 Pro').strip()
    condition = data.get('condition', 'Good').strip()
    storage = data.get('storage', '128GB').strip()

    base_values = {
        'iPhone 15 Pro Max': 67500,
        'iPhone 15 Pro': 58000,
        'iPhone 15 Plus': 42000,
        'iPhone 15': 38000,
        'iPhone 14 Pro Max': 48000,
        'iPhone 14 Pro': 41500,
        'iPhone 14 Plus': 31000,
        'iPhone 14': 27500,
        'iPhone 13 Pro Max': 36000,
        'iPhone 13 Pro': 31500,
        'iPhone 13': 22500,
        'iPhone 12 Pro': 20000,
        'iPhone 12': 15500,
        'iPhone SE (3rd Gen)': 12000
    }

    estimated_credit = base_values.get(device, 25000)
    
    # Condition adjustments
    if condition == 'Flawless':
        estimated_credit = int(estimated_credit * 1.1)
    elif condition == 'Fair':
        estimated_credit = int(estimated_credit * 0.8)
    elif condition == 'Damaged':
        estimated_credit = int(estimated_credit * 0.5)

    # Storage adjustments
    if '512GB' in storage or '1TB' in storage:
        estimated_credit += 4000
    elif '256GB' in storage:
        estimated_credit += 2000

    return jsonify({
        "status": "success",
        "device": device,
        "condition": condition,
        "storage": storage,
        "estimatedCreditRupees": estimated_credit,
        "formattedCredit": f"₹{estimated_credit:,}",
        "currency": "INR (₹)"
    })

# ==========================================
# OWNER & ADMIN PORTAL API ENDPOINTS
# ==========================================

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    """Authenticates store owner / administrator credentials."""
    data = request.get_json() or {}
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()

    # Default owner credentials
    if (username == 'admin' or username == 'owner@apple.com') and (password == 'apple123' or password == 'admin'):
        token = "APL-ADMIN-TOKEN-89412389"
        log_admin_action("Owner Portal Login", f"Successful login by username: '{username}'")
        return jsonify({
            "status": "success",
            "message": "Welcome to ani Apple Store Owner Portal",
            "token": token,
            "user": {
                "name": "Apple Store Owner",
                "email": "owner@apple.com",
                "role": "Owner & Chief Executive"
            }
        })
    
    log_admin_action("Failed Login Attempt", f"Invalid credentials supplied for username: '{username}'")
    return jsonify({"status": "error", "message": "Invalid Username or Password."}), 401

@app.route('/api/admin/products', methods=['GET', 'POST', 'PUT', 'DELETE'])
def admin_products():
    """Manages products in store catalog (Get list, Add item, Delete item)."""
    global PRODUCTS_DATA
    if request.method == 'GET':
        db = get_mongo_db()
        if db is not None:
            try:
                items = list(db['products'].find({}, {'_id': 0}))
                if items:
                    return jsonify({"status": "success", "count": len(items), "products": items})
            except Exception:
                pass
        return jsonify({"status": "success", "count": len(PRODUCTS_DATA), "products": PRODUCTS_DATA})

    if request.method == 'POST':
        data = request.get_json() or {}
        name = data.get('name', '').strip()
        category = data.get('category', 'iPhone').strip()
        price = data.get('price', 0)
        image = data.get('image', '').strip()
        description = data.get('description', '').strip()

        if not name or not price:
            return jsonify({"status": "error", "message": "Product Name and Price in ₹ are required."}), 400

        import random
        new_id = f"{category.lower()}-{random.randint(1000, 9999)}"
        new_item = {
            "id": new_id,
            "name": name,
            "category": category,
            "series": data.get('series', 'Custom'),
            "tagline": data.get('tagline', 'Latest Arrival'),
            "price": int(price),
            "rating": 5.0,
            "reviewCount": 1,
            "isNew": True,
            "featured": True,
            "image": image or "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-16-pro-max-desert-titanium-select?wid=940&hei=1112&fmt=png-alpha&.v=1723161048039",
            "fallbackImage": "",
            "description": description or f"Premium {category} added by Apple Store Owner.",
            "storageOptions": [{"size": "128GB", "price": int(price)}, {"size": "256GB", "price": int(price) + 10000}],
            "colors": [{"name": "Standard Titanium", "hex": "#343434", "image": image}],
            "specs": {"chip": "Apple Silicon", "display": "Super Retina XDR", "material": "Grade 5 Titanium"}
        }

        # 1. Update memory
        PRODUCTS_DATA.insert(0, new_item)

        # 2. Update JSON
        try:
            with open(PRODUCTS_FILE, 'w', encoding='utf-8') as f:
                json.dump(PRODUCTS_DATA, f, indent=2)
        except Exception as e:
            print(f"Error saving to products.json: {e}")

        # 3. Update MongoDB
        db = get_mongo_db()
        if db is not None:
            try:
                db['products'].insert_one(dict(new_item))
            except Exception as e:
                print(f"Error inserting product to MongoDB: {e}")

        log_admin_action("Added New Product", f"Added item '{name}' (₹{price:,}) to {category}")

        return jsonify({
            "status": "success",
            "message": f"Successfully added '{name}' to store catalog!",
            "product": new_item
        })

    if request.method == 'DELETE':
        product_id = request.args.get('id', '').strip()
        if not product_id:
            return jsonify({"status": "error", "message": "Product ID is required"}), 400

        PRODUCTS_DATA = [p for p in PRODUCTS_DATA if p['id'] != product_id]

        try:
            with open(PRODUCTS_FILE, 'w', encoding='utf-8') as f:
                json.dump(PRODUCTS_DATA, f, indent=2)
        except Exception:
            pass

        db = get_mongo_db()
        if db is not None:
            try:
                db['products'].delete_one({"id": product_id})
            except Exception:
                pass

        log_admin_action("Deleted Product", f"Removed product ID '{product_id}' from catalog")
        return jsonify({"status": "success", "message": f"Deleted product {product_id}"})

    if request.method == 'PUT':
        data = request.get_json() or {}
        product_id = data.get('id', '').strip()
        
        if not product_id:
            return jsonify({"status": "error", "message": "Product ID is required for update."}), 400
            
        name = data.get('name', '').strip()
        price = data.get('price')
        
        if not name or price is None:
            return jsonify({"status": "error", "message": "Product Name and Price are required."}), 400
            
        updated_item = None
        for i, p in enumerate(PRODUCTS_DATA):
            if p['id'] == product_id:
                PRODUCTS_DATA[i]['name'] = name
                PRODUCTS_DATA[i]['category'] = data.get('category', p.get('category'))
                PRODUCTS_DATA[i]['price'] = int(price)
                PRODUCTS_DATA[i]['image'] = data.get('image', p.get('image'))
                PRODUCTS_DATA[i]['description'] = data.get('description', p.get('description'))
                updated_item = PRODUCTS_DATA[i]
                break
                
        if not updated_item:
            return jsonify({"status": "error", "message": "Product not found."}), 404

        try:
            with open(PRODUCTS_FILE, 'w', encoding='utf-8') as f:
                json.dump(PRODUCTS_DATA, f, indent=2)
        except Exception as e:
            print(f"Error saving to products.json: {e}")

        db = get_mongo_db()
        if db is not None:
            try:
                db['products'].update_one(
                    {"id": product_id},
                    {"$set": updated_item}
                )
            except Exception as e:
                print(f"Error updating product in MongoDB: {e}")

        log_admin_action("Updated Product", f"Updated details for '{name}' (ID: {product_id})")
        return jsonify({
            "status": "success",
            "message": f"Successfully updated '{name}'!",
            "product": updated_item
        })

@app.route('/api/admin/staff', methods=['GET', 'POST', 'PUT'])
def admin_staff():
    """Manages Apple store staff roster and working shift status."""
    if request.method == 'GET':
        staff = get_staff_list()
        return jsonify({"status": "success", "count": len(staff), "staff": staff})

    if request.method == 'POST':
        data = request.get_json() or {}
        name = data.get('name', '').strip()
        role = data.get('role', 'Apple Specialist').strip()
        store = data.get('store', 'Apple BKC (Mumbai)').strip()

        if not name:
            return jsonify({"status": "error", "message": "Staff member name is required."}), 400

        import random
        staff_member = {
            "id": f"STF-{random.randint(100, 999)}",
            "name": name,
            "role": role,
            "store": store,
            "status": data.get('status', 'On Duty'),
            "email": data.get('email', f"{name.lower().replace(' ', '.')}@apple.com"),
            "phone": data.get('phone', '+91 98201 99999')
        }

        add_staff_member(staff_member)
        log_admin_action("Added Staff Member", f"Added '{name}' as '{role}' at {store}")
        return jsonify({"status": "success", "message": f"Added staff member {name}", "staff": staff_member})

    if request.method == 'PUT':
        data = request.get_json() or {}
        staff_id = data.get('id', '')
        new_status = data.get('status', 'On Duty')

        update_staff_status(staff_id, new_status)
        log_admin_action("Updated Staff Status", f"Changed staff ID '{staff_id}' status to {new_status}")
        return jsonify({"status": "success", "message": f"Updated status for {staff_id} to {new_status}"})

@app.route('/api/admin/payments', methods=['GET', 'POST'])
def admin_payments():
    """Returns payment transaction logs & records new orders."""
    if request.method == 'GET':
        payments = get_payment_logs()
        return jsonify({"status": "success", "count": len(payments), "payments": payments})

    if request.method == 'POST':
        data = request.get_json() or {}
        import random
        order_id = f"ORD-{random.randint(90000, 99999)}"
        amount = data.get('amount', 144900)
        payment_record = {
            "orderId": order_id,
            "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
            "customer": data.get('customer', 'Customer'),
            "email": data.get('email', 'customer@apple.com'),
            "items": data.get('items', 'iPhone 16 Pro Max'),
            "amount": int(amount),
            "formattedAmount": f"₹{int(amount):,}",
            "method": data.get('method', 'Credit Card EMI'),
            "status": "Completed"
        }
        save_payment_log(payment_record)
        log_admin_action("New Payment Processed", f"Order {order_id} total ₹{int(amount):,} via {payment_record['method']}")
        return jsonify({"status": "success", "message": "Order payment logged", "payment": payment_record})

@app.route('/api/admin/logs', methods=['GET'])
def admin_logs():
    """Returns combined administrative system logs and support tickets."""
    logs = get_admin_logs()
    contacts = get_contact_messages() or []
    return jsonify({
        "status": "success",
        "adminLogs": logs,
        "supportInquiries": contacts
    })

@app.route('/api/reviews', methods=['GET', 'POST', 'DELETE'])
def manage_reviews():
    """Handles customer product reviews & ratings."""
    if request.method == 'GET':
        reviews = get_customer_reviews()
        return jsonify({"status": "success", "count": len(reviews), "reviews": reviews})

    if request.method == 'POST':
        data = request.get_json() or {}
        import random
        review_item = {
            "id": f"REV-{random.randint(500, 999)}",
            "product": data.get("product", "iPhone 16 Pro Max"),
            "customer": data.get("customer", "Apple Customer"),
            "rating": float(data.get("rating", 5)),
            "comment": data.get("comment", "Excellent build quality and camera performance!"),
            "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
            "verified": True
        }
        add_customer_review(review_item)
        log_admin_action("Customer Review Added", f"New review for {review_item['product']} by {review_item['customer']}")
        return jsonify({"status": "success", "message": "Review submitted successfully!", "review": review_item})

    if request.method == 'DELETE':
        review_id = request.args.get('id', '').strip()
        if review_id:
            delete_customer_review(review_id)
            log_admin_action("Review Removed", f"Deleted customer review {review_id}")
            return jsonify({"status": "success", "message": f"Deleted review {review_id}"})
        return jsonify({"status": "error", "message": "Review ID required"}), 400

@app.route('/api/admin/profile', methods=['GET', 'PUT'])
def owner_profile_route():
    """Manages Owner Profile details and settings."""
    if request.method == 'GET':
        profile = get_owner_profile()
        return jsonify({"status": "success", "profile": profile})

    if request.method == 'PUT':
        data = request.get_json() or {}
        current = get_owner_profile()
        updated = {**current, **data}
        update_owner_profile(updated)
        log_admin_action("Owner Profile Updated", f"Updated profile details for {updated.get('name')}")
        return jsonify({"status": "success", "message": "Profile updated successfully!", "profile": updated})

def generate_ai_chat_response(user_text, persona="Siri"):
    """Helper to generate AI response via Groq API (llama-3.3-70b-versatile), Gemini API, or fallback rules."""
    ai_reply = None
    groq_key = os.getenv("GROQ_API_KEY")
    system_prompt = (
        f"You are {persona}, Apple's AI Assistant for Andrew's Official Apple Store India. "
        "Answer concisely, politely, and helpfully regarding Apple devices (iPhone 16 Pro Max, M3 MacBook Pro, iPad Pro), "
        "Instant Trade-In credit (up to ₹42,000), HDFC Bank 24-month No Cost EMI, BKC Mumbai & Saket Delhi store locations & timings (11 AM to 10 PM), "
        "and prices in INR (₹)."
    )

    if groq_key:
        try:
            res = requests.post(
                'https://api.groq.com/openai/v1/chat/completions',
                headers={
                    'Authorization': f'Bearer {groq_key}',
                    'Content-Type': 'application/json'
                },
                json={
                    'model': 'llama-3.3-70b-versatile',
                    'messages': [
                        {'role': 'system', 'content': system_prompt},
                        {'role': 'user', 'content': user_text}
                    ],
                    'temperature': 0.7,
                    'max_tokens': 350
                },
                timeout=6
            )
            if res.status_code == 200:
                res_data = res.json()
                ai_reply = res_data['choices'][0]['message']['content']
        except Exception as e:
            print("Groq API call notice:", e)

    if not ai_reply:
        gemini_key = os.getenv("GEMINI_API_KEY")
        if gemini_key:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_key}"
                res = requests.post(url, json={"contents": [{"parts": [{"text": f"{system_prompt}\nUser question: {user_text}"}]}]}, timeout=6)
                if res.status_code == 200:
                    res_data = res.json()
                    ai_reply = res_data['candidates'][0]['content']['parts'][0]['text']
            except Exception as e:
                print("Gemini API call notice:", e)

    if not ai_reply:
        lower = user_text.lower()
        if "trade" in lower or "exchange" in lower:
            ai_reply = "Namaste! Our Instant Trade-In program offers up to ₹42,000 credit for your previous iPhone model towards iPhone 16 Pro Max. Visit Apple BKC or Saket for instant diagnostic evaluation!"
        elif "emi" in lower or "hdfc" in lower or "card" in lower:
            ai_reply = "Namaste! HDFC Bank Credit & Debit Card holders get Instant Cashback up to ₹10,000 + 24 Months No Cost EMI on all flagship iPhone & Mac purchases."
        elif "bkc" in lower or "mumbai" in lower or "saket" in lower or "store" in lower:
            ai_reply = "Our flagship retail stores are located at Apple BKC (Mumbai - Jio World Drive) and Apple Saket (Delhi - Select CITYWALK). Open daily from 11:00 AM to 10:00 PM!"
        else:
            ai_reply = f"Namaste! Thank you for reaching out to Andrew's Apple Store. I'm {persona}. How can I assist you with iPhone 16 Pro Max, M3 MacBook Pro, or Store Pickups today?"

    return ai_reply


@app.route('/api/chat/threads', methods=['GET'])
def get_live_chat_threads():
    """Returns active customer live chat support threads."""
    threads = get_chat_threads()
    return jsonify({"status": "success", "count": len(threads), "threads": threads})

@app.route('/api/chat/message', methods=['POST'])
def send_customer_chat_message():
    """Handles incoming customer chat message and triggers Apple Genius AI auto-response."""
    data = request.get_json() or {}
    thread_id = data.get('threadId') or f"TH-{random.randint(100, 999)}"
    customer_name = data.get('customerName', 'Guest Customer')
    email = data.get('email', 'customer@apple.com')
    product = data.get('product', 'iPhone 16 Pro Max')
    text = data.get('text', '')

    if not text:
        return jsonify({"status": "error", "message": "Message text is required"}), 400

    ai_reply = generate_ai_chat_response(text, persona=" Apple Genius AI Assistant")
    add_customer_chat_message(thread_id, customer_name, email, product, text, ai_reply)
    log_admin_action("Customer Support Chat", f"New message from {customer_name} ({thread_id})")

    return jsonify({
        "status": "success",
        "threadId": thread_id,
        "aiReply": ai_reply,
        "threads": get_chat_threads()
    })

@app.route('/api/chat/reply', methods=['POST'])
def send_live_chat_reply():
    """Appends staff/owner response to a customer support chat thread."""
    data = request.get_json() or {}
    thread_id = data.get('threadId')
    reply_text = data.get('text', '')
    staff_name = data.get('staffName', 'Aarav Sharma (Apple Specialist)')

    if not thread_id or not reply_text:
        return jsonify({"status": "error", "message": "Thread ID and reply text required"}), 400

    send_chat_reply(thread_id, reply_text, staff_name)
    log_admin_action("Live Support Reply Sent", f"Replied to thread {thread_id} by {staff_name}")
    return jsonify({"status": "success", "message": "Reply sent successfully!"})


@app.route('/api/admin/connect-mongodb', methods=['POST'])
def connect_mongodb_route():
    """Connects to MongoDB Atlas using password or URI, seeds database, and updates .env"""
    data = request.get_json() or {}
    password = (data.get('password') or data.get('dbPassword') or '').strip()
    uri = (data.get('uri') or data.get('mongoUri') or '').strip()

    if password.startswith("mongodb+srv://") or password.startswith("mongodb://"):
        uri = password
        password = None

    if not password and not uri:
        return jsonify({"status": "error", "message": "MongoDB password or connection string is required."}), 400

    try:
        res = seed_database(db_password=password if password else None, mongo_uri=uri if uri else None)
        if res.get("status") == "success":
            # Save working URI to .env
            env_path = os.path.join(os.path.dirname(__file__), '.env')
            new_uri = uri if uri else f"mongodb+srv://louieandrew11:{password}@cluster0.28idf9t.mongodb.net/?retryWrites=true&w=majority"
            
            if os.path.exists(env_path):
                with open(env_path, 'r', encoding='utf-8') as ef:
                    lines = ef.readlines()
                new_lines = []
                uri_found = False
                for line in lines:
                    if line.startswith("MONGODB_URI="):
                        new_lines.append(f"MONGODB_URI={new_uri}\n")
                        uri_found = True
                    else:
                        new_lines.append(line)
                if not uri_found:
                    new_lines.append(f"MONGODB_URI={new_uri}\n")
                with open(env_path, 'w', encoding='utf-8') as ef:
                    ef.write("".join(new_lines))

            log_admin_action("MongoDB Atlas Connected", "MongoDB Atlas Cluster connected and database seeded")
            return jsonify(res)
        else:
            return jsonify(res), 400
    except Exception as e:
        return jsonify({"status": "error", "message": f"Connection error: {str(e)}"}), 500


if __name__ == '__main__':
    port = int(os.getenv("PORT", 5000))
    debug_mode = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    print(f"Server starting on http://localhost:{port}")
    app.run(host='0.0.0.0', port=port, debug=debug_mode, use_reloader=False)

