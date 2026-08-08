import sys
import os
from db import seed_database, get_mongo_db

def main():
    print("=" * 65)
    print("  MongoDB Atlas Automated Seeder for ani Apple Store")
    print(" Target Cluster: mongodb+srv://louieandrew11:...@cluster0.28idf9t.mongodb.net/")
    print("=" * 65)

    password = None
    if len(sys.argv) > 1:
        password = sys.argv[1].strip()

    if not password:
        password = input("\nEnter your MongoDB Atlas user password for 'louieandrew11': ").strip()

    if not password:
        print("[!] No password provided. Exiting.")
        sys.exit(1)

    print("\n[1/3] Connecting to MongoDB Atlas cluster...")
    res = seed_database(db_password=password)

    if res.get("status") == "success":
        # Update .env file with actual working password
        env_path = os.path.join(os.path.dirname(__file__), '.env')
        new_uri = f"mongodb+srv://louieandrew11:{password}@cluster0.28idf9t.mongodb.net/?retryWrites=true&w=majority"
        
        env_content = ""
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
                env_content = "".join(new_lines)
        else:
            env_content = f"GEMINI_API_KEY=AIzaSyDaTb71MVUbCZh4kqYHojolX_8mr0ySdog\nPORT=5000\nMONGODB_URI={new_uri}\n"

        with open(env_path, 'w', encoding='utf-8') as ef:
            ef.write(env_content)

        print("\n[✓] SUCCESS! MongoDB Atlas Database Seeded & Connected!")
        print(f" • Database Name: {res['database']}")
        print(f" • Cluster:       {res['cluster']}")
        print(f" • Products:      {res['productsSeeded']} inserted into 'products'")
        print(f" • Stores:        {res['storesSeeded']} inserted into 'stores'")
        print(f" • Contacts:      {res['messagesSeeded']} inserted into 'contacts'")
        print(f" • Updated .env file with active MONGODB_URI")
        print("\nOpen MongoDB Compass now and refresh Cluster0 to view your 'apple_store' database!")
        print("=" * 65)
    else:
        print(f"\n[X] Seeding failed: {res.get('message')}")

if __name__ == '__main__':
    main()
