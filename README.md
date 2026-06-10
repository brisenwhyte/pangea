# Pangea - Finance Tracker

A modern, full-featured personal finance tracking application built with React, TypeScript, and Firebase. Track your expenses, manage budgets, and gain insights into your spending habits with an intuitive user interface.

**Live Demo:** [https://pangeatracker.netlify.app/](https://pangeatracker.netlify.app/)

---

## 🎯 Overview

Pangea is a web-based finance tracker designed to help users manage their personal finances efficiently. The application provides real-time expense tracking, budget management, and financial insights through an interactive and modern user interface.

### Key Features

- **User Authentication** - Secure login and registration powered by Firebase
- **Profile Management** - Set up user profiles with personalized settings
- **Expense Tracking** - Log and categorize transactions with ease
- **Budget Planning** - Create and monitor budgets across different categories
- **Interactive Dashboard** - View financial summaries and spending trends
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Smooth Animations** - Enhanced user experience with Framer Motion animations
- **Toast Notifications** - Real-time feedback for user actions

---

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library for building interactive interfaces
- **TypeScript** - Type-safe JavaScript for scalable development
- **React Router DOM v7** - Client-side routing and navigation
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Framer Motion** - Animation library for smooth transitions
- **React Hot Toast** - Toast notification system
- **Lucide React** - Beautiful icon library
- **React Calendar** - Interactive calendar component
- **Emoji Picker React** - Emoji selection functionality

### Backend & Services
- **Firebase** - Authentication, Firestore database, and hosting
- **Firebase Authentication** - Secure user authentication
- **Firestore** - Real-time cloud database

### Development Tools
- **Vite** - Next-generation frontend build tool
- **TypeScript** - Type checking and development tools
- **ESLint** - Code linting and style enforcement
- **PostCSS** - CSS processing with Tailwind CSS integration
- **Autoprefixer** - Automatic vendor prefix support

---

## 📁 Project Structure

```
pangea/
├── src/
│   ├── components/           # Reusable React components
│   │   ├── Auth/             # Authentication components
│   │   │   ├── LoginScreen.tsx
│   │   │   └── ProfileSetup.tsx
│   │   └── Dashboard/        # Dashboard components
│   │       └── Dashboard.tsx
│   ├── hooks/                # Custom React hooks
│   │   └── useAuth.ts        # Authentication hook
│   ├── App.tsx               # Main App component
│   ├── main.tsx              # React DOM entry point
│   └── index.css             # Global styles
├── public/                   # Static assets
├── index.html                # HTML entry point
├── package.json              # Project dependencies
├── tsconfig.json             # TypeScript configuration
├── tsconfig.app.json         # App TypeScript configuration
├── tsconfig.node.json        # Node TypeScript configuration
├── vite.config.ts            # Vite configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
├── eslint.config.js          # ESLint configuration
└── .gitignore                # Git ignore file
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- A Firebase project (for backend services)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/brisenwhyte/pangea.git
   cd pangea
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Firebase:**
   - Create a `.env` file in the root directory
   - Add your Firebase configuration:
     ```
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

---

## 📖 Usage

### Authentication Flow

1. **Login Screen** - Users can log in with existing credentials or create a new account
2. **Profile Setup** - New users are guided through a profile setup process
3. **Dashboard** - Authenticated users are redirected to the main dashboard

### Main Features

#### Dashboard
- View financial summary and key metrics
- Monitor spending trends
- Access budget information
- Quick navigation to all features

#### Expense Tracking
- Log new transactions with amount, category, and date
- Categorize expenses for better organization
- View transaction history
- Edit or delete existing transactions

#### Budget Management
- Set budget limits for different categories
- Monitor budget progress
- Receive alerts when approaching budget limits
- Adjust budgets as needed

---

## 🔄 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint for code quality
npm run lint
```

---

## 🎨 Styling

The project uses **Tailwind CSS** for styling, providing a utility-first approach to building responsive designs. Key configuration files:

- `tailwind.config.js` - Tailwind customization
- `postcss.config.js` - PostCSS plugins (Autoprefixer, Tailwind)
- `src/index.css` - Global styles and Tailwind directives

---

## 🔐 Authentication & Security

- Firebase Authentication handles secure user sign-up and login
- Support for multiple authentication methods
- Automatic session management
- Protected routes with role-based access
- Secure data storage in Firestore with proper security rules

---

## 📱 Responsive Design

Pangea is fully responsive and optimized for:
- 📱 Mobile devices (360px and up)
- 📱 Tablets (768px and up)
- 💻 Desktop (1024px and up)

---

## 🎭 UI/UX Features

- **Smooth Animations** - Framer Motion for fluid transitions
- **Toast Notifications** - Real-time feedback with React Hot Toast
- **Interactive Calendar** - React Calendar for date selection
- **Icon Library** - Lucide React icons for consistent design
- **Emoji Support** - Emoji picker for transaction notes
- **Loading States** - Visual indicators during data loading
- **Error Handling** - User-friendly error messages

---

## 📊 Data Management

### Firestore Database Structure

Users' financial data is organized in Firestore collections:

- **users** - User profile information
- **expenses** - Transaction records
- **budgets** - Budget entries and limits
- **categories** - Transaction categories

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Quality
- Follow the existing code style
- Run `npm run lint` before committing
- Ensure TypeScript types are properly defined
- Add tests for new features when applicable

---

## 📝 License

This project is open source and available under the MIT License.

---

## 🙋 Support

For support, questions, or feedback:

- 📧 Open an issue on GitHub
- 💬 Check existing discussions
- 🐛 Report bugs with detailed information

---

## 🔗 Links

- **Repository:** [https://github.com/brisenwhyte/pangea](https://github.com/brisenwhyte/pangea)
- **Live Demo:** [https://pangeatracker.netlify.app/](https://pangeatracker.netlify.app/)
- **Issues:** [https://github.com/brisenwhyte/pangea/issues](https://github.com/brisenwhyte/pangea/issues)

---

## 📈 Roadmap

Future features and improvements:

- [ ] Advanced analytics and charts
- [ ] Export financial reports (PDF, CSV)
- [ ] Recurring transaction templates
- [ ] Multi-currency support
- [ ] Dark mode theme
- [ ] Mobile app (React Native)
- [ ] Budget forecasting
- [ ] Transaction import from bank statements
- [ ] Social sharing features
- [ ] Collaborative budgeting for families

---

## 🙏 Acknowledgments

- **React** - UI library foundation
- **Firebase** - Backend services and authentication
- **Tailwind CSS** - Modern CSS framework
- **Vite** - Lightning-fast build tool
- All contributors and users of Pangea

---

**Built with ❤️ by [brisenwhyte](https://github.com/brisenwhyte)**

Last updated: 2025
