# Use the official Golang image
FROM golang:1.25-alpine

# Set the working directory
WORKDIR /app

# Copy the source code
COPY . .

# Download dependencies
RUN go mod download

# Build the app
RUN go build -o main .

# Expose the port your Gin server uses
EXPOSE 8080

# Start the application
CMD ["./main"]
