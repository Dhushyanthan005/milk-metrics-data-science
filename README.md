# Smart Dairy Farm Analytics & Milk Yield Prediction

An enterprise-grade ML-driven AI analytics platform built for dairy herds. It connects a high-accuracy **XGBoost Regressor model** (39 biological/climatic parameters) to a clean FastAPI backend and a gorgeous, glassmorphic Vite React dual-theme frontend dashboard.

---

## 📂 Project Structure

```
smart-dairy/
├── backend/                    # FastAPI ASGI Backend App
│   ├── app/
│   │   ├── api/                # FastAPI endpoint route controllers
│   │   │   ├── prediction.py   # POST /api/predict
│   │   │   ├── analytics.py    # GET /api/analytics
│   │   │   ├── feature_importance.py # GET /api/feature-importance
│   │   │   └── history.py      # GET /api/history
│   │   ├── config/
│   │   │   └── settings.py     # Configuration schemas (MONGO_URI, CORS, etc.)
│   │   ├── ml/
│   │   │   └── model_loader.py # XGBoost serialization loading hooks
│   │   ├── services/           # Business logic & preprocessors
│   │   │   ├── preprocessing_service.py # Feature index sequences & category casting
│   │   │   └── feature_service.py       # Decoders & gain lists
│   │   └── utils/
│   │       ├── mongo.py        # Client pooling for MongoDB Atlas
│   │       └── logger.py       # Consolidated console log handlers
│   ├── main.py                 # ASGI initialization and startup loops
│   ├── requirements.txt        # Backend dependencies listing
│   └── app/models/             # Holds XGBoost pkl weights
├── frontend/                   # Vite React SPA App
│   ├── src/
│   │   ├── config/
│   │   │   └── api.js          # Axios configuration and mock fallbacks
│   │   ├── services/
│   │   │   └── api.js          # Centralized apiService wrapper calls
│   │   ├── components/
│   │   │   └── Skeleton.jsx    # Pulsing loaders for cards, charts, tables
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx  # Dark/Light mode sidebar responsive layout
│   │   └── features/
│   │       ├── dashboard/      # Dashboard cards and climate widgets
│   │       ├── analytics/      # Chart.js yield distributions & breed comparisons
│   │       ├── predictions/    # Input prediction forms & radial success gauges
│   │       ├── reports/        # Downloadable PDF reports using jsPDF
│   │       └── history/        # Searchable and filterable prediction logs
│   ├── package.json            # React 19 dependencies & scripts
│   └── vite.config.js          # Vite build config with Tailwind CSS v4
└── .env.example                # Example deployment environment settings
```

---

## 🔌 Reusable API Service Documentation

