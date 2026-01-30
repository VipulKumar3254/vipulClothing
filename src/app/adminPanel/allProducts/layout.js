import 'bootstrap/dist/css/bootstrap.min.css';         // Bootstrap CSS
import 'bootstrap-icons/font/bootstrap-icons.css';     // Bootstrap Icons
import { Jost } from 'next/font/google';               // Example Google Font
import AdminPanelLinks from '@/components/admin/AdminPanelLinks';
import Script from 'next/script';

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

export default function allProducts({ children }) {
  return (
    <html lang="en" className={jost.variable}>
      <body>
        {/* Navbar could be here if global */}
        
             <div className="row m-0" style={{ backgroundColor: "#F9FAFB" }}>
                  {/* Sidebar */}
                  <div className="bg-white border-end col-12 col-md-2 p-0 d-md-block">
                    <AdminPanelLinks />
                  </div>
                  <div className='col-12 col-md-10'>

          {children}
                  </div>
                  </div>
        
        {/* Footer could be here if global */}
        
        {/* Bootstrap JS (only if you use modals, dropdowns, etc.) */}
      
      </body>
    </html>
  );
}
