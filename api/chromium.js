const chrome = require( "chrome-aws-lambda" );
const puppeteer = require( "puppeteer-core" );

async function getScreenshot ( html ) {
  const browser = await puppeteer.launch( {
    args: chrome.args,
    executablePath: await chrome.executablePath, // comment this line when working on localhost
    headless: chrome.headless, // comment this line when working on localhost
    //executablePath: "./node_modules/puppeteer/.local-chromium/mac-722234/chrome-win/chrome.exe", //uncomment this line when working on localhost Windows
    //executablePath: "./node_modules/puppeteer/.local-chromium/mac-901912/chrome-mac/Chromium.app/Contents/MacOS/Chromium", //uncomment this line when working on localhost Mac
  } );

  const page = await browser.newPage();
  await page.setViewport( {
    width: 480,
    height: 100,
    deviceScaleFactor: 1,
  } );
  await page.setContent( html, { waitUntil: "networkidle2" } );
  const element = await page.$( "body" );
  const file = await element.screenshot( { encoding: "base64" } );
  await browser.close();
  return file;
}

module.exports = { getScreenshot };