All endpoints are wrapped inside the reusable [`frontend/src/services/api.js`](file:///c:/milk%20yield/frontend/src/services/api.js) wrapper:

### 1. Run Predictive Inference
* **Endpoint**: `POST /api/predict`
* **Pydantic Schema**: `PredictRequest`
* **Request JSON Payload example**:
```json
{
  "breed": "Holstein",
  "age": 4,
  "weight": 600.0,
  "feed_quantity": 15.0,
  "water_intake": 80.0,
  "temperature": 20.0,
  "humidity": 60.0,
  "season": "summer",
  "disease_status": false,
  "body_condition_score": 3.5,
  "days_in_milk": 60
}
```
* **Response Payload (Success 200)**:
```json
{
  "predicted_milk_yield": 24.32,
  "prediction_time": "2026-07-09T22:15:31Z",
  "model_version": "2026-07-09T13:49:10Z",
  "confidence_message": "Normal confidence"
}
```

### 2. Fetch Aggregated Analytics
* **Endpoint**: `GET /api/analytics`
* **Response Payload (Success 200)**:
```json
{
  "average_milk_yield": 24.3,
  "highest_yield": 38.6,
  "lowest_yield": 12.1,
  "average_temperature": 21.8,
  "average_feed_quantity": 16.4,
  "breed_distribution": { "Holstein": 45, "Jersey": 28, "Guernsey": 12, "Brown Swiss": 15 }
}
```

### 3. Fetch Relative Feature Importance
* **Endpoint**: `GET /api/feature-importance`
* **Response Payload (Success 200)**:
```json
{
  "labels": ["Previous_Week_Avg_Yield", "Breed", "Lactation_Stage", "Disease_Status"],
  "datasets": [
    {
      "label": "Feature importance",
      "data": [0.9338, 0.0087, 0.0064, 0.0051]
    }
  ]
}
```

### 4. Fetch Prediction Log Audits
* **Endpoint**: `GET /api/history`
* **Response Payload (Success 200)**:
```json
[
  {
    "id": "64ab82c9e...",
    "timestamp": "2026-07-09T22:15:31Z",
    "input_features": { "cattle_id": 1, "breed": "Holstein", "body_condition_score": 3.5 },
    "predicted_yield": 24.32
  }
]
```

---

## ⚡ Setup & Installation

### Prerequisite Environment settings
Create a copy of [`.env.example`](file:///c:/milk%20yield/.env.example) and name it `.env` in both folders. Refer to the environment keys listed below:
* **Backend (`.env`)**:
  - `MONGO_URI`: The MongoDB Atlas connection string.
  - `MONGO_DB`: The target database name (`smart_dairy`).
  - `CORS_ORIGINS`: Allowed client domains (`["https://your-app.vercel.app"]`).
* **Frontend (`.env`)**:
  - `VITE_API_URL`: The deployed FastAPI root URL (`https://your-api.onrender.com/api`).

### Local Development Startup

1. **Start the FastAPI Backend**:
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
2. **Start the Vite React Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## 🧪 Testing Guide

### 1. Manual API verification
We supplied quick test scripts inside `scratch/` to verify predicting capacity directly:
```bash
# Execute model prediction POST requests
python scratch/test_prediction_api.py
```
Or query endpoints directly via **Swagger UI** at `http://127.0.0.1:8000/docs`.

### 2. Frontend Build Verification
Verify there are no TypeScript/Vite compilation errors by compiling the production bundle locally:
```bash
cd frontend
npm run build
```

---

## 🚀 Deployment Guide

### Step 1: Database Setup (MongoDB Atlas)
1. Register a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Shared Cluster and name your database `smart_dairy`.
3. Create a Database User under **Database Access** with read-and-write permissions.
4. Add `0.0.0.0/0` under **Network Access** to allow serverless functions (like Render/Vercel) to reach the cluster.
5. Retrieve your connection string from the **Connect** tab (e.g. `mongodb+srv://...`).

### Step 2: Backend Setup (Render Web Service)
1. Log into [Render Dashboard](https://render.com) and create a **New Web Service**.
2. Connect your Git repository containing the `backend` folder.
3. Configure the following environment configurations:
   - **Environment**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add the following keys under **Environment Variables**:
   - `MONGO_URI`: Your MongoDB Atlas URI.
   - `MONGO_DB`: `smart_dairy`
   - `ENV`: `production`
   - `CORS_ORIGINS`: `["https://your-frontend.vercel.app"]`
5. Render will build the image, mount the XGBoost model `app/models/milk_yield_prediction_model.pkl`, and output a public URL (e.g., `https://smart-dairy-api.onrender.com`).

### Step 3: Frontend Setup (Vercel)
1. Log into [Vercel](https://vercel.com) and select **Add New Project**.
2. Select your repository, specify `frontend` as the root subdirectory directory, and click **Configure**.
3. Vercel automatically maps configuration for **Vite** apps. Verify the configuration:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add the Environment Variable:
   - `VITE_API_URL`: Your Render backend URL (`https://smart-dairy-api.onrender.com/api`).
5. Deploy. Vercel compiles the production bundle and supplies a dynamic layout domain.

---

## 🔒 Enterprise Best Practices

### Performance Optimization
* **Connection Pooling**: MongoDB connections are instantiated inside global singletons inside [`mongo.py`](file:///c:/milk%20yield/backend/app/utils/mongo.py) to prevent connection leakage on serverless architectures.
* **Component-Level Lazy Loading**: React components render skeletons during latency windows instead of holding blank screens, preventing layout shift.
* **Asset Minification**: Rollup compresses CSS and Javascript bundles below 1MB, ensuring fast load times.

### Security
* **CORS Whitelists**: Ensure `CORS_ORIGINS` in your production settings restricts access to your Vercel client domain.
* **Strict Type Validation**: FastAPI uses Pydantic's compiler to block malicious, out-of-range parameters (e.g. BCS > 5.0) before passing them to the XGBoost predictor.
