import os
import json
import datetime
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
mongo_client = None
mongo_db = None

def get_mongo_db(uri_override=None):
    """Initializes and returns PyMongo database client for admin database."""
    global mongo_client, mongo_db
    
    uri = uri_override or os.getenv("MONGODB_URI")
    
    if not uri or "<db_password>" in uri:
        return None

    try:
        from pymongo import MongoClient
        if mongo_client is None or uri_override:
            mongo_client = MongoClient(uri, serverSelectionTimeoutMS=5000)
            mongo_db = mongo_client.get_database('admin')
            # Test ping connection
            mongo_client.admin.command('ping')
            print("MongoDB Atlas: Connected successfully to database 'admin'")
        return mongo_db
    except Exception as e:
        print(f"MongoDB Atlas Connection Notice: {e}")
        mongo_db = None
        return None

def save_contact_message(message_data):
    """Saves support message into MongoDB Atlas 'contacts' collection."""
    db = get_mongo_db()
    if db is not None:
        try:
            record = dict(message_data)
            record["createdAt"] = datetime.datetime.utcnow()
            result = db['contacts'].insert_one(record)
            print(f"Saved support ticket {message_data.get('ticketId')} to MongoDB Atlas (_id: {result.inserted_id})")
            return True
        except Exception as e:
            print(f"MongoDB save_contact_message error: {e}")
    return False

def get_contact_messages(limit=50):
    """Fetches saved support messages from MongoDB Atlas 'contacts' collection."""
    db = get_mongo_db()
    if db is not None:
        try:
            items = list(db['contacts'].find({}, {'_id': 0}).sort('timestamp', -1).limit(limit))
            return items
        except Exception as e:
            print(f"MongoDB get_contact_messages error: {e}")
    return None

# Staff Roster Management & Official Documents
DEFAULT_STAFF = [
    {
        "id": "STF-101",
        "badgeNo": "AAPL-IND-8841",
        "name": "Aarav Sharma",
        "role": "Senior Apple Specialist",
        "store": "Apple BKC (Mumbai)",
        "status": "On Duty",
        "email": "aarav.s@apple.com",
        "phone": "+91 98201 12345",
        "salary": 95000,
        "joinedDate": "2022-04-15",
        "certifications": ["Apple Certified Mac Technician (ACMT)", "AppleCare iOS Specialist"],
        "documentId": "DOC-AAPL-98214-IND",
        "docStatus": "Verified & Active",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
    },
    {
        "id": "STF-102",
        "badgeNo": "AAPL-IND-8842",
        "name": "Priya Patel",
        "role": "Genius Bar Technician",
        "store": "Apple BKC (Mumbai)",
        "status": "On Duty",
        "email": "priya.p@apple.com",
        "phone": "+91 98201 23456",
        "salary": 85000,
        "joinedDate": "2023-01-10",
        "certifications": ["Genius Bar Hardware Master", "Logic Board Repair Specialist"],
        "documentId": "DOC-AAPL-98215-IND",
        "docStatus": "Verified & Active",
        "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"
    },
    {
        "id": "STF-103",
        "badgeNo": "AAPL-IND-8843",
        "name": "Vikram Singh",
        "role": "Inventory & Logistics Lead",
        "store": "Apple Saket (Delhi)",
        "status": "On Break",
        "email": "vikram.s@apple.com",
        "phone": "+91 98110 34567",
        "salary": 110000,
        "joinedDate": "2021-08-01",
        "certifications": ["Global Supply Chain Certification", "Apple Inventory Lead"],
        "documentId": "DOC-AAPL-98216-IND",
        "docStatus": "Verified & Active",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
    },
    {
        "id": "STF-104",
        "badgeNo": "AAPL-IND-8844",
        "name": "Rohan Gupta",
        "role": "Creative Lead - Today at Apple",
        "store": "Apple BKC (Mumbai)",
        "status": "On Duty",
        "email": "rohan.g@apple.com",
        "phone": "+91 98201 45678",
        "salary": 78000,
        "joinedDate": "2023-06-20",
        "certifications": ["Pro Apps Certified Trainer", "Final Cut Pro Master"],
        "documentId": "DOC-AAPL-98217-IND",
        "docStatus": "Verified & Active",
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"
    },
    {
        "id": "STF-105",
        "badgeNo": "AAPL-IND-8845",
        "name": "Ananya Roy",
        "role": "Customer Experience Specialist",
        "store": "Apple Saket (Delhi)",
        "status": "Off Duty",
        "email": "ananya.r@apple.com",
        "phone": "+91 98110 56789",
        "salary": 72000,
        "joinedDate": "2023-11-05",
        "certifications": ["Customer Engagement Excellence", "Apple Trade-In Specialist"],
        "documentId": "DOC-AAPL-98218-IND",
        "docStatus": "Verified & Active",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80"
    }
]

