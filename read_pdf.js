const { PDFParse } = require('pdf-parse');
const fs = require('fs');
const path = require('path');

const pdfPath = '\\\\wsl.localhost\\ubuntu\\home\\furne\\projects\\masso-bombero\\temari-bombers.pdf';

async function main() {
    try {
        const buf = fs.readFileSync(pdfPath);
        console.log('PDF loaded, size:', buf.length);
        const parser = new PDFParse();
        const data = await parser.parse(buf);
        console.log('Pages:', data.numpages);
        // Print first 12000 chars
        const outPath = path.join(__dirname, 'pdf_text.txt');
        fs.writeFileSync(outPath, data.text);
        console.log('Text saved to pdf_text.txt');
        console.log('Preview:');
        console.log(data.text.substring(0, 3000));
    } catch(err) {
        console.error('Error:', err.message);
    }
}
main();
