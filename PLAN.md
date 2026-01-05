# Role-Based Access Control Implementation Plan

## Objective
Implement access control so that:
- **Admin**: Sees the entire system (all pages and features)
- **Pharmacist**: Sees only their dedicated pages (Dashboard, Medicines, Inventory, Sales)

---

## 1. Backend Changes

### 1.1 Update User Model (`apps/users/models.py`)
- Add 'admin' role to ROLE_CHOICES
- Keep only 'admin' and 'pharmacist' as valid roles

### 1.2 Create Permission Classes (`apps/users/permissions.py`)
- `IsAdmin`: Only admin users can access
- `IsPharmacist`: Only pharmacist users can access
- `IsAdminOrPharmacist`: Both admin and pharmacist can access

### 1.3 Update Views with Role-Based Permissions
- **Users views**: Only admin can list/create users
- **Medicines views**: Admin and Pharmacist can access
- **Inventory views**: Admin and Pharmacist can access
- **Sales views**: Admin and Pharmacist can access
- **Suppliers views**: Only admin can access (pharmacist cannot manage suppliers)

### 1.4 Update Serializers
- Add role validation to prevent invalid role assignments
- Admin role can only be created by another admin

---

## 2. Frontend Changes

### 2.1 Update App.js (`frontend/src/App.js`)
- Show all navigation links for admin
- Show limited navigation links for pharmacist (hide Suppliers)
- Add role-based redirect logic

### 2.2 Create Pharmacist Dashboard (`frontend/src/pages/PharmacistDashboard.js`)
- Create simplified dashboard for pharmacist
- Show only relevant stats and alerts

### 2.3 Update Dashboard (`frontend/src/pages/Dashboard.js`)
- Add role check to show admin-specific features

### 2.4 Update AuthPage and Login
- Store user role in localStorage
- Redirect based on role after login

---

## 3. File Changes Summary

### Backend Files to Modify:
1. `apps/users/models.py` - Update ROLE_CHOICES
2. `apps/users/permissions.py` - Create new file with permission classes
3. `apps/users/views.py` - Add permission classes
4. `apps/users/serializers.py` - Add role validation

### Frontend Files to Modify:
1. `frontend/src/App.js` - Add role-based navigation
2. `frontend/src/components/Login.js` - Store role in localStorage
3. `frontend/src/pages/Dashboard.js` - Update for role-based content

### New Files to Create:
1. `apps/users/permissions.py` - Permission classes
2. `frontend/src/pages/PharmacistDashboard.js` - Pharmacist-specific dashboard (optional)

---

## 4. Implementation Steps

### Step 1: Backend - Update User Model
```python
# Update ROLE_CHOICES
ROLE_CHOICES = [
    ('admin', 'Admin'),
    ('pharmacist', 'Pharmacist'),
]
```

### Step 2: Backend - Create Permission Classes
```python
from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

class IsPharmacist(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'pharmacist'
```

### Step 3: Backend - Update Views
- Add `@permission_classes([IsAdmin])` to UserListCreateAPIView
- Add `@permission_classes([IsAdminOrPharmacist])` to medicines, inventory, sales views
- Restrict suppliers views to admin only

### Step 4: Frontend - Update App.js
```javascript
const adminLinks = [
  { path: '/', label: 'Dashboard' },
  { path: '/medicines', label: 'Medicines' },
  { path: '/inventory', label: 'Inventory' },
  { path: '/sales', label: 'Sales' },
  { path: '/suppliers', label: 'Suppliers' },
  { path: '/users', label: 'Users' },
];

const pharmacistLinks = [
  { path: '/', label: 'Dashboard' },
  { path: '/medicines', label: 'Medicines' },
  { path: '/inventory', label: 'Inventory' },
  { path: '/sales', label: 'Sales' },
];
```

---

## 5. Testing

After implementation:
1. Create an admin user
2. Create a pharmacist user
3. Test admin access to all pages
4. Test pharmacist access (should not see Suppliers or Users pages)
5. Test API endpoints with different roles

