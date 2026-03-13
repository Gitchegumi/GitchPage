import AccountPipe from "@/components/account/AccountPipe";
import { FinPipeMenu } from "@/components/utilities/FinPipeMenu";

export default function AccountPipePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
          AccountPipe
        </h1>
        <p className="text-gray-400 mb-6">
          Manage your accounts in one place. All data stays on your device.
        </p>
        <FinPipeMenu current="accountpipe" />

        <AccountPipe />
      </div>
    </div>
  );
}