# Use an official Node.js runtime as a parent image for a small, efficient container.
FROM node:18-alpine

# Set the working directory inside the container. All subsequent commands will run from here.
WORKDIR /app

# Copy package.json to the working directory.
COPY package.json ./

# Install only the production dependencies listed in package.json.
# This avoids installing development tools like 'nodemon' in the final image.
RUN npm install --only=production

# Copy the rest of the backend source code (server.js, routes/, etc.) into the container.
COPY . .

# Expose port 3001 to allow communication from other Docker containers (like the proxy).
EXPOSE 3001

# Define the command to start the Node.js server when the container launches.
CMD [ "node", "server.js" ]