#!/bin/bash
# Database Setup Script for Leave Management System
# This script will create the new database and populate it with sample data

echo "Starting database setup for Leave Management System..."

# Database configuration
DB_NAME="leave_management_system"
DB_USER="postgres"
DB_HOST="localhost"
DB_PORT="5432"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Please ensure PostgreSQL is running and you have admin access${NC}"
read -p "Enter PostgreSQL password for user '$DB_USER': " -s DB_PASSWORD
echo

# Function to run SQL file
run_sql_file() {
    local file=$1
    local description=$2
    
    echo -e "${YELLOW}$description...${NC}"
    
    if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -f "$file" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ $description completed successfully${NC}"
    else
        echo -e "${RED}✗ Error in $description${NC}"
        echo "Please check the error and try again."
        exit 1
    fi
}

# Create database and tables
run_sql_file "01_create_database.sql" "Creating database and tables"

# Populate with seed data
echo -e "${YELLOW}Inserting seed data...${NC}"
if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "02_seed_data.sql" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Seed data inserted successfully${NC}"
else
    echo -e "${RED}✗ Error inserting seed data${NC}"
    exit 1
fi

# Add sample leave requests
echo -e "${YELLOW}Adding sample leave requests...${NC}"
if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "03_sample_leave_requests.sql" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Sample leave requests added successfully${NC}"
else
    echo -e "${RED}✗ Error adding sample leave requests${NC}"
    exit 1
fi

# Add activities and performance data
echo -e "${YELLOW}Adding activities and performance data...${NC}"
if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "04_sample_activities_performance.sql" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Activities and performance data added successfully${NC}"
else
    echo -e "${RED}✗ Error adding activities and performance data${NC}"
    exit 1
fi

echo -e "${GREEN}"
echo "=========================================="
echo "Database setup completed successfully!"
echo "=========================================="
echo -e "${NC}"

# Display summary
echo -e "${YELLOW}Database Summary:${NC}"
echo "Database Name: $DB_NAME"
echo "Host: $DB_HOST:$DB_PORT"

# Count records
echo -e "${YELLOW}Sample Data Summary:${NC}"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "
    SELECT 'Teams: ' || COUNT(*) FROM teams
    UNION ALL
    SELECT 'Users: ' || COUNT(*) FROM users
    UNION ALL
    SELECT 'Employee Profiles: ' || COUNT(*) FROM employee_profiles
    UNION ALL
    SELECT 'Leave Types: ' || COUNT(*) FROM leave_types
    UNION ALL
    SELECT 'Holidays: ' || COUNT(*) FROM holidays
    UNION ALL
    SELECT 'Leave Balances: ' || COUNT(*) FROM leave_balances
    UNION ALL
    SELECT 'Leave Requests: ' || COUNT(*) FROM leave_requests
    UNION ALL
    SELECT 'Activities: ' || COUNT(*) FROM activities
    UNION ALL
    SELECT 'Performance Reviews: ' || COUNT(*) FROM performances;
"

echo -e "${YELLOW}"
echo "Sample Login Credentials:"
echo "========================="
echo "Admin User:"
echo "  Email: admin@company.com"
echo "  Password: password123"
echo ""
echo "HR Manager:"
echo "  Email: sarah.johnson@company.com"
echo "  Password: password123"
echo ""
echo "IT Manager:"
echo "  Email: david.wilson@company.com"
echo "  Password: password123"
echo ""
echo "Regular Employee:"
echo "  Email: emily.davis@company.com"
echo "  Password: password123"
echo -e "${NC}"

echo -e "${GREEN}You can now start your NestJS application!${NC}"
