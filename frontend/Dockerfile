# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the project
COPY . .

# Build the project
RUN npm run build

# Expose the port Next.js runs on
EXPOSE 3001

# Start the application
CMD ["npm", "start"]
