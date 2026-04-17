import { Layout } from "./Layout";

interface PlaceholderProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export function Placeholder({ title, description, icon: Icon }: PlaceholderProps) {
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          {Icon && (
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-blue-50 rounded-full">
                <Icon className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          )}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600 mb-6">{description}</p>
          <p className="text-sm text-gray-500">
            Continue working with the assistant to build out this page's features.
          </p>
        </div>
      </div>
    </Layout>
  );
}
