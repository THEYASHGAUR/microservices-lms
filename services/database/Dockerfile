# Custom PostgreSQL Dockerfile for LMS
# This extends the official PostgreSQL image with custom configurations

FROM postgres:15-alpine

# Set environment variables
ENV POSTGRES_DB=lms_db
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=password
ENV POSTGRES_INITDB_ARGS="--auth-host=scram-sha-256 --auth-local=scram-sha-256"

# Copy initialization scripts
COPY init.sql /docker-entrypoint-initdb.d/
COPY config/postgresql.conf /etc/postgresql/postgresql.conf
COPY config/pg_hba.conf /etc/postgresql/pg_hba.conf

# Create logs directory
RUN mkdir -p /var/log/postgresql

# Set proper permissions
RUN chown -R postgres:postgres /var/log/postgresql

# Expose PostgreSQL port
EXPOSE 5432

# Use custom configuration
CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"]
