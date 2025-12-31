import Providers from "./providers";
import AppRoutes from "./routes";

export default function App() {
  return (
    <Providers>
      <div className="min-h-screen py-8 px-4">
        <div className="w-full max-w-7xl mx-auto">
          <AppRoutes />
        </div>
      </div>
    </Providers>
  );
}
