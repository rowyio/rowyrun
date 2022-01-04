FROM node:16-slim

# Create and change to the app directory.
WORKDIR /workdir

RUN \
# Update
apt-get update -y && \
# Install curl
apt-get install curl -y && \
# Install python
apt-get install python -y 



RUN curl -sSL https://sdk.cloud.google.com | bash
ENV PATH $PATH:/root/google-cloud-sdk/bin

COPY package*.json ./
COPY . ./
# Install production dependencies.
# If you add a package-lock.json, speed your build by switching to 'npm ci'.
# RUN npm ci --only=production
RUN yarn
RUN npx tsc
RUN yarn build
# Copy local code to the container image.


# Run the web service on container startup.
CMD [ "yarn", "start" ]