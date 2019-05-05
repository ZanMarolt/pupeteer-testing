const puppeteer = require('puppeteer');
const pti = require('puppeteer-to-istanbul');

const waitAndGetText = async (page, selector) => {
    const element = await page.waitFor(selector);
    return await page.evaluate(element => element.textContent.trim(), element);
};

describe('Code-coverage-e2e', () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({headless: false});
  });

  afterAll(async () => {
    await browser.close();
  });

  it('Generate istanbul code coverage report', async () => {
    const page = await browser.newPage();

    await page.coverage.startJSCoverage();

    await page.goto('https://zan-chat.herokuapp.com/');

    const numClients = await waitAndGetText(page, '#num-clients:not(:empty)');
    expect(numClients).toBe('1');

    const message = 'Hello, Google IO!';
    await page.type('#message', message);
    await page.click('#send');

    const displayedText = await waitAndGetText(page, '.my-message');
    expect(displayedText).toBe(message);

    const jsCoverage = await page.coverage.stopJSCoverage();
    pti.write(jsCoverage);

    await page.close();
  });
})
