export default function Label({ text }: { text: string }) {
  return (
    <div className="z-10 bg-[url(/images/label.png)] bg-center bg-contain bg-no-repeat py-8 px-10 mt-4">
      <span className="text-xs flex justify-center items-center md:text-lg lg:text-2xl font-black">
        {text}
      </span>
    </div>
  );
}
