#!/usr/bin/env node

const puppeteer = require('puppeteer');
const PDFDocument = require('pdfkit');
const fs = require('fs');


void async function main() {
  const imgs = [...Array(4).keys()];
  imgs.forEach(async v => {
    await createImgs(v);
  });
  await createPDF(imgs);
  await deleteImgs(imgs);
}();


async function createImgs(fileNum) {
  return new Promise(
    async (resolve, reject) => {
      try {
        const browser = await puppeteer.launch({ 
          headless: !process.argv[2],
          args: [
            '--no-sandbox'
          ]
        });
        const page = await browser.newPage();
        await page.goto('http://127.0.0.1:8080/');
        await page.setViewport({ width: 1000, height: 600 });
        await page.screenshot({ path: `./imgs/example${fileNum}.png` });

        await browser.close();
        return resolve();
      } catch (error) {
        if (error) console.error(error);
        return reject(err);
      }
    }
  );
}

async function createPDF (fileNum) {
  return new Promise(
    (resolve, reject) => {
      const opts = {
        layout: 'landscape',
        margins: {
          bottom: 100,
        }
      }
      const doc = new PDFDocument(opts); 
      doc.pipe(fs.createWriteStream('output.pdf'));
      fileNum.forEach(v => {
        if (v !== 0) doc.addPage();
        doc.image(`./imgs/example${v}.png`, 0, 15, {fit: [800, 700]});
      });
      doc.end();
      if (false) return reject();
      return resolve();
    }
  );
}

async function deleteImgs(num) {
  return new Promise(
    (resolve, reject) => {
      fs.unlink('./imgs/example0.png', (err) => {
        if (err) reject(err);
        console.log('done')
        return resolve();
      });
    }
  );
}

