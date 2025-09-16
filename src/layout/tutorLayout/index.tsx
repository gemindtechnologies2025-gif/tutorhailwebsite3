import TutorHeader from "./header";

export const TutorLayout = ({ className = '', children }: { className?: string, children: React.ReactNode }) => {
    return (
        <>
            <div className={`${className}`}>
                <TutorHeader />
                {children}
            </div>
        </>
    );
};
