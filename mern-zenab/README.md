# ZENAB AI - Smart Tree Air Monitoring System

## Overview
A complete MERN stack application demonstrating the ZENAB concept: Artificial solar-powered "trees" placed in urban locations measuring PM2.5 and transmitting data via Bluetooth to a centralized dashboard for real-time visualization and AI-powered insights.

## Project Structure
- `frontend/`: Vite + React + Tailwind + Leaflet Map + Chart.js
- `backend/`: Node.js + Express + MongoDB (Mongoose) + JWT Auth
- `ml-service/`: Python Flask + scikit-learn for PM2.5 trend prediction
- `mock_data.js`: Script to populate MongoDB with 6 months of historical data

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- MongoDB Atlas Deployment (or Local MongoDB)

### 1. MongoDB Setup
In your MongoDB URI, ensure you've created a database (e.g., `zenabdb`) and whitelist your IP address.

### 2. Backend Setup
```bash
cd backend
npm install
```
Edit `backend/.env` with your MongoDB URI and JWT Secret.
```bash
npm run dev
```

### 3. ML Service Setup
*(Optional: Provide forecasting predictions based on Historical Data)*
```bash
cd ml-service
python -m venv venv
.\venv\Scripts\activate  # Windows
pip install -r requirements.txt
python app.py
```

### 4. Frontend Setup
```bash
cd frontend
npm install
```
Rename `frontend/.env.example` to `frontend/.env`.
```bash
npm run dev
```

### 5. Generate Mock Data (Optional but recommended for History/ML features)
In the root directory, configure `backend/.env` first, then run:
```bash
npm install mongoose dotenv
node mock_data.js
```

## Features
- **Auth**: JWT-based User Authentication
- **Bluetooth**: Web Bluetooth API UI to connect to a Tree device
- **Real-time Map**: Map of all trees in India with PM2.5 color coding
- **Predictive AI**: ML endpoint forecasts the upcoming 30 days of pollution based on local 6-month historical windows
- **Actionable Insights**: AI recommendations based on CPCB guidelines
