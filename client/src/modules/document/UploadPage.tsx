import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { uploadPdf } from "../../api/document.api";
import { useAuth } from "../auth/auth.hooks";
import Button from "../../shared/components/Button";
import Card from "../../shared/components/Card";

const HAS_DOCUMENTS_KEY = "has_documents";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [hasDocuments, setHasDocuments] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    // Check if user has uploaded documents
    const hasDocs = localStorage.getItem(HAS_DOCUMENTS_KEY) === "true";
    setHasDocuments(hasDocs);
  }, []);

  const upload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await uploadPdf(file);
      setSuccess(true);
      // Mark that user has documents
      localStorage.setItem(HAS_DOCUMENTS_KEY, "true");
      setHasDocuments(true);
      // Navigate to chat after a brief delay
      setTimeout(() => {
        navigate("/chat");
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Upload Document</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium"
        >
          Logout
        </button>
      </div>

      <Card>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select PDF File
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0] || null;
                setFile(selectedFile);
                setError(null);
                setSuccess(false);
              }}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 file:transition-all file:duration-200 file:cursor-pointer cursor-pointer"
            />
            {file && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {file.name}
              </p>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-600">
                PDF uploaded successfully! Redirecting to chat...
              </p>
            </div>
          )}

          <Button onClick={upload} disabled={!file || loading}>
            {loading ? "Uploading..." : "Upload PDF"}
          </Button>

          <div className="pt-4 border-t">
            <button
              onClick={() => navigate("/chat")}
              disabled={!hasDocuments}
              className={`w-full text-sm py-2.5 rounded-lg transition-all duration-200 font-medium ${
                hasDocuments
                  ? "text-gray-700 hover:text-gray-900 hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
                  : "text-gray-400 cursor-not-allowed bg-gray-100 border border-gray-200"
              }`}
            >
              {hasDocuments ? "Go to Chat →" : "Upload a document first"}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
