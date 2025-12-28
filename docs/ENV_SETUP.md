# Environment Setup Instructions

## Backend Environment (.env)

Create a file named `.env` in the `backend/` directory with the following content:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string_here
JWT_SECRET=lumina_book_hub_secret_key_change_in_production_2024
NODE_ENV=development
```

**Important**: Replace `your_mongodb_atlas_connection_string_here` with your actual MongoDB Atlas connection string.

### Getting MongoDB Atlas Connection String:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free cluster if you haven't already
3. Click "Connect" on your cluster
4. Choose "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Add database name: `/lumina-book-hub`

Example:
```
mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/lumina-book-hub?retryWrites=true&w=majority
```

## Docker Environment (.env)

Create a file named `.env` in the root directory with:

```env
MONGODB_URI=your_mongodb_atlas_connection_string_here
JWT_SECRET=lumina_book_hub_secret_key_change_in_production_2024
```

## Frontend Environment (.env) - Optional

For local development, create `.env` in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

For Docker deployment, this is not needed as Nginx will proxy the requests.

> [!IMPORTANT]
> **Port 5000 Conflict (macOS Users)**
> If you are on macOS, Port 5000 is often used by **AirPlay Receiver**. To run this project on port 5000:
> 1. Go to **System Settings** > **General** > **AirDrop & Handoff**.
> 2. Uncheck **AirPlay Receiver**.
> 3. Alternatively, you can change the port in `docker-compose.yml` to `5001:5000`.
