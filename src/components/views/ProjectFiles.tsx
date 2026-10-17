import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Download, 
  FileCode, 
  Image, 
  FileSpreadsheet, 
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getProjectTheme } from '../../utils/theme';
import { ProjectFile } from '../../types';

interface ProjectFilesProps {
  projectId: string;
}

export const ProjectFiles: React.FC<ProjectFilesProps> = ({ projectId }) => {
  const { files, uploadFile, getProject, currentUser } = useApp();
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState<'figma' | 'pdf' | 'doc' | 'image' | 'code'>('pdf');

  const project = getProject(projectId);
  const theme = project ? getProjectTheme(project.color) : null;
  const projectFiles = files.filter((f) => f.projectId === projectId);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    uploadFile({
      projectId,
      name: newFileName.trim(),
      size: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`,
      fileType: newFileType,
      uploadedBy: currentUser.name,
    });

    setNewFileName('');
    setIsUploading(false);
  };

  const handleDownload = (fileId: string) => {
    setDownloadSuccessId(fileId);
    setTimeout(() => setDownloadSuccessId(null), 2000);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'figma':
        return <span className="text-purple-600 font-bold text-xs bg-purple-100 px-1.5 py-0.5 rounded">FIG</span>;
      case 'pdf':
        return <FileText className="w-5 h-5 text-rose-500" />;
      case 'doc':
        return <FileSpreadsheet className="w-5 h-5 text-blue-500" />;
      case 'image':
        return <Image className="w-5 h-5 text-amber-500" />;
      default:
        return <FileCode className="w-5 h-5 text-emerald-500" />;
    }
  };

  return (
    <div className="bg-white/85 backdrop-blur-sm rounded-3xl p-6 border border-purple-100/80 shadow-xs space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-purple-50">
        <div>
          <h3 className="font-heading text-lg font-bold text-gray-900">
            Project Deliverables & Assets
          </h3>
          <p className="text-xs text-gray-600 font-medium mt-0.5">
            Design files, specifications, wireframes, and documentation
          </p>
        </div>

        <button
          onClick={() => setIsUploading(!isUploading)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs"
          style={{ backgroundColor: theme?.primary || '#8B5CF6' }}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload File</span>
        </button>
      </div>

      {/* Upload Dialog */}
      {isUploading && (
        <form onSubmit={handleUpload} className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100 space-y-3">
          <div className="text-xs font-bold text-gray-800">Register New Project Asset</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="e.g. Navigation_Spec_v2.pdf"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              required
              className="sm:col-span-2 text-xs p-2.5 rounded-xl bg-white border border-purple-200 outline-none focus:ring-2 focus:ring-purple-300"
            />
            <select
              value={newFileType}
              onChange={(e) => setNewFileType(e.target.value as ProjectFile['fileType'])}
              className="text-xs p-2.5 rounded-xl bg-white border border-purple-200 outline-none font-medium"
            >
              <option value="pdf">PDF Document</option>
              <option value="figma">Figma File</option>
              <option value="doc">Word / Doc</option>
              <option value="image">Image Asset</option>
              <option value="code">Code / Spec</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsUploading(false)}
              className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold text-white rounded-xl bg-purple-600 hover:bg-purple-700 shadow-xs"
            >
              Save File
            </button>
          </div>
        </form>
      )}

      {/* Files List */}
      <div className="divide-y divide-purple-50">
        {projectFiles.map((file) => (
          <div
            key={file.id}
            className="py-3.5 flex items-center justify-between gap-3 hover:bg-purple-50/50 rounded-2xl px-3 -mx-3 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
                {getFileIcon(file.fileType)}
              </div>
              <div className="truncate">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {file.name}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-600 mt-0.5">
                  <span className="font-semibold text-gray-700">{file.size}</span>
                  <span>·</span>
                  <span>Added by {file.uploadedBy}</span>
                  <span>·</span>
                  <span>{file.uploadedAt}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleDownload(file.id)}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  downloadSuccessId === file.id
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-white hover:bg-purple-50 text-gray-700 border border-gray-200/80 shadow-xs'
                }`}
                title="Download file"
              >
                {downloadSuccessId === file.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden sm:inline">Downloaded</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Download</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}

        {projectFiles.length === 0 && (
          <div className="py-12 text-center text-xs text-gray-500">
            No deliverables uploaded to this project yet. Click &quot;Upload File&quot; to attach assets.
          </div>
        )}
      </div>
    </div>
  );
};
