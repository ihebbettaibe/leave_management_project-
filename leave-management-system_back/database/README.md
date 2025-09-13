# Leave Management System Database Setup

This directory contains comprehensive database scripts to set up a complete Leave Management System with realistic sample data.

## 📋 What's Included

### Database Structure
- **Teams**: 8 different departments (HR, IT, Marketing, Finance, Sales, Operations, Legal, Customer Support)
- **Users**: 17 employees with different roles and permissions
- **Employee Profiles**: Complete employee information including personal details, salary, bank info
- **Leave Types**: 9 different leave types (Annual, Sick, Personal, Maternity, etc.)
- **Holidays**: Complete 2024 and 2025 holiday calendar (US holidays)
- **Leave Balances**: Realistic leave balances for all employees for 2024 and 2025
- **Leave Requests**: 20+ sample leave requests with different statuses
- **Activities**: Employee activity logs (login, profile updates, project completions, etc.)
- **Performance Reviews**: Detailed performance reviews with ratings and feedback

### Sample Data Features
- **17 Employees** across 8 departments
- **Multiple user roles**: Admin, Managers, Regular Employees
- **Realistic leave patterns**: Used leave, carryovers, pending requests
- **Complete holiday calendar**: National, Company, and Religious holidays
- **Performance tracking**: Quarterly reviews with goals, achievements, and feedback
- **Activity logging**: System activities and employee actions

## 🚀 Quick Setup

### Windows Users
```powershell
cd database
.\setup_database.bat
```

### Linux/Mac Users
```bash
cd database
chmod +x setup_database.sh
./setup_database.sh
```

### Manual Setup
If you prefer to run the scripts manually:

1. **Create Database and Tables**
   ```sql
   psql -U postgres -f 01_create_database.sql
   ```

2. **Insert Seed Data**
   ```sql
   psql -U postgres -d leave_management_system -f 02_seed_data.sql
   ```

3. **Add Leave Requests**
   ```sql
   psql -U postgres -d leave_management_system -f 03_sample_leave_requests.sql
   ```

4. **Add Activities and Performance Data**
   ```sql
   psql -U postgres -d leave_management_system -f 04_sample_activities_performance.sql
   ```

## 🔐 Sample Login Credentials

All passwords are: `password123`

### Admin Access
- **Email**: admin@company.com
- **Roles**: Admin, HR Manager

### Department Managers
- **HR Manager**: sarah.johnson@company.com
- **IT Manager**: david.wilson@company.com
- **Marketing Manager**: lisa.martinez@company.com
- **Finance Manager**: amanda.taylor@company.com
- **Sales Manager**: jessica.jackson@company.com
- **Operations Manager**: daniel.harris@company.com
- **Legal Manager**: joshua.lewis@company.com
- **Support Manager**: stephanie.robinson@company.com

### Regular Employees
- **IT Developer**: emily.davis@company.com
- **HR Specialist**: michael.brown@company.com
- **Marketing Specialist**: robert.anderson@company.com
- **Sales Rep**: matthew.white@company.com
- **And more...**

## 📊 Database Statistics

After setup, your database will contain:
- **8 Teams** representing different departments
- **17 Users** with various roles and permissions  
- **17 Employee Profiles** with complete personal and professional information
- **9 Leave Types** covering all common leave categories
- **28 Holidays** for 2024 and 2025
- **60+ Leave Balance records** showing realistic leave usage
- **20+ Leave Requests** with various statuses (approved, pending, rejected)
- **100+ Activity records** showing system usage
- **15+ Performance reviews** with detailed feedback

## 🛠️ Database Schema

### Key Tables and Relationships

```
users
├── employee_profiles (1:1)
├── leave_balances (1:many)
├── leave_requests (1:many)
└── teams (many:1)

employee_profiles
├── activities (1:many)
└── performances (1:many)

leave_requests
├── leave_types (many:1)
└── users (many:1 for approver)
```

### Important Features
- **UUID primary keys** for users for better security
- **Enum constraints** for data integrity
- **Foreign key relationships** for data consistency
- **Indexes** for better query performance
- **Triggers** for automatic timestamp updates
- **Unique constraints** to prevent duplicate data

## 📈 Sample Data Highlights

### Realistic Leave Patterns
- Employees have varying leave usage based on join date
- Carryover leave from 2024 to 2025
- Mix of approved, pending, and rejected leave requests
- Emergency and sick leave examples

### Performance Management
- Quarterly performance reviews
- Rating system (1-5 scale)
- Goals, achievements, and feedback
- Different performance levels across employees

### Comprehensive Employee Data
- Multiple departments and roles
- Realistic salary ranges
- Complete contact information
- Emergency contacts and personal details

## 🔧 Configuration

Make sure your `.env` file is updated:
```env
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=leave_management_system
DB_SYNCHRONIZE=false
```

**Note**: `DB_SYNCHRONIZE` is set to `false` because we're using explicit database scripts instead of TypeORM auto-sync.

## 🎯 Next Steps

1. **Run the setup script** to create your database
2. **Start your NestJS application** with `npm run start:dev`
3. **Test the API endpoints** using the sample credentials
4. **Explore the data** using pgAdmin or your preferred PostgreSQL client
5. **Customize the data** as needed for your specific requirements

## 🚨 Important Notes

- **Backup your existing database** before running these scripts
- The scripts will **drop and recreate** the database
- All passwords are hashed using bcrypt
- The data is designed for **development and testing purposes**
- For production, ensure proper security measures and real data

## 📝 Customization

You can easily customize the sample data by:
- Modifying the SQL files before running them
- Adding more employees, departments, or leave types
- Adjusting leave balances and usage patterns
- Adding more performance reviews and activities
- Customizing holiday calendars for your region

Happy coding! 🚀
