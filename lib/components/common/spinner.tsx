import { Loader2 } from 'lucide-react';

function Spinner({
  center,
}: {
  center?: boolean;
}) {
  return (
    <div
      className={
        center
          ? 'flex w-full items-center justify-center'
          : ''
      }
    >
      <Loader2
        size={32}
        className="animate-spin"
      />
    </div>
  );
}

export default Spinner;
