#!/bin/bash

# Backup script for LMS
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKUP_DIR=${BACKUP_DIR:-"/backups"}
DATE=$(date +%Y%m%d_%H%M%S)
DB_HOST=${DB_HOST:-"localhost"}
DB_PORT=${DB_PORT:-"5432"}
DB_NAME=${DB_NAME:-"lms_db"}
DB_USER=${DB_USER:-"postgres"}
REDIS_HOST=${REDIS_HOST:-"localhost"}
REDIS_PORT=${REDIS_PORT:-"6379"}
S3_BUCKET=${S3_BUCKET:-""}
RETENTION_DAYS=${RETENTION_DAYS:-"30"}

echo -e "${BLUE}Starting LMS backup process...${NC}"
echo "Backup directory: $BACKUP_DIR"
echo "Date: $DATE"
echo "Database: $DB_HOST:$DB_PORT/$DB_NAME"
echo "Redis: $REDIS_HOST:$REDIS_PORT"

# Function to create backup directory
create_backup_dir() {
    echo -e "${YELLOW}Creating backup directory...${NC}"
    mkdir -p "$BACKUP_DIR/$DATE"
}

# Function to backup PostgreSQL database
backup_database() {
    echo -e "${YELLOW}Backing up PostgreSQL database...${NC}"
    
    if ! command -v pg_dump &> /dev/null; then
        echo -e "${RED}pg_dump is not installed or not in PATH${NC}"
        return 1
    fi
    
    # Set PGPASSWORD if not already set
    if [ -z "$PGPASSWORD" ]; then
        read -s -p "Enter PostgreSQL password: " PGPASSWORD
        echo
        export PGPASSWORD
    fi
    
    pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
        --verbose --clean --no-owner --no-privileges \
        --file="$BACKUP_DIR/$DATE/database_backup.sql"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Database backup completed successfully${NC}"
        
        # Compress the backup
        gzip "$BACKUP_DIR/$DATE/database_backup.sql"
        echo -e "${GREEN}✓ Database backup compressed${NC}"
    else
        echo -e "${RED}✗ Database backup failed${NC}"
        return 1
    fi
}

# Function to backup Redis data
backup_redis() {
    echo -e "${YELLOW}Backing up Redis data...${NC}"
    
    if ! command -v redis-cli &> /dev/null; then
        echo -e "${RED}redis-cli is not installed or not in PATH${NC}"
        return 1
    fi
    
    # Create Redis dump
    redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" --rdb "$BACKUP_DIR/$DATE/redis_backup.rdb"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Redis backup completed successfully${NC}"
    else
        echo -e "${RED}✗ Redis backup failed${NC}"
        return 1
    fi
}

# Function to backup uploaded files
backup_files() {
    echo -e "${YELLOW}Backing up uploaded files...${NC}"
    
    # Find upload directories
    UPLOAD_DIRS=(
        "services/video-service/uploads"
        "frontend/public/uploads"
        "shared/uploads"
    )
    
    for dir in "${UPLOAD_DIRS[@]}"; do
        if [ -d "$dir" ]; then
            echo "Backing up $dir..."
            cp -r "$dir" "$BACKUP_DIR/$DATE/"
        fi
    done
    
    echo -e "${GREEN}✓ File backup completed successfully${NC}"
}

# Function to backup configuration files
backup_configs() {
    echo -e "${YELLOW}Backing up configuration files...${NC}"
    
    # Create configs directory
    mkdir -p "$BACKUP_DIR/$DATE/configs"
    
    # Backup important config files
    CONFIG_FILES=(
        "deploy/docker/docker-compose.prod.yml"
        "deploy/docker/docker-compose.dev.yml"
        "deploy/helm/values.yaml"
        "deploy/terraform/aws/terraform.tfvars"
        "shared/constants/index.ts"
        ".env"
        ".env.production"
    )
    
    for file in "${CONFIG_FILES[@]}"; do
        if [ -f "$file" ]; then
            echo "Backing up $file..."
            cp "$file" "$BACKUP_DIR/$DATE/configs/"
        fi
    done
    
    echo -e "${GREEN}✓ Configuration backup completed successfully${NC}"
}

