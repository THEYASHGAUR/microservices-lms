# 🎯 SINGLE SOURCE OF TRUTH - Supabase Configuration

## ✅ **FIXED: True Single Source of Truth**

All Supabase credentials are now managed from **ONE SINGLE FILE** in the root directory. No more duplicate `.env` files across services!

---

## 📁 **Current Structure (CORRECTED)**

```
microservices-lms/
├── .env                                    # 🎯 SINGLE SOURCE OF TRUTH
│   ├── SUPABASE_URL=...
│   ├── SUPABASE_SERVICE_ROLE_KEY=...
│   └── SUPABASE_ANON_KEY=...
├── shared/supabase/                        # 📚 Centralized configuration
│   ├── env/index.ts                        # Environment validation
│   ├── types/index.ts                      # TypeScript types
│   ├── services/                           # Service-specific operations
│   └── migrations/                         # Database migrations
├── services/
│   ├── auth-service/src/index.ts           # ✅ Reads from root .env
│   ├── course-service/src/index.ts         # ✅ Reads from root .env
│   └── [other-services]/                   # ✅ All read from root .env
└── web-frontend/.env.local                 # Frontend only (separate)
```

---

## 🔧 **How It Works Now**

### **1. Single .env File**
- **Location**: Root directory `/microservices-lms/.env`
- **Contains**: ALL Supabase credentials
- **Read by**: ALL services automatically

### **2. Service Configuration**
Each service loads environment variables from the root:
```typescript
// In any service's src/index.ts
import dotenv from 'dotenv';
import path from 'path';

// Load from ROOT .env file (single source of truth)
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
```

### **3. No More Duplicate Files**
- ❌ **Removed**: `services/auth-service/.env`
- ❌ **Removed**: `services/course-service/.env`
- ❌ **Removed**: All individual service `.env` files
- ✅ **Kept**: Only root `.env` file

---

## 🚀 **Setup Instructions**

### **1. Run Setup Script**
```bash
./scripts/setup-env.sh
```
This creates **ONLY** the root `.env` file.

### **2. Update Credentials**
Edit the **SINGLE** `.env` file in the root directory:
```env
# This is the ONLY file with Supabase credentials
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
```

### **3. Start Services**
```bash
./start-microservices.sh
```
All services automatically read from the root `.env` file.

---

## ✅ **Verification**

### **Check Single Source**
```bash
# Should show ONLY the root .env file
find . -name ".env*" -type f | grep -v node_modules
# Output: ./.env
```

### **Check No Duplicates**
```bash
# Should return NO results (no individual service .env files)
find services/ -name ".env" -type f
# Output: (empty)
```

### **Check Services Read from Root**
```bash
# All services should have this pattern:
grep -r "path.resolve.*\.env" services/*/src/index.ts
# Output: All services loading from root
```

---

## 🎯 **Benefits Achieved**

### **✅ TRUE Single Source of Truth**
- **One file**: Root `.env` contains all Supabase credentials
- **No duplicates**: Removed all individual service `.env` files
- **Automatic**: All services read from root automatically

### **✅ Easy Maintenance**
- **Update once**: Change credentials in root `.env` only
- **Affects all**: All services get updated credentials
- **No confusion**: No more wondering which `.env` file to update

### **✅ Security**
- **One place**: Only one file to secure
- **No leaks**: No duplicate files to accidentally commit
- **Consistent**: All services use same credentials

---

## 🔍 **What Was Fixed**

### **❌ Before (WRONG)**
```
services/auth-service/.env          # Had Supabase keys
services/course-service/.env        # Had Supabase keys
services/user-service/.env          # Had Supabase keys
... (duplicate files everywhere)
```

### **✅ After (CORRECT)**
```
.env                                # SINGLE file with Supabase keys
services/*/src/index.ts             # All read from root .env
```

---

## 📋 **Migration Completed**

1. ✅ **Removed** all individual service `.env` files
2. ✅ **Updated** all services to read from root `.env`
3. ✅ **Modified** setup script to create only root `.env`
4. ✅ **Verified** single source of truth

---

## 🎉 **Result**

**✅ TRUE SINGLE SOURCE OF TRUTH**: Only root `.env` file contains Supabase credentials  
**✅ NO DUPLICATES**: All individual service `.env` files removed  
**✅ AUTOMATIC**: All services read from root automatically  
**✅ MAINTAINABLE**: Update credentials in one place only  

Now there's truly **ONE SINGLE FILE** with all Supabase keys that all services share! 🎯
