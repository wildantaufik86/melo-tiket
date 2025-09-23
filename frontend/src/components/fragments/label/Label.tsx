export default function Label({ text }: { text: string }) {
  return (
    <div className="z-10 bg-[url(/images/label.png)] bg-center bg-contain bg-no-repeat py-2 px-6 mt-4">
      <span className="text-xs flex justify-center items-center md:text-lg lg:text-xl">
        {text}
      </span>
    </div>
  );
}