def get_staff_list():
    """Returns store staff members from MongoDB or default list."""
    db = get_mongo_db()
    if db is not None:
        try:
            items = list(db['staff'].find({}, {'_id': 0}))
            if items:
                return items
        except Exception as e:
            print(f"MongoDB get_staff_list error: {e}")
    return DEFAULT_STAFF

def add_staff_member(staff_data):
    """Adds a new staff member to MongoDB Atlas."""
    db = get_mongo_db()
    if db is not None:
        try:
            db['staff'].insert_one(dict(staff_data))
            return True
        except Exception as e:
            print(f"MongoDB add_staff_member error: {e}")
    return False

def update_staff_status(staff_id, new_status):
    """Updates staff member working status in MongoDB Atlas."""
    db = get_mongo_db()
    if db is not None:
        try:
            db['staff'].update_one({"id": staff_id}, {"$set": {"status": new_status}})
            return True
        except Exception as e:
            print(f"MongoDB update_staff_status error: {e}")
    return False

# Payment & Order Logs
DEFAULT_PAYMENTS = [
    {"orderId": "ORD-98412", "timestamp": "2026-08-07T14:22:10Z", "customer": "Louie Andrew", "email": "louieandrew11@gmail.com", "items": "iPhone 16 Pro Max 256GB (Desert Titanium)", "amount": 144900, "formattedAmount": "₹1,44,900", "method": "HDFC Credit Card (No Cost EMI)", "status": "Completed"},
    {"orderId": "ORD-98413", "timestamp": "2026-08-07T15:10:45Z", "customer": "Deepak Verma", "email": "deepak.v@gmail.com", "items": "MacBook Pro 16 M3 Max 1TB", "amount": 349900, "formattedAmount": "₹3,49,900", "method": "Apple Pay (UPI Instant)", "status": "Completed"},
    {"orderId": "ORD-98414", "timestamp": "2026-08-07T16:05:20Z", "customer": "Neha Kapoor", "email": "neha.k@outlook.com", "items": "iPad Air 11 M2 + Apple Pencil Pro", "amount": 71800, "formattedAmount": "₹71,800", "method": "ICICI NetBanking", "status": "Completed"},
    {"orderId": "ORD-98415", "timestamp": "2026-08-07T16:45:00Z", "customer": "Rajesh Kumar", "email": "rajesh.k@gmail.com", "items": "iPhone 16 128GB (Teal)", "amount": 79900, "formattedAmount": "₹79,900", "method": "SBI Credit Card", "status": "Completed"}
]

def get_payment_logs(limit=50):
    """Returns payment transaction logs from MongoDB or defaults."""
    db = get_mongo_db()
    if db is not None:
        try:
            items = list(db['payments'].find({}, {'_id': 0}).sort('timestamp', -1).limit(limit))
            if items:
                return items
        except Exception as e:
            print(f"MongoDB get_payment_logs error: {e}")
    return DEFAULT_PAYMENTS

