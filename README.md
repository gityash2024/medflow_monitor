# MedFlow Monitor - DICOM Medical Imaging Pipeline Monitoring System

A comprehensive Medical Imaging Pipeline Monitoring web application with modern UI/UX, animations, and three user roles (Administrator, Technician, Radiologist).

## Features

- 🏥 **Medical-Grade UI**: Professional medical interface with dark theme
- 👥 **Role-Based Access Control**: Three user roles with different permissions
- 📊 **Real-Time Dashboard**: Live pipeline monitoring with statistics
- 🔍 **Study Management**: View, filter, and manage DICOM studies
- 📄 **Reports**: Generated report viewing and downloading
- 👤 **User Management**: Create and manage system users (Admin only)
- 📝 **Audit Logs**: Complete activity timeline (Admin only)
- ⚙️ **Settings**: Comprehensive system configuration (Admin only)
- 🎨 **Modern Animations**: Smooth transitions with Framer Motion
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile

## Technology Stack

- **Framework**: React 18+ with Vite
- **UI Library**: Tailwind CSS + shadcn/ui components
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **Tables**: TanStack Table (React Table v8)
- **Forms**: React Hook Form + Zod validation
- **Toast Notifications**: Sonner
- **Routing**: React Router DOM v6
- **State Management**: Zustand
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd "MedFlow Monitor"
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Demo Accounts

You can log in with any of these demo accounts:

- **Administrator**: `admin@hospital.com` / `admin123`
- **Technician**: `tech@hospital.com` / `tech123`
- **Radiologist**: `radio@hospital.com` / `radio123`

Or use the demo account buttons on the login page for quick access.

## User Roles

### Administrator
- Full access to all pages
- Can create/edit/delete users
- Can view audit logs
- Can modify settings

### Technician
- Dashboard, Studies, Viewer, Reports
- Can view and monitor studies
- Can retry failed studies
- Cannot access Users, Audit, Settings

### Radiologist
- Dashboard, Studies, Viewer, Reports
- Read-only access
- Can view studies and reports
- Can open DICOM viewer
- Cannot access Users, Audit, Settings

## Project Structure

```
src/
├── assets/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── auth/            # Authentication components
│   ├── dashboard/       # Dashboard components
│   ├── studies/         # Study-related components
│   ├── viewer/          # DICOM viewer components
│   ├── reports/        # Report components
│   ├── users/          # User management components
│   ├── audit/          # Audit log components
│   ├── settings/       # Settings components
│   └── layout/         # Layout components (Sidebar, Header)
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── store/              # Zustand stores
├── utils/              # Utility functions and constants
├── mock/               # Mock data
├── App.jsx             # Main app component with routing
└── main.jsx            # Entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Color Theme

The application uses a medical professional color palette:

- **Primary**: #0066CC (Medical Blue)
- **Secondary**: #00A3BF (Teal)
- **Accent**: #6366F1 (Indigo)
- **Success**: #10B981 (Green)
- **Warning**: #F59E0B (Amber)
- **Error**: #EF4444 (Red)
- **Background**: #0F172A (Dark Navy)
- **Surface**: #1E293B (Slate)

## Features in Detail

### Dashboard
- Real-time statistics (Total Studies, Running, Completed, Failed)
- Live pipeline visualization with 6-stage progress
- Recent studies table with quick actions

### Studies
- Comprehensive study listing with filters
- Search by Study UID, Patient ID, or description
- Filter by modality and status
- Detailed study view with pipeline progress
- Pipeline logs timeline
- Report viewing and downloading

### Users (Admin Only)
- User listing with filters
- Create new users with slide-over modal
- Role and status management
- User activity tracking

### Audit Logs (Admin Only)
- Activity timeline visualization
- Filter by action type
- Search by user or resource
- IP address tracking

### Settings (Admin Only)
- General settings (site name, timezone, language)
- Pipeline configuration (retry settings, XNAT server)
- Notification preferences
- Security settings (session timeout, MFA, IP restrictions)

## Future Enhancements

- [ ] OHIF Viewer integration
- [ ] Real-time WebSocket updates
- [ ] API integration
- [ ] Advanced filtering and sorting
- [ ] Export functionality
- [ ] Email notifications
- [ ] Multi-language support

## License

This project is proprietary software.

## Support

For issues or questions, please contact the development team.
# medflow_monitor
