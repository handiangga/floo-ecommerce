"use client";

interface EmptyProps {
  title?: string;
}

export default function Empty({ title = "No Data" }: EmptyProps) {
  return (
    <div className="py-20 text-center">
      <p className="text-gray-500">{title}</p>
    </div>
  );
}