def save_payment_log(payment_data):
    """Saves a new customer payment transaction log."""
    db = get_mongo_db()
    if db is not None:
        try:
            record = dict(payment_data)
            record["createdAt"] = datetime.datetime.utcnow()
            db['payments'].insert_one(record)
            return True
        except Exception as e:
            print(f"MongoDB save_payment_log error: {e}")
    return False

# Admin Activity Audit Logs
def log_admin_action(action, details, user="Admin (Owner)"):
    """Logs an admin operation into MongoDB Atlas."""
    db = get_mongo_db()
    if db is not None:
        try:
            db['admin_logs'].insert_one({
                "action": action,
                "details": details,
                "user": user,
                "timestamp": datetime.datetime.utcnow().isoformat() + "Z"
            })
            return True
        except Exception as e:
            print(f"MongoDB log_admin_action error: {e}")
    return False

def get_admin_logs(limit=50):
    """Fetches administrative audit logs from MongoDB."""
    db = get_mongo_db()
    if db is not None:
        try:
            items = list(db['admin_logs'].find({}, {'_id': 0}).sort('timestamp', -1).limit(limit))
            return items
        except Exception as e:
            print(f"MongoDB get_admin_logs error: {e}")
    return [
        {"action": "Owner Portal Login", "details": "Successful authenticated login by admin", "user": "Admin (Owner)", "timestamp": datetime.datetime.utcnow().isoformat() + "Z"},
        {"action": "Database Inspection", "details": "Verified MongoDB Atlas cluster0 connection status", "user": "System Auto", "timestamp": datetime.datetime.utcnow().isoformat() + "Z"}
    ]

# Live Customer Support & Staff Chat Desk
DEFAULT_CHAT_THREADS = [
    {
        "threadId": "TH-901",
        "customerName": "Siddharth Rao",
        "email": "siddharth.r@gmail.com",
        "product": "iPhone 16 Pro Max",
        "status": "Active",
        "lastUpdated": "2026-08-07T16:45:00Z",
        "messages": [
            {"sender": "customer", "text": "Namaste! What is the estimated trade-in value for my iPhone 14 Pro 128GB?", "timestamp": "16:40"},
            {"sender": "staff", "staffName": "Aarav Sharma (Apple Specialist)", "text": "Namaste Siddharth! Trade-in credit for iPhone 14 Pro 128GB in good condition is up to ₹42,000.", "timestamp": "16:42"},
            {"sender": "customer", "text": "Awesome! Can I pick it up today at Apple BKC Mumbai?", "timestamp": "16:45"}
        ]
    },
    {
        "threadId": "TH-902",
        "customerName": "Kavya Menon",
        "email": "kavya.m@outlook.com",
        "product": "MacBook Pro 16 M3 Max",
        "status": "Open",
        "lastUpdated": "2026-08-07T17:10:00Z",
        "messages": [
            {"sender": "customer", "text": "Does the HDFC No Cost EMI 24-month offer apply to Space Black MacBook Pro?", "timestamp": "17:10"}
        ]
    }
]

def get_chat_threads():
    """Returns live customer support threads from MongoDB or default list."""
    db = get_mongo_db()
    if db is not None:
        try:
            items = list(db['chat_threads'].find({}, {'_id': 0}).sort('lastUpdated', -1))
            if items:
                return items
        except Exception as e:
            print(f"MongoDB get_chat_threads error: {e}")
    return DEFAULT_CHAT_THREADS

def send_chat_reply(thread_id, reply_text, staff_name="Aarav Sharma (Apple Specialist)"):
    """Appends a staff response to a customer live chat thread."""
    db = get_mongo_db()
    reply_msg = {
        "sender": "staff",
        "staffName": staff_name,
        "text": reply_text,
        "timestamp": datetime.datetime.utcnow().strftime("%H:%M")
    }
    if db is not None:
        try:
            db['chat_threads'].update_one(
                {"threadId": thread_id},
                {
                    "$push": {"messages": reply_msg},
                    "$set": {"status": "Replied", "lastUpdated": datetime.datetime.utcnow().isoformat() + "Z"}
                }
            )
            return True
        except Exception as e:
            print(f"MongoDB send_chat_reply error: {e}")
    return False

