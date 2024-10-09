# Use the official Node.js image with Node.js 10 on Alpine Linux
FROM docker.io/node:10-alpine

# Create the application directory and set permissions
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

# Set the working directory inside the container
WORKDIR /home/node/app

# Copy package.json to the working directory
COPY package.json ./

# Switch to the node user for installing dependencies
USER node

# Install the application dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY --chown=node:node . .

# Expose port 7860 for the application
EXPOSE 7860

# Command to run the application
CMD [ "node", "server.js" ]
