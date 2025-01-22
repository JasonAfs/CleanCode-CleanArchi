FROM node:20-alpine

# Install Python and build dependencies
RUN apk add --update --no-cache python3 make g++ gcc

WORKDIR /usr/src/app

# Copy package.json files
COPY package*.json ./
COPY src/infrastructure/react/triumph-fleet-ui/package*.json ./src/infrastructure/react/triumph-fleet-ui/

# Install dependencies in root and React app
RUN npm install
RUN cd src/infrastructure/react/triumph-fleet-ui && npm install

# Copy the rest of the application
COPY . .

# Set working directory to React app
WORKDIR /usr/src/app/src/infrastructure/react/triumph-fleet-ui

# Add vite to PATH
ENV PATH /usr/src/app/src/infrastructure/react/triumph-fleet-ui/node_modules/.bin:$PATH

# Run the dev server
CMD ["npm", "run", "dev"]