def add_customer_chat_message(thread_id, customer_name, email, product, message_text, ai_reply_text=None):
    """Appends customer message & optional AI response to thread in MongoDB."""
    db = get_mongo_db()
    now_time = datetime.datetime.utcnow().strftime("%H:%M")
    customer_msg = {
        "sender": "customer",
        "text": message_text,
        "timestamp": now_time
    }

    if db is not None:
        try:
            thread = db['chat_threads'].find_one({"threadId": thread_id})
            if not thread:
                thread = {
                    "threadId": thread_id,
                    "customerName": customer_name,
                    "email": email,
                    "product": product,
                    "status": "Active",
                    "lastUpdated": datetime.datetime.utcnow().isoformat() + "Z",
                    "messages": [customer_msg]
                }
                if ai_reply_text:
                    thread["messages"].append({
                        "sender": "ai",
                        "staffName": " Apple Genius AI Assistant",
                        "text": ai_reply_text,
                        "timestamp": now_time
                    })
                db['chat_threads'].insert_one(thread)
            else:
                push_msgs = [customer_msg]
                if ai_reply_text:
                    push_msgs.append({
                        "sender": "ai",
                        "staffName": " Apple Genius AI Assistant",
                        "text": ai_reply_text,
                        "timestamp": now_time
                    })
                db['chat_threads'].update_one(
                    {"threadId": thread_id},
                    {
                        "$push": {"messages": {"$each": push_msgs}},
                        "$set": {"status": "AI Responded", "lastUpdated": datetime.datetime.utcnow().isoformat() + "Z"}
                    }
                )
            return True
        except Exception as e:
            print(f"MongoDB add_customer_chat_message error: {e}")
    return False

# Customer Product Reviews & Ratings
DEFAULT_REVIEWS = [
    {"id": "REV-501", "product": "iPhone 16 Pro Max", "customer": "Siddharth Rao", "rating": 5, "comment": "The A18 Pro chip speed and Grade 5 Desert Titanium build are phenomenal. Camera Control button is super fluid!", "timestamp": "2026-08-07T12:30:00Z", "verified": True},
    {"id": "REV-502", "product": "MacBook Pro 16 M3 Max", "customer": "Kavya Menon", "rating": 5, "comment": "Best workstation laptop for 4K ProRes rendering. Zero fan noise during 8K timelines.", "timestamp": "2026-08-07T14:15:00Z", "verified": True},
    {"id": "REV-503", "product": "iPad Pro 13 M4", "customer": "Amitabh Joshi", "rating": 4.5, "comment": "Tandem OLED display is impossibly bright. Thinness is unbelievable!", "timestamp": "2026-08-07T16:00:00Z", "verified": True}
]

def get_customer_reviews(limit=50):
    """Fetches customer product reviews from MongoDB or default list."""
    db = get_mongo_db()
    if db is not None:
        try:
            items = list(db['reviews'].find({}, {'_id': 0}).sort('timestamp', -1).limit(limit))
            if items:
                return items
        except Exception as e:
            print(f"MongoDB get_customer_reviews error: {e}")
    return DEFAULT_REVIEWS

def add_customer_review(review_data):
    """Adds a new customer product review into MongoDB Atlas."""
    db = get_mongo_db()
    if db is not None:
        try:
            record = dict(review_data)
            record["createdAt"] = datetime.datetime.utcnow()
            db['reviews'].insert_one(record)
            return True
        except Exception as e:
            print(f"MongoDB add_customer_review error: {e}")
    return False

def delete_customer_review(review_id):
    """Deletes a customer product review from MongoDB Atlas."""
    db = get_mongo_db()
    if db is not None:
        try:
            db['reviews'].delete_one({"id": review_id})
            return True
        except Exception as e:
            print(f"MongoDB delete_customer_review error: {e}")
    return False

