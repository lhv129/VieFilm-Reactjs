// ClientLayout.jsx
import ClientHeader from './ClientHeader';
import ClientFooter from './ClientFooter';

const ClientLayout = ({ children }) => (
    <>
        <ClientHeader />
        <main>{children}</main>
        <ClientFooter />
    </>
);

export default ClientLayout;
