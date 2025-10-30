import 'bootstrap/dist/css/bootstrap.min.css';         // Bootstrap CSS
import 'bootstrap-icons/font/bootstrap-icons.css';     // Bootstrap Icons
import { Jost } from 'next/font/google';               // Example Google Font
import AdminPanelLinks from '@/components/admin/AdminPanelLinks';

// Load Jost font
const jost = Jost({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-jost'
});

export const metadata = {
  title: 'Kumar Fashion Store',
  description: 'Online clothing store for stylish men and women',
};

export default function users({ children }) {
  return (
    <html lang="en" className={jost.variable}>
        {/* Navbar could be here if global */}
        
        <main>
             <div className="row m-0" style={{ backgroundColor: "#F9FAFB" }}>
                  {/* Sidebar */}
                  <div className="bg-white border-end col-12 col-md-2 p-0 d-md-block">
                    <AdminPanelLinks />
                  </div>
                  <div className='col-12 col-md-10'>

          {children}
                  </div>
                  </div>
        </main>
        
        {/* Footer could be here if global */}
        
        {/* Bootstrap JS (only if you use modals, dropdowns, etc.) */}
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
          async
        ></script>
    </html>
  );
}
