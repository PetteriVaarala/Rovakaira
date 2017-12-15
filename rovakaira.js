const puppeteer = require('puppeteer');
const YAML = require('yamljs');

function sleep(ms) {
	console.log('Sleeping ' + ms/1000 + 's.');
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
	conf = YAML.load('config.yml');
	console.log(conf);

	const browser = await puppeteer.launch({
	  headless: false
	});
	const page = await browser.newPage();
	page.setViewport({
		width: 1024,
		height: 960
	});
	await page.goto('https://ise.pset.fi');


	console.log('Login.');
	const USERNAME_SELECTOR = '#ContentPlaceHolder1_Login1_Username';
	const PASSWORD_SELECTOR = '#ContentPlaceHolder1_Login1_Password';
	const BUTTON_SELECTOR = '#ContentPlaceHolder1_Login1 > tbody > tr > td > div > div.userSettLoginContent > div:nth-child(4) > div.userSettLoginButtonsRight';
	await page.click(USERNAME_SELECTOR);
	await page.keyboard.type(conf.credentials.username);
	await sleep(1000);
	await page.click(PASSWORD_SELECTOR);
	await page.keyboard.type(conf.credentials.password);
	await sleep(1000);
	await page.click(BUTTON_SELECTOR);
	await page.waitForNavigation();
	await sleep(1000);

	console.log('Kulutustietoni.');
	const KULUTUSTIETONI = '#PageMainMenuContainerDiv > ul > li:nth-child(4) > a';
	await page.click(KULUTUSTIETONI);
	await sleep(2000);

	console.log('Käyttöpaikka.');
	const KAYTTOPAIKKA = '#ContentPlaceHolder1_ddlPartyMeteringPoint_title';
	await page.click(KAYTTOPAIKKA);
	await sleep(2000);

	console.log('Lompolo.');
	const LOMPOLO = '#ContentPlaceHolder1_ddlPartyMeteringPoint_msa_1 > span';
	await page.click(LOMPOLO);
	await sleep(2000);

	// Take screenshot and exit
	await page.screenshot({path: 'screenshots/screenshot.png'});
	await browser.close();

}
run();
