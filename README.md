# Linguini Holidays CRM - ClientView360

A modern, responsive CRM dashboard built with Next.js 14, designed specifically for travel companies to manage their clients and leads.

## 🚀 Features

### Core Functionality
- **Customer Management**: Complete CRUD operations for customer records
- **Advanced Search & Filtering**: Search by name, phone, destination, status, and more
- **Real-time Comments**: Add timestamped comments to customer records
- **Role-based Access**: Admin and user roles with appropriate permissions
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

### Customer Data Fields
- **Basic Info**: Name, Phone (with Indian +91 validation), Email
- **Travel Details**: Destination, Travel Start/End Dates, Number of Pax
- **Lead Management**: Lead Creation Date, Package Type (Private/Group), Lead Type
- **Status Tracking**: Fresh, No Response, Ongoing, Converted, Dead, Future, Hot
- **Comments System**: Timestamped comments with user attribution

### Technical Features
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- **Type Safety**: Full TypeScript implementation
- **Database Integration**: Supabase backend with fallback to mock data
- **Authentication**: Secure login system with user management
- **Toast Notifications**: Real-time feedback for all operations
- **Pagination**: Efficient handling of large datasets

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with mock fallback
- **State Management**: React Context + useState
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd linguini-holidays
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

### Supabase Configuration

1. **Create a new Supabase project** at [supabase.com](https://supabase.com)

2. **Run the database schema** (see `supabase-schema.sql`):
   ```sql
   -- Copy and paste the contents of supabase-schema.sql into your Supabase SQL editor
   ```

3. **Update environment variables** with your Supabase credentials

4. **Enable Row Level Security (RLS)** on all tables

### Database Tables

- **customers**: Main customer records with all travel and lead information
- **customer_comments**: Timestamped comments linked to customers
- **users**: User management (handled by Supabase Auth)

## 🚀 Deployment

### Vercel Deployment

1. **Push to GitHub** (or upload as zip)
2. **Connect to Vercel** at [vercel.com](https://vercel.com)
3. **Add environment variables** in Vercel dashboard
4. **Deploy** - Vercel will automatically build and deploy

### Environment Variables for Production
```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
```

## 📱 Usage

### Login
- Use any email/password combination (mock authentication)
- Real Supabase authentication when configured

### Managing Customers
1. **View All Customers**: Dashboard shows all customer records
2. **Add New Customer**: Click "Add Customer" button
3. **Search & Filter**: Use the search bar and filter dropdowns
4. **View Details**: Click the eye icon to view full customer details
5. **Edit Customer**: Click the edit icon to modify customer information
6. **Add Comments**: Use the comments section in customer details

### Customer Status Management
- **Fresh**: New leads that need initial contact
- **No Response**: Leads that haven't responded to outreach
- **Ongoing**: Active conversations and negotiations
- **Converted**: Successfully closed deals
- **Dead**: Leads that are no longer viable
- **Future**: Leads for future follow-up
- **Hot**: High-priority leads requiring immediate attention

## 🔧 Development

### Project Structure
```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
├── contexts/           # React Context providers
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
└── styles/             # Global styles
```

### Key Files
- `src/lib/supabase.ts` - Database configuration
- `src/lib/mockData.ts` - Fallback data for development
- `src/hooks/useCustomers.ts` - Customer data management
- `src/contexts/AuthContext.tsx` - Authentication state

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary software developed for Linguini Holidays Private Limited.

## 📞 Support

For technical support or questions, please contact the development team.

---

**Linguini Holidays Private Limited**  
*Tours & Travel Company*  
www.linguiniholidays.com