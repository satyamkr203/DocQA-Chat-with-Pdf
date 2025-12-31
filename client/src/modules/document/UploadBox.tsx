export default function UploadBox({
  onSelect,
}: {
  onSelect: (file: File) => void;
}) {
  return (
    <input
      type="file"
      accept="application/pdf"
      onChange={(e) => {
        if (e.target.files?.[0]) {
          onSelect(e.target.files[0]);
        }
      }}
    />
  );
}
