export default function HumanMessage({
  id,
  part,
}: {
  id: string;
  part: { text: string };
}) {
  return (
    <div
      key={id}
      className="p-2 border w-fit rounded-sm bg-gray-100 border-gray-200/50 shadow-xs my-4 max-w-[200px]"
    >
      <p className="whitespace-pre-wrap text-sm">{part.text}</p>
    </div>
  );
}
