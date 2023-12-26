# Use the official Node.js image with LTS tag
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package.json ./

# Install dependencies
RUN npm install


# Copy the rest of the application code
COPY . .

RUN npm run build

# Expose the port that the app will run on
EXPOSE 5173

# Command to run your application
CMD ["npm", "run", "preview"]
