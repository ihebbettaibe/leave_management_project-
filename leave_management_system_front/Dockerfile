# Use standard Node.js image instead of Alpine to avoid native module issues
FROM node:22.12

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port 4200
EXPOSE 4200

# Start development server
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0", "--port", "4200"]
