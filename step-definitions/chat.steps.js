const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { chromium } = require('playwright');

let browser, page;

Given('I am logged in as {string}', async (username) => {
  browser = await chromium.launch();
  page = await browser.newPage();
  await page.goto('http://localhost:3000');
  await page.fill('#username', username);
  await page.fill('#password', 'password1');
  await page.click('button[type="submit"]');
  await page.waitForURL('http://localhost:3000/chat.html');
});

When('I send a message {string}', async (message) => {
  await page.fill('#message', message);
  await page.click('button[type="submit"]');
});

Then('I should see the message {string} in the chat history', async (expectedMessage) => {
  const chatHistory = await page.textContent('#chatHistory');
  expect(chatHistory).toContain(expectedMessage);
  await browser.close();
});