# Owner Profile & Settings
DEFAULT_OWNER_PROFILE = {
    "name": "Louie Andrew",
    "email": "louieandrew11@gmail.com",
    "phone": "+91 98200 11111",
    "role": "Store Owner & Chief Executive",
    "cluster": "cluster0.28idf9t.mongodb.net",
    "database": "admin",
    "status": "Verified Owner",
    "location": "Mumbai, India",
    "twoFactorEnabled": True
}

def get_owner_profile():
    """Returns owner profile from MongoDB Atlas or defaults."""
    db = get_mongo_db()
    if db is not None:
        try:
            profile = db['owner_profile'].find_one({}, {'_id': 0})
            if profile:
                return profile
        except Exception as e:
            print(f"MongoDB get_owner_profile error: {e}")
    return DEFAULT_OWNER_PROFILE

def update_owner_profile(profile_data):
    """Updates owner profile in MongoDB Atlas."""
    db = get_mongo_db()
    if db is not None:
        try:
            db['owner_profile'].replace_one({}, dict(profile_data), upsert=True)
            return True
        except Exception as e:
            print(f"MongoDB update_owner_profile error: {e}")
    return False




def save_chat_log(chat_data):
    """Saves Siri AI conversation into MongoDB Atlas 'chat_logs' collection."""
    db = get_mongo_db()
    if db is not None:
        try:
            record = dict(chat_data)
            record["createdAt"] = datetime.datetime.utcnow()
            db['chat_logs'].insert_one(record)
            return True
        except Exception as e:
            print(f"MongoDB save_chat_log error: {e}")
    return False

def seed_database(db_password=None):
    """Seeds products, stores, and messages into MongoDB Atlas."""
    uri = MONGODB_URI
    if db_password:
        uri = f"mongodb+srv://louieandrew11:{db_password}@cluster0.28idf9t.mongodb.net/?retryWrites=true&w=majority"
    
    db = get_mongo_db(uri_override=uri)
    if db is None:
        return {
            "status": "error",
            "message": "Could not connect to MongoDB Atlas. Please ensure password is set."
        }

    # 1. Seed Products
    products_file = os.path.join(os.path.dirname(__file__), 'data', 'products.json')
    products_count = 0
    if os.path.exists(products_file):
        with open(products_file, 'r', encoding='utf-8') as pf:
            products_data = json.load(pf)
            db['products'].delete_many({}) # Refresh collection
            if products_data:
                db['products'].insert_many(products_data)
                products_count = len(products_data)

    # 2. Seed Stores
    stores_data = [
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
    db['stores'].delete_many({})
    db['stores'].insert_many(stores_data)

    # 3. Seed Existing Contact Messages
    contact_file = os.path.join(os.path.dirname(__file__), 'data', 'contact_messages.json')
    contacts_count = 0
    if os.path.exists(contact_file):
        with open(contact_file, 'r', encoding='utf-8') as cf:
            contacts_data = json.load(cf)
            if contacts_data:
                db['contacts'].delete_many({})
                db['contacts'].insert_many(contacts_data)
                contacts_count = len(contacts_data)

    # 4. Seed Staff, Payments, Reviews & Owner Profile
    db['staff'].delete_many({})
    db['staff'].insert_many(DEFAULT_STAFF)

    db['payments'].delete_many({})
    db['payments'].insert_many(DEFAULT_PAYMENTS)

    db['reviews'].delete_many({})
    db['reviews'].insert_many(DEFAULT_REVIEWS)

    db['owner_profile'].delete_many({})
    db['owner_profile'].insert_one(DEFAULT_OWNER_PROFILE)

    return {
        "status": "success",
        "database": "admin",
        "cluster": "cluster0.28idf9t.mongodb.net",
        "productsSeeded": products_count,
        "storesSeeded": len(stores_data),
        "messagesSeeded": contacts_count,
        "staffSeeded": len(DEFAULT_STAFF),
        "paymentsSeeded": len(DEFAULT_PAYMENTS),
        "reviewsSeeded": len(DEFAULT_REVIEWS)
    }
