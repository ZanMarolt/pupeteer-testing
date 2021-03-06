const puppeteer = require('puppeteer');

const waitAndGetText = async (page, selector) => {
    const element = await page.waitFor(selector);
    return await page.evaluate(element => element.textContent.trim(), element);
};

describe('Track-e2e', () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({headless: false});
  });

  afterAll(async () => {
    await browser.close();
  });

  it('application loads, shows number of online users, can send a message, and is accessible', async () => {

    const page = await browser.newPage();
     // Start tracing
    await page.tracing.start({path: 'full-suite.json', screenshots: true});
    await page.goto('https://zan-chat.herokuapp.com/');

    const numClients = await waitAndGetText(page, '#num-clients:not(:empty)');
    expect(numClients).toBe('1');

    const message = 'Hello, Google IO!';
    await page.type('#message', message);
    await page.click('#send');

    const displayedText = await waitAndGetText(page, '.my-message');
    expect(displayedText).toBe(message);

    // Stop tracing
    await page.tracing.stop();

    await page.close();

  });
})
