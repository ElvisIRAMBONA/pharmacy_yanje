# Pharmacy System Frontend

React frontend for the Django Pharmacy System API.

## Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start Django backend:
```bash
cd ..
python manage.py runserver
```

3. Start React frontend:
```bash
cd frontend
npm start
```

## Features

- **Dashboard**: Overview with stats, low stock alerts, expired medicines
- **Medicines**: List all medicines with status indicators
- **Inventory**: Stock levels and reorder alerts
- **Sales**: Sales history with invoice download

## API Endpoints Used

- `/api/medicines/` - Medicine CRUD operations
- `/api/inventory/` - Inventory management
- `/api/sales/` - Sales transactions
- `/api/auth/` - Authentication
- `/api/suppliers/` - Supplier management

## Components Structure

```
src/
├── services/api.js     # API service layer
├── pages/              # Page components
│   ├── Dashboard.js
│   ├── MedicinesList.js
│   ├── SalesList.js
│   └── InventoryList.js
├── App.js             # Main app with routing
└── App.css           # Styles
```