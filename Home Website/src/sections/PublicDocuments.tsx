import { useState, useEffect } from 'react';
import { Download, Eye, X, UploadCloud } from 'lucide-react';
import { api } from '../services/api';
import type { DocumentItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useDocumentSections } from '../hooks/useDocumentSections';
import { SectionHeading } from '../components/Common/SectionHeading';

function AttachedImages({ doc }: { doc: DocumentItem }) {
  if (!doc.images || doc.images.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {doc.images.map((img) => (
        <a key={img.url} href={img.url} target="_blank" rel="noreferrer" title={img.name}>
          <img
            src={img.url}
            alt={img.name || doc.title}
            className="w-14 h-14 rounded-md object-cover border border-gray-200 dark:border-gray-700 hover:opacity-80 transition-opacity"
          />
        </a>
      ))}
    </div>
  );
}

export function PublicDocuments() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { isTamil } = useLanguage();
  const [sectionFilter, setSectionFilter] = useState('all');
  const { sections, sectionOf, labelFor } = useDocumentSections();
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const data = await api.getPublicDocuments();
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  // Only offer filters for sections that actually have documents
  const usedSections = sections.filter((s) => documents.some((d) => sectionOf(d.section) === s.id));
  const visibleDocs =
    sectionFilter === 'all' ? documents : documents.filter((d) => sectionOf(d.section) === sectionFilter);

  const handleView = (docId: string) => {
    setCurrentPdfUrl(api.viewDocumentUrl(docId));
    setPdfModalOpen(true);
  };

  const handleCloseModal = () => {
    setPdfModalOpen(false);
    setCurrentPdfUrl(null);
  };

  return (
    <section className="py-20 bg-theme-bg relative z-10" id="documents">
      <div className="container mx-auto px-4 max-w-7xl">
        <SectionHeading
          title={isTamil ? 'ஆவணங்கள் மற்றும் தகவல்கள்' : 'Documents and Information'}
          subtitle={isTamil ? 'முக்கிய ஆவணங்கள் மற்றும் தகவல்கள்' : 'Important Documents and Information'}
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme-primary"></div>
            <p className="text-sm text-theme-text">
              {isTamil ? 'ஆவணங்கள் ஏற்றப்படுகின்றன...' : 'Loading documents...'}
            </p>
          </div>
        ) : (
          <>
          {usedSections.length > 1 && (
            <div className="mt-10 flex flex-wrap justify-center gap-2">
              {[{ id: 'all', labelEn: 'All', labelTa: 'அனைத்தும்' }, ...usedSections].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSectionFilter(s.id)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                    sectionFilter === s.id
                      ? 'bg-brand-primary text-on-primary border-brand-primary'
                      : 'border-theme-border text-theme-text hover:bg-theme-secondary'
                  }`}
                >
                  {isTamil ? s.labelTa : s.labelEn}
                </button>
              ))}
            </div>
          )}
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                    <th className="py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300 w-16 text-center">
                      {isTamil ? 'வ.எண்' : 'S.NO'}
                    </th>
                    <th className="py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {isTamil ? 'ஆவணங்கள் / தகவல்கள்' : 'DOCUMENTS / INFORMATIONS'}
                    </th>
                    <th className="py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300 w-64">
                      <div className="flex items-center gap-2">
                        <UploadCloud className="w-4 h-4" />
                        <span>{isTamil ? 'பதிவேற்றப்பட்ட ஆவணங்கள்' : 'UPLOADED DOCUMENTS'}</span>
                      </div>
                    </th>
                    <th className="py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300 w-48 text-center">
                      {isTamil ? 'செயல்கள்' : 'ACTIONS'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {visibleDocs.map((doc, index) => (
                    <tr key={doc._id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150">
                      <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400 text-center">{index + 1}</td>
                      <td className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-gray-100">
                        {doc.title}
                        {sectionOf(doc.section) !== 'general' && (
                          <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-primary/10 text-brand-primary align-middle">
                            {labelFor(doc.section)}
                          </span>
                        )}
                        {doc.description && (
                          <p className="text-xs text-gray-500 mt-1 font-normal">{doc.description}</p>
                        )}
                        <AttachedImages doc={doc} />
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400 truncate max-w-[250px]">
                        {doc.fileUrl ? (
                          <span className="flex items-center text-emerald-600 dark:text-emerald-400">
                            <span className="truncate">{doc.fileName}</span>
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">
                            {isTamil ? 'ஆவணம் கிடைக்கவில்லை' : 'Document not available'}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {doc.fileUrl ? (
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => handleView(doc._id)}
                              className="flex items-center px-3 py-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50 rounded-md transition-colors text-xs font-semibold"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              {isTamil ? 'பார்க்க' : 'VIEW'}
                            </button>
                            <a
                              href={api.downloadDocumentUrl(doc._id)}
                              className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 rounded-md transition-colors text-xs font-semibold"
                            >
                              <Download className="w-4 h-4 mr-1" />
                              {isTamil ? 'பதிவிறக்கம்' : 'DOWNLOAD'}
                            </a>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400 italic text-center block">
                            {isTamil ? 'கிடைக்கவில்லை' : 'Not Available'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {visibleDocs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-500">
                        {isTamil ? 'ஆவணங்கள் எதுவும் இல்லை.' : 'No documents available.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-700">
              {visibleDocs.map((doc, index) => (
                <div key={doc._id} className="p-5 flex flex-col space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-gray-500">
                      {isTamil ? 'ஆவணம்' : 'Document'} {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 leading-snug">{doc.title}</h4>
                    {doc.description && <p className="text-sm text-gray-500 mt-1">{doc.description}</p>}
                    <AttachedImages doc={doc} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">PDF:</p>
                    {doc.fileUrl ? (
                      <p className="text-sm text-emerald-600 dark:text-emerald-400 truncate">{doc.fileName}</p>
                    ) : (
                      <p className="text-sm text-gray-400 italic">
                        {isTamil ? 'ஆவணம் கிடைக்கவில்லை' : 'Document not available'}
                      </p>
                    )}
                  </div>
                  {doc.fileUrl && (
                    <div className="flex items-center space-x-3 pt-2">
                      <button
                        onClick={() => handleView(doc._id)}
                        className="flex-1 flex justify-center items-center px-4 py-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-md transition-colors text-sm font-semibold"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        {isTamil ? 'PDF பார்க்க' : 'VIEW PDF'}
                      </button>
                      <a
                        href={api.downloadDocumentUrl(doc._id)}
                        className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 rounded-md transition-colors"
                        aria-label={isTamil ? 'PDF பதிவிறக்கவும்' : 'Download PDF'}
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
              {visibleDocs.length === 0 && (
                <div className="py-8 text-center text-gray-500">
                  {isTamil ? 'ஆவணங்கள் எதுவும் இல்லை.' : 'No documents available.'}
                </div>
              )}
            </div>
          </div>
          </>
        )}
      </div>

      {/* PDF Viewer Modal */}
      {pdfModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 w-full max-w-5xl h-[85vh] rounded-xl overflow-hidden flex flex-col shadow-2xl animate-fade-in-up">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                <Eye className="w-5 h-5 mr-2 text-theme-primary" />
                {isTamil ? 'ஆவண காட்சி' : 'Document Viewer'}
              </h3>
              <button
                onClick={handleCloseModal}
                aria-label={isTamil ? 'மூடவும்' : 'Close'}
                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 w-full bg-gray-100 dark:bg-gray-800 p-2">
              {currentPdfUrl ? (
                <iframe
                  src={currentPdfUrl}
                  className="w-full h-full rounded border-0"
                  title={isTamil ? 'PDF காட்சி' : 'PDF Viewer'}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  {isTamil ? 'PDF ஏற்ற முடியவில்லை' : 'Failed to load PDF'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
