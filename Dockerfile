###################
# BUILD FOR LOCAL DEVELOPMENT
###################
FROM node:18-alpine AS development

# Create app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY --chown=node:node package*.json ./

# Install app dependencies using `npm ci`
RUN npm ci --legacy-peer-deps


# Bundle app source
COPY --chown=node:node . .

# Use the node user from the image (instead of the root user)
USER node

###################
# BUILD FOR PRODUCTION
###################
FROM node:18-alpine AS build

WORKDIR /usr/src/app

# Copy dependency manifests and install dependencies from the development stage
COPY --chown=node:node package*.json ./

# Copy the node_modules from the development image
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

# Copy the source code
COPY --chown=node:node . .

# Run the build command which creates the production bundle
RUN npm run build

# Set NODE_ENV environment variable
ENV NODE_ENV production

# Clean up and install production dependencies only
RUN npm ci --only=production --legacy-peer-deps && npm cache clean --force

USER node

###################
# PRODUCTION
###################
FROM node:18-alpine AS production

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

# Expose the port on which the app will run
EXPOSE 3000

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
