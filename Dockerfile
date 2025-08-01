# Use Node.js 20 Alpine image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/

# Install dependencies
RUN npm install
RUN cd client && npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the client
RUN npm run build

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "start"] 