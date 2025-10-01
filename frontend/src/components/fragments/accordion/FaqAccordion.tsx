export default function FaqAccordion({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <details className=" text-black">
      <summary className="bg-white py-2 px-4 rounded-sm border-2 border-bg-primary before:content-[''] before:block before:w-5 before:h-5 before:bg-bg-secondary before:rounded-full flex items-center gap-2 cursor-pointer font-black text-lg">
        {title}
      </summary>
      <div className="flex flex-col mt-4 bg-white py-2 px-4 rounded-sm border-2 border-bg-primary">
        <h3 className="before:content-[''] before:block before:w-5 before:h-5 before:bg-bg-primary before:rounded-full  flex items-center gap-2 font-black text-lg">
          {title}
        </h3>
        <p className="pl-7 text-justify text-xs md:text-sm lg:text-base">
          {content}
        </p>
      </div>
    </details>
  );
}
