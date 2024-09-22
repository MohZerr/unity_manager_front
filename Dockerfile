# Step 1 : Create a base image
FROM nginx:alpine

# Step 2 : Copie the dist folder to the nginx folder
COPY dist /usr/share/nginx/html

# Step 3 : Expose the port 80
EXPOSE 80