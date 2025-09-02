export default function DashboardHeader() {
  return (
    <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-6 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src="/dashen logo.png"
            alt="Dashen Bank Logo"
            className="h-12 w-auto object-contain"
          />
          <h1 className="text-2xl font-bold text-white">
           Temporary CBS Dashboard
          </h1>
        </div>

        <div className="flex items-center space-x-6">
          <div className="text-right">
            <p className="text-sm text-blue-200">Welcome back</p>
            <p className="text-lg font-semibold text-white">Guest</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
            Guest
          </div>
        </div>
      </div>
    </div>
  );
}
