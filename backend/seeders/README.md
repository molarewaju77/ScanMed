# Seeders - Database Population Scripts

This folder contains scripts to populate the database with dummy/test data.

## 📁 Available Seeders

### `dummyData.js`
Seeds the database with complete test accounts for all roles.

**What it creates:**
- 1 SuperAdmin
- 5 Admins
- 5 Managers
- 5 Workers
- 5 Regular Users
- 5 Doctors (with profiles)
- 3 Hospitals

## 🚀 How to Run

### Prerequisites
- MongoDB running
- Environment variables configured
- Node.js installed

### Running the Seeder

```bash
# From the backend folder
node seeders/dummyData.js
```

### Expected Output
```
🌱 Starting database seeding...
✅ Connected to MongoDB
🏥 Creating hospitals...
✅ Created 3 hospitals
👥 Creating users...
✅ Created superadmin: superadmin@scanmed.com
✅ Created admin: admin1@scanmed.com
...
🩺 Creating doctor profiles...
✅ Created doctor profile for doctor1@scanmed.com
...
✅ Database seeding completed successfully!
```

## ⚙️ Configuration

Edit `dummyData.js` to:
- Add more accounts
- Change default passwords
- Modify hospital data
- Adjust doctor specializations

## 🔄 Re-seeding

To clear and re-seed:

1. Uncomment these lines in `dummyData.js`:
```javascript
await User.deleteMany({});
await Doctor.deleteMany({});
await Hospital.deleteMany({});
```

2. Run the seeder again

## 📋 See All Credentials

For a complete list of all dummy accounts and passwords, see:
`plan/dummydatas.md`

## ⚠️ Important

**These are test accounts only!**
- Never use in production
- Delete before deploying
- Change all default passwords

## 🐛 Troubleshooting

**"MongoDB connection failed"**
- Check if MongoDB is running
- Verify MONGODB_URI in .env

**"Duplicate key error"**
- Accounts already exist
- Uncomment delete lines to clear first

**"Missing module"**
- Run `npm install` in backend folder
