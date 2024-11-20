import { useWatch } from "react-hook-form";
import { Sequence } from "@/lib/schema";

interface SequenceComponentProps {
  onClick: () => void;
  nipple: Sequence;
  nippleFormName: string;
  getWidthInPercentage: (seconds?: string | number) => string;
}

export function SequenceComponent({
  onClick,
  nipple,
  nippleFormName,
  getWidthInPercentage,
}: SequenceComponentProps) {
  useWatch({
    name: nippleFormName,
  });

  return (
    <div key={nipple.label + nipple.start}>
      <label
        onClick={onClick}
        title={nipple.label}
        htmlFor={`${nippleFormName}.label`}
        className="relative block h-3 cursor-pointer bg-yellow-300 hover:bg-yellow-400"
        style={{
          left: getWidthInPercentage(nipple.start),
          width: getWidthInPercentage(nipple.end - nipple.start),
        }}
      />
    </div>
  );
}
