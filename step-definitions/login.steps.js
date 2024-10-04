const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { chromium } = require('playwright');

let browser, page;

Given('I am on the login page', async () => {
  browser = await chromium.launch();
  page = await browser.newPage();
  await page.goto('http://localhost:3000');
});

When('I enter valid credentials', async () => {
  await page.fill('#username', 'user1');
  await page.fill('#password', 'password1');
});

When('I enter invalid credentials', async () => {
  await page.fill('#username', 'invalidUser');
  await page.fill('#password', 'invalidPassword');
});

When('I click the login button', async () => {
  await page.click('button[type="submit"]');
});

Then('I should be redirected to the chat page', async () => {
  await page.waitForURL('http://localhost:3000/chat.html');
  await browser.close();
});

Then('I should see an error message', async () => {
  const errorMessage = await page.textContent('body');
  expect(errorMessage).toContain('Invalid username or password');
  await browser.close();
});