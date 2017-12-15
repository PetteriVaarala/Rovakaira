#!/usr/bin/env node
const puppeteer = require('puppeteer');
const YAML = require('yamljs');


function __DEBUGGER(str){
    if (ifDebug()) {
        console.log(str);
    }
}

function ifDebug(){
    if (process.argv.indexOf('--debug') > -1)
       return true
    else
        return false
}

function ifHeadless(){
    if (process.argv.indexOf('--headless') > -1)
       return true
    else
        return false
}

function ifHelp(){

    help_str = `Usage: rovakaira.js [options]

Options:
  -h, --help              This help
  --headless              Run chrome headless
  --debug                 Print debug messages`;

    if (process.argv.indexOf('--help') > -1 || process.argv.indexOf('-h') > -1) {

        console.log(help_str);
        process.exit()
    }
}

function sleep(ms) {
    __DEBUGGER('Sleeping ' + ms/1000 + 's.');
    return new Promise(resolve => setTimeout(resolve, ms));
}

function sleep_about(ms) {
    min = Math.ceil(-500);
    max = Math.floor(500);
    rnd_sleep = Math.floor(Math.random() * (max - min)) + min + ms;
    __DEBUGGER('Sleeping about ' + rnd_sleep/1000 + 's.');
    return new Promise(resolve => setTimeout(resolve, rnd_sleep));
}

async function run() {
    // Load configs
    conf = YAML.load('config.yml');

    const browser = await puppeteer.launch({
      headless: ifHeadless()
    });
    const page = await browser.newPage();
    page.setViewport({
        width: 1024,
        height: 960
    });
    __DEBUGGER('Avaa sivu.');
    await page.goto('https://ise.pset.fi');

    __DEBUGGER('Käyttäjätunnus.');
    const USERNAME_SELECTOR = '#ContentPlaceHolder1_Login1_Username';
    await page.click(USERNAME_SELECTOR);
    await page.keyboard.type(conf.credentials.username);
    __DEBUGGER('Salasana.');
    const PASSWORD_SELECTOR = '#ContentPlaceHolder1_Login1_Password';
    await page.click(PASSWORD_SELECTOR);
    await page.keyboard.type(conf.credentials.password);
    await sleep_about(1000);
    __DEBUGGER('Kirjaudu.');
    const BUTTON_SELECTOR = '#ContentPlaceHolder1_Login1 > tbody > tr > td > div > div.userSettLoginContent > div:nth-child(4) > div.userSettLoginButtonsRight';
    await page.click(BUTTON_SELECTOR);
    await page.waitForNavigation();
    await sleep_about(1000);

    __DEBUGGER('Tuntimitatut käyttöpaikat.');
    await page.goto('https://ise.pset.fi/ConsumptionReporting/HourlyBasedReporting.aspx');
    await sleep_about(2000);

    __DEBUGGER('Lämpötila.');
    const LAMPOTILA_NAPPI = '#ContentPlaceHolder1_rblAdditionalMeasurement_0';
    await page.click(LAMPOTILA_NAPPI);
    await sleep_about(2000);

    __DEBUGGER('Vuosi.');
    const VUOSI_VALINTA = '#ContentPlaceHolder1_ddlYearSelector_arrow';
    await page.click(VUOSI_VALINTA);
    await sleep_about(2000);
    __DEBUGGER('Ensimmäinen vuosi.');
    const VUOSI_1 = '#ContentPlaceHolder1_ddlYearSelector_msa_1 > span';
    await page.click(VUOSI_1);
    await page.waitForNavigation();
    await sleep_about(2000);
    __DEBUGGER('Tarkkuus.');
    const TARKKUUS_VALINTA = '#ContentPlaceHolder1_ddlResolutionSelector_arrow';
    await page.click(TARKKUUS_VALINTA);
    await sleep_about(2000);
    __DEBUGGER('Tunti.');
    //const TARKKUUS = '#ContentPlaceHolder1_ddlResolutionSelector_msa_0 > span'; // kuukausi
    const TARKKUUS = '#ContentPlaceHolder1_ddlResolutionSelector_msa_1 > span'; // viikko
    //const TARKKUUS = '#ContentPlaceHolder1_ddlResolutionSelector_msa_2 > span'; // päivä
    //const TARKKUUS = '#ContentPlaceHolder1_ddlResolutionSelector_msa_3 > span'; // Tunti
    await page.click(TARKKUUS);
    await page.waitForNavigation();
    __DEBUGGER("Lataus valmis.");

    __DEBUGGER('Lue paikka.');
    mittauspaikka = await page.evaluate(() => document.querySelector('#ContentPlaceHolder1_lblMeteringPointInformation').innerText);
    __DEBUGGER(mittauspaikka);
    __DEBUGGER('Lue taulu.');
    mittataulu = await page.evaluate(() => document.querySelector('#ContentPlaceHolder1_gvMeasurements_gvMeasurements').innerText);
    __DEBUGGER(mittataulu);

    __DEBUGGER('Seuraava paikka.');
    const PAIKKA_VALINTA = '#ContentPlaceHolder1_lbPartyMeteringPoint_arrow';
    await page.click(PAIKKA_VALINTA);
    await sleep_about(2000);
    __DEBUGGER('Toinen paikka.');
    const TOINEN_PAIKKA = '#ContentPlaceHolder1_lbPartyMeteringPoint_msa_1 > span';
    await page.click(TOINEN_PAIKKA);
    await page.waitForNavigation();
    __DEBUGGER("Lataus valmis.");

    __DEBUGGER('Lue paikka.');
    mittauspaikka = await page.evaluate(() => document.querySelector('#ContentPlaceHolder1_lblMeteringPointInformation').innerText);
    __DEBUGGER(mittauspaikka);
    __DEBUGGER('Lue taulu.');
    mittataulu = await page.evaluate(() => document.querySelector('#ContentPlaceHolder1_gvMeasurements_gvMeasurements').innerText);
    __DEBUGGER(mittataulu);

    // Take screenshot and exit
    await page.screenshot({path: 'screenshots/screenshot-' + Math.floor(Date.now() / 1000) + '.png', fullPage: true});
    await browser.close();

}

ifHelp();
if (ifDebug()) console.log("Debug mode on!");
run();
