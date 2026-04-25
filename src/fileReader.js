// ── File reading utilities with PDF.js support ──────────────────────────────

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

async function loadPdfJs() {
  if (window.pdfjsLib) return;
  await new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
  window.pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

async function extractTextFromPdf(file) {
  await loadPdfJs();
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    pages.push(`[Page ${i}]\n${pageText}`);
  }
  return pages.join('\n\n');
}

function isPrintable(str) {
  if (!str || str.length === 0) return false;
  const printable = str.split('').filter(c => c.charCodeAt(0) > 31 && c.charCodeAt(0) < 127).length;
  return printable / str.length > 0.75;
}

export async function extractFileContent(file) {
  const isPdf = file.type === 'application/pdf';
  const isText = file.type === 'text/plain';

  if (isPdf) {
    try {
      const text = await extractTextFromPdf(file);
      if (text && text.trim().length > 50) return text;
      return `[PDF: ${file.name}] — Could not extract text. The PDF may be scanned/image-based. Try copying the text and saving as .txt.`;
    } catch (err) {
      throw new Error(`PDF extraction failed: ${err.message}`);
    }
  }

  if (isText) {
    return readFileAsText(file);
  }

  // Word / PowerPoint — try reading as text, fall back gracefully
  try {
    const text = await readFileAsText(file);
    if (isPrintable(text)) return text;
    return `[${file.name}] — This file format cannot be read directly in the browser. Please save as .txt or .pdf and re-upload.`;
  } catch {
    return `[${file.name}] — Could not read file content.`;
  }
}
