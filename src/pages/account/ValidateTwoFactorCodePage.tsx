export default function ValidateTwoFactorCodePage() {
  return (
    <div className="w-full max-w-md p-8 bg-card rounded-lg shadow-lg border space-y-4">
      <h1 className="text-2xl font-bold">Enter verification code</h1>
      <p className="text-sm text-muted-foreground">Enter the 6-digit code we sent you. (Form — coming soon.)</p>
    </div>
  );
}
