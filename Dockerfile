FROM node:latest

# Prepare a temp directory for backend
RUN mkdir -p /temp/backend

# Copy backend to the temp directory
# COPY /backend /temp/backend

WORKDIR /backend

# Install dependencies
RUN npm install

# Prepare a directory for finished application
RUN mkdir /app

# # Move node_modules to the app directory
# RUN mv /temp/backend/node_modules /app

# Move built backend go to the app
RUN mv /backend/* /app

# Prepare a temp directory for frontend
# RUN mkdir -p /temp/frontend

# Copy frontend to the temp directory
# COPY /frontend /temp/frontend

WORKDIR /frontend

# Install dependencies
RUN npm install

# Build frontend code
RUN npm run build

# Prepare a directory for built frontend code
RUN mkdir -p /app/build

# Move built front end to the app directory
RUN mv /temp/frontend/build/* /app/build

# Delete all temporary stuff
# RUN rm -r /temp

WORKDIR /app

# Expose container port 5000
EXPOSE 5000

# Run application
ENTRYPOINT ["node", "server.js"]