# Function to create backup manifest
create_manifest() {
    echo -e "${YELLOW}Creating backup manifest...${NC}"
    
    cat > "$BACKUP_DIR/$DATE/manifest.json" << EOF
{
    "backup_date": "$DATE",
    "backup_timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "database": {
        "host": "$DB_HOST",
        "port": "$DB_PORT",
        "name": "$DB_NAME",
        "user": "$DB_USER"
    },
    "redis": {
        "host": "$REDIS_HOST",
        "port": "$REDIS_PORT"
    },
    "files": [
        "database_backup.sql.gz",
        "redis_backup.rdb"
    ],
    "version": "1.0.0"
}
EOF
    
    echo -e "${GREEN}✓ Backup manifest created${NC}"
}

# Function to upload to S3
upload_to_s3() {
    if [ -n "$S3_BUCKET" ]; then
        echo -e "${YELLOW}Uploading backup to S3...${NC}"
        
        if ! command -v aws &> /dev/null; then
            echo -e "${RED}AWS CLI is not installed or not in PATH${NC}"
            return 1
        fi
        
        aws s3 sync "$BACKUP_DIR/$DATE" "s3://$S3_BUCKET/backups/$DATE/"
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ Backup uploaded to S3 successfully${NC}"
        else
            echo -e "${RED}✗ S3 upload failed${NC}"
            return 1
        fi
    fi
}

# Function to cleanup old backups
cleanup_old_backups() {
    echo -e "${YELLOW}Cleaning up old backups...${NC}"
    
    find "$BACKUP_DIR" -type d -name "20*" -mtime +$RETENTION_DAYS -exec rm -rf {} \;
    
    echo -e "${GREEN}✓ Old backups cleaned up (retention: $RETENTION_DAYS days)${NC}"
}

# Function to restore from backup
restore_backup() {
    local backup_date=$1
    
    if [ -z "$backup_date" ]; then
        echo -e "${RED}Please specify backup date (YYYYMMDD_HHMMSS)${NC}"
        return 1
    fi
    
    local backup_path="$BACKUP_DIR/$backup_date"
    
    if [ ! -d "$backup_path" ]; then
        echo -e "${RED}Backup directory $backup_path not found${NC}"
        return 1
    fi
    
    echo -e "${YELLOW}Restoring from backup: $backup_date${NC}"
    
    # Restore database
    if [ -f "$backup_path/database_backup.sql.gz" ]; then
        echo "Restoring database..."
        gunzip -c "$backup_path/database_backup.sql.gz" | psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME"
    fi
    
    # Restore Redis
    if [ -f "$backup_path/redis_backup.rdb" ]; then
        echo "Restoring Redis..."
        # Stop Redis, replace RDB file, start Redis
        redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" SHUTDOWN SAVE
        cp "$backup_path/redis_backup.rdb" /var/lib/redis/dump.rdb
        systemctl start redis
    fi
    
    echo -e "${GREEN}✓ Restore completed successfully${NC}"
}

# Main backup logic
case "$1" in
    "backup")
        create_backup_dir
        backup_database
        backup_redis
        backup_files
        backup_configs
        create_manifest
        upload_to_s3
        cleanup_old_backups
        echo -e "${GREEN}Backup completed successfully!${NC}"
        ;;
    "restore")
        restore_backup "$2"
        ;;
    "list")
        echo -e "${BLUE}Available backups:${NC}"
        ls -la "$BACKUP_DIR" | grep "^d" | awk '{print $9}' | grep "^20"
        ;;
    *)
        echo "Usage: $0 {backup|restore|list}"
        echo ""
        echo "Options:"
        echo "  backup [date]  - Create a new backup"
        echo "  restore [date] - Restore from backup (YYYYMMDD_HHMMSS)"
        echo "  list           - List available backups"
        echo ""
        echo "Environment variables:"
        echo "  BACKUP_DIR     - Backup directory (default: /backups)"
        echo "  DB_HOST        - Database host (default: localhost)"
        echo "  DB_PORT        - Database port (default: 5432)"
        echo "  DB_NAME        - Database name (default: lms_db)"
        echo "  DB_USER        - Database user (default: postgres)"
        echo "  REDIS_HOST     - Redis host (default: localhost)"
        echo "  REDIS_PORT     - Redis port (default: 6379)"
        echo "  S3_BUCKET      - S3 bucket for backup storage (optional)"
        echo "  RETENTION_DAYS - Backup retention in days (default: 30)"
        exit 1
        ;;
esac
