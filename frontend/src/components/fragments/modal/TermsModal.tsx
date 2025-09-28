type TermsProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function TermsModal({ onClose, isOpen }: TermsProps) {
  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/30 flex justify-center items-center z-50"
        >
          <div className="w-full h-[300px] overflow-y-auto p-4 flex justify-center sm:max-w-[80%] sm:h-[90%]">
            <iframe
              src="/syarat_dan_ketentuan.pdf"
              width="100%"
              height="100%"
              style={{ minHeight: '80vh' }}
            />
          </div>
        </div>
      )}
    </>
  );
}
