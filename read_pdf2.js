const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
const fs = require('fs');

const pdfPath = '\\\\wsl.localhost\\ubuntu\\home\\furne\\projects\\masso-bombero\\temari-bombers.pdf';

async function main() {
    try {
        const buf = fs.readFileSync(pdfPath);
        const data = new Uint8Array(buf);
        const loadingTask = pdfjsLib.getDocument({ data });
        const pdf = await loadingTask.promise;
        console.log('Pages:', pdf.numPages);

        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const pageText = content.items.map(item => item.str).join(' ');
            fullText += `\n--- PAGE ${i} ---\n${pageText}\n`;
        }

        fs.writeFileSync('pdf_text.txt', fullText);
        console.log('Done! Text saved.');
        console.log(fullText.substring(0, 3000));
    } catch(err) {
        console.error('Error:', err.message, err.stack);
    }
}
main();
