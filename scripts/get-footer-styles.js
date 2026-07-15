(async () => {
  try {
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle2', timeout: 30000 });

    const result = await page.evaluate(() => {
      const el = document.querySelector('footer');
      if (!el) return { exists: false };

      function getInfo(elem) {
        const cs = getComputedStyle(elem);
        const rect = elem.getBoundingClientRect();
        return {
          tag: elem.tagName.toLowerCase(),
          className: elem.className || null,
          display: cs.display,
          visibility: cs.visibility,
          opacity: cs.opacity,
          height: rect.height,
          width: rect.width,
          position: cs.position,
          overflow: cs.overflow,
          color: cs.color,
        };
      }

      const chain = [];
      let node = el;
      while (node) {
        chain.push(getInfo(node));
        if (node.tagName.toLowerCase() === 'body') break;
        node = node.parentElement;
      }

      return { exists: true, element: getInfo(el), parents: chain };
    });

    console.log(JSON.stringify(result, null, 2));
    await browser.close();
  } catch (err) {
    console.error('ERROR', err && err.message ? err.message : err);
    process.exit(1);
  }
})();
