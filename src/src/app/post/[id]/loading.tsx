export default function ThreadLoading() {
  return (
    <div className="mx-auto max-w-board px-[18px] py-12">
      <div className="animate-pulse font-courier text-sm text-faded">
        <div className="mb-4 h-4 w-32 bg-rule" />
        <div className="mb-2 h-8 w-3/4 bg-rule" />
        <div className="mb-4 h-4 w-48 bg-rule" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-rule" />
          <div className="h-3 w-full bg-rule" />
          <div className="h-3 w-2/3 bg-rule" />
        </div>
      </div>
    </div>
  );
}
