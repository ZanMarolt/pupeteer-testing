const puppeteer = require('puppeteer');

jest.setTimeout(20000);

const waitAndGetText = async (page, selector) => {
    const element = await page.waitFor(selector);
    return await page.evaluate(element => element.textContent.trim(), element);
};

const openChat = async (browser) => {
    const page = await browser.newPage();
    await page.goto('http://localhost:3002/');

    await page.waitFor('#num-clients:not(:empty)');

    return page;
};

const sendMessage = async (page, messageText) => {
    await page.bringToFront();
    await page.type('#message', messageText, { delay: 50 });
    await page.click('#send');
    const displayedText = await waitAndGetText(page, '.my-message');
    expect(displayedText).toBe(messageText);
};

describe('Multi-user-e2e', () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({headless: false});
    browser2 = await puppeteer.launch({headless: false});
  });

  afterAll(async () => {
    await browser.close();
    await browser2.close();
  });

  it('can send and recieve messages with multiple users', async (done) => {
    const page1 = await openChat(browser);
    const page2 = await openChat(browser2);

    await sendMessage(page1, 'Hello, Google IO!');
    await sendMessage(page2, 'Hello, Zan!');


    const displayedText1 = await waitAndGetText(page1, '.message');
    const displayedText2 = await waitAndGetText(page1, '.message');

    expect(displayedText1).toBe('Hello, Zan!');
    expect(displayedText2).toBe('Hello, Google IO!');

    done();
  });
})
