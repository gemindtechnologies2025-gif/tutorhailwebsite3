import Header from "./header";
import Footer from "./footer";

export const Layout = ({ children }: { children: any }) => {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    );
};
