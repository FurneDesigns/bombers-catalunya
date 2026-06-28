import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf.mjs';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

// No worker in Node.js environment

const pdfPath = '\\\\wsl.localhost\\ubuntu\\home\\furne\\projects\\masso-bombero\\temari-bombers.pdf';

async function main() {
    const buf = fs.readFileSync(pdfPath);
    const data = new Uint8Array(buf);
    const loadingTask = getDocument({ data, useWorkerFetch: false, isEvalSupported: false, useSystemFonts: true });
    const pdf = await loadingTask.promise;
    console.log('Pages:', pdf.numPages);

    let fullText = '';
    const maxPages = Math.min(pdf.numPages, 50);
    for (let i = 1; i <= maxPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map(item => item.str).join(' ');
        fullText += `\n--- PAGE ${i} ---\n${pageText}\n`;
        if (i <= 3) console.log(`Page ${i}:`, pageText.substring(0, 300));
    }

    fs.writeFileSync('pdf_text.txt', fullText);
    console.log('Done! Full text saved to pdf_text.txt');
}
main().catch(console.error);
