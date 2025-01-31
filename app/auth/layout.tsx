const AuthLayout = ({children}: {children: React.ReactNode}) => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800 overflow-y-auto p-4">
            {children}
        </div>
    )
}

export default AuthLayout