
interface SettingsLayoutProps {
    children: React.ReactNode
}

export default async function SettingsLayout ({children}: SettingsLayoutProps) {
    return (
        <div className="min-h-screen w-full flex bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800 overflow-y-auto p-4">
                {children}
        </div>
    )
}