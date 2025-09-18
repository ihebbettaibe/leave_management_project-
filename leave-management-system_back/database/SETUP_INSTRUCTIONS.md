# PostgreSQL Database Setup Instructions

Since there seems to be a password authentication issue, here's how to set up the database manually:

## Option 1: Use pgAdmin (Recommended)
1. Open pgAdmin (PostgreSQL administration tool)
2. Connect to your PostgreSQL server
3. Right-click on "Databases" → Create → Database
4. Name it: `leave_management_system`
5. Open Query Tool and run each SQL file in order:
   - 01_create_database.sql
   - 02_seed_data.sql  
   - 03_sample_leave_requests.sql
   - 04_sample_activities_performance.sql

## Option 2: Command Line with Correct Password
If you know your PostgreSQL password, run these commands one by one:

```cmd
# Set PATH to PostgreSQL bin directory
set PATH=C:\Program Files\PostgreSQL\16\bin;%PATH%

# Create database and tables
psql -U postgres -h localhost -p 5432 -f "01_create_database.sql"

# Add seed data  
psql -U postgres -h localhost -p 5432 -d leave_management_system -f "02_seed_data.sql"

# Add sample leave requests
psql -U postgres -h localhost -p 5432 -d leave_management_system -f "03_sample_leave_requests.sql"

# Add activities and performance data
psql -U postgres -h localhost -p 5432 -d leave_management_system -f "04_sample_activities_performance.sql"
```

## Option 3: Try Different Ports
Your system has PostgreSQL running on multiple ports. Try:
- Port 5432 (PostgreSQL 13)
- Port 5433 (PostgreSQL 16)  
- Port 5434 (PostgreSQL 17)

## Option 4: Check Your .env File
Your NestJS backend expects these settings:
```
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=nour
DB_NAME=leave_management_system
```

Make sure the password "nour" is correct for your PostgreSQL installation.

## Verification
After setup, verify the database with:
```cmd
psql -U postgres -h localhost -p 5432 -d leave_management_system -f "verify_database.sql"
```

## Sample Login Credentials (After Setup)
- Admin: admin@company.com / password123
- HR Manager: sarah.johnson@company.com / password123
- IT Manager: david.wilson@company.com / password123