import 'bootstrap/dist/css/bootstrap.min.css';         // Bootstrap CSS
import 'bootstrap-icons/font/bootstrap-icons.css';     // Bootstrap Icons
import "@fontsource-variable/jost";
import AdminPanelLinks from '@/components/admin/AdminPanelLinks';



export const metadata = {
  title: 'Kumar Fashion Store',
  description: 'Online clothing store for stylish men and women',
};

export default function orders({ children }) {
  return (
    <html lang="en">
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
