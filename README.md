# Personal Finance Web Application

A full-stack personal finance management application that helps users track their accounts, transactions, income, expenses, and financial forecasts. Built with Next.js 16 on the frontend and Flask on the backend.

## Features

### Authentication & Security
- User registration and login with JWT authentication
- Secure password hashing with bcrypt
- Protected routes with token-based authorization
- Change username and password
- Account deletion functionality

### Financial Management
- **Dashboard**: Overview of financial health with net worth, total income, and expenses
- **Forecast Chart**: Linear regression visualization showing historical data and future predictions
- **Accounts Management**: Create, view, and delete financial accounts (Bank, Credit Card, Cash, Investment)
- **Transaction Tracking**: Add, edit, and delete income/expense transactions for each account
- **Recent Transactions**: Quick view of latest financial activities
- **Financial Statistics**: Key metrics and insights

### User Experience
- Responsive design with mobile hamburger menu
- Toast notifications for user feedback
- Form validation with Zod schemas
- Loading states and error handling
- Confirmation modals for destructive actions

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router, React 19.2)
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **HTTP Client**: Axios with JWT interceptors
- **Notifications**: Sonner (toast)

### Backend
- **Framework**: Flask (Python)
- **Authentication**: JWT tokens with Flask-JWT-Extended
- **Database**: SQLAlchemy ORM
- **Password Hashing**: bcrypt
- **API Design**: RESTful endpoints

## Project Structure
```
client/
├── app/
│   ├── (dashboard)/           # Protected dashboard routes
│   │   ├── layout.tsx         # Dashboard layout with sidebar
│   │   ├── dashboard/         # Main dashboard page
│   │   ├── accounts/          # Accounts listing & details
│   │   └── settings/          # User settings
│   ├── login/                 # Login page
│   ├── register/              # Registration page
│   └── page.tsx               # Landing page
├── components/
│   ├── auth/                  # Auth components (LoginForm, RegisterForm, AuthGuard)
│   ├── dashboard/             # Dashboard components (Charts, Cards, Stats)
│   ├── accounts/              # Account management components
│   ├── transactions/          # Transaction components
│   ├── settings/              # Settings forms
│   ├── layout/                # Sidebar navigation
│   ├── providers/             # Redux & Toast providers
│   └── ui/                    # shadcn/ui components
├── redux/
│   ├── store.ts               # Redux store configuration
│   ├── hooks.ts               # Typed Redux hooks
│   └── slices/                # Redux slices (auth, finance)
├── lib/
│   ├── axios-instance.ts      # Axios config with JWT interceptors
│   ├── utils.ts               # Utility functions
│   └── validations/           # Zod schemas
└── types/
    └── index.ts               # TypeScript interfaces

server/
├──  app/
│     ├── controllers/
│     │   ├── account_controller.py     # Handles account-related API routes (create, update, retrieve accounts)  
│     │   ├── analysis_controller.py    # Exposes endpoints for analytics features (forecast, summaries, reports)
│     │   ├── auth_controller.py        # Manages authentication routes (login, register, token handling)
│     │   ├── transaction_controller.py # Defines API routes for income/expense operations
│     │   └── user_controller.py        # Endpoints for user profile operations and user management               
│     ├── middlewares/
│     │   └── auth.py                   # Authentication middleware (JWT verification, user access protection)                  
│     ├── models/
│     │   ├── account.py                # SQLAlchemy model for accounts and balance-related fields 
│     │   ├── transaction.py            # SQLAlchemy model for transactions (amount, type, date, user relation)
│     │   └── user.py                   # SQLAlchemy model for user details (email, password hash, relationships)  
│     ├── services/
│     │   ├── account_service.py        # Business logic for account operations (CRUD, balance updates)           
│     │   ├── analysis_service.py       # Forecasting logic, statistical calculations, monthly summaries   
│     │   ├── transaction_service.py    # Logic for creating, filtering, and managing transactions   
│     │   └── user_service.py           # Logic for user creation, authentication, lookup, and updates
│     └── __init__.py                   # Initializes the Flask app, database, and application modules                        
├──   .env                              # Environment variables (DB URL, JWT secret, configs)
├──   .gitignore                        # Files and folders to ignore in Git
├──   config.py                         # Flask and database configuration settings
├──   requirements.txt                  # List of all Python package dependencies
└──   run.py                            # Application entry point to start the Flask server                       
```

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- Python 3.8+
- pip

### Backend Setup

1. Navigate to the backend directory:
```
cd backend
```

2. Create a virtual environment:
```
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```
pip install -r requirements.txt
```

4. Set up environment variables (create `.env` file):
```
SECRET_KEY=your-secret-key-here
SQLALCHEMY_DATABASE_URI=your database URL
```

5. Initialize the database:
```
flask db upgrade
```

6. Run the backend server:
```
flask run
```

The backend API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory (or project root):
```
cd client
```

2. Install dependencies:
```
npm install
```

3. Set up environment variables:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

4. Run the development server:
```
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user (returns JWT token)
- `PUT /api/change-password` - Change password (requires auth)

### Accounts
- `GET /api/accounts` - Get all accounts
- `POST /api/accounts` - Create new account
- `GET /api/accounts/:id` - Get account details
- `DELETE /api/accounts/:id` - Delete account

### Transactions
- `GET /api/accounts/:id/transactions` - Get transactions for account
- `POST /api/accounts/:id/transactions` - Add transaction to account
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Dashboard
- `GET /api/dashboard/summary` - Get financial summary (net worth, income, expenses)
- `GET /api/dashboard/forecast` - Get forecast data (history & predictions)
- `GET /api/dashboard/stats` - Get financial statistics
- `GET /api/dashboard/recent-transactions` - Get recent transactions

### User
- `PUT /api/users/username` - Update username
- `DELETE /api/users` - Delete user account

## Usage

### Getting Started

1. **Register**: Create a new account at `/register`
2. **Login**: Sign in at `/login`
3. **Add Accounts**: Navigate to `/accounts` and click "Add Account"
4. **Add Transactions**: Click on an account card to view details and add transactions
5. **View Dashboard**: Check `/dashboard` for financial overview and forecasts
6. **Manage Settings**: Update your profile at `/settings`

### Transactions
- **Income**: Money received (salary, gifts, etc.)
- **Expense**: Money spent (bills, purchases, etc.)

## Features in Detail

### Dashboard
- **Summary Cards**: Display net worth, total income, and total expenses
- **Forecast Chart**: Visual representation of financial trends with future predictions using linear regression
- **Recent Transactions**: Quick access to the latest 5 transactions
- **Statistics Card**: Additional financial insights

### Accounts
- View all accounts with current balances
- Click any account to view transaction history
- Delete accounts with confirmation modal

### Transactions
- Add income or expense transactions
- Edit existing transactions with modal form
- Delete transactions with confirmation modal
- Automatic balance calculation

## Security Features

- JWT token-based authentication
- Tokens stored in localStorage with automatic injection via Axios interceptors
- Automatic logout on 401 Unauthorized responses
- Protected routes with AuthGuard component
- Password validation (minimum 6 characters for registration)
- Confirmation dialogs for destructive actions

## Development Notes

### State Management
- Redux Toolkit for global state (auth, finance data)
- `authSlice` manages user authentication state
- `financeSlice` manages accounts, transactions, and dashboard data
- Async thunks for API calls with loading and error states

### Styling
- Tailwind CSS v4 with custom design tokens in `globals.css`
- shadcn/ui components for consistent UI
- Responsive design with mobile-first approach
- Dark mode support via CSS variables

### Forms
- React Hook Form for form state management
- Zod schemas for validation
- Custom error messages and field-level validation


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author 
Dilshodbek Gulomov MSc Computer Science @ ELTE
