import 'chromedriver';
import { Builder, ThenableWebDriver, WebElement, By, WebElementPromise, until } from "selenium-webdriver";
import * as chrome                                                              from 'selenium-webdriver/chrome';

type Identifier = 'ID' | 'CSS';

export class Browser
{
    private driver: ThenableWebDriver;
    private chromeOptions: chrome.Options;


    public constructor(private browserName: string, private isPrivate: boolean)
    {
        if(isPrivate)
        {
            this.chromeOptions = new chrome.Options().headless().addArguments("--incognito");
        } else
        {
            this.chromeOptions = new chrome.Options().headless();
        }

        this.driver = new Builder().forBrowser(browserName).setChromeOptions(this.chromeOptions).build();
    }

    public async navigate(url: string): Promise<void>
    {
        await this.driver.navigate().to(url);
    }

    public findElementById(idSelector: string): WebElementPromise
    {
        return this.driver.findElement(By.id(idSelector));
    }

    public findElementByCSS(cssSelector: string): WebElementPromise
    {
        return this.driver.findElement(By.css(cssSelector));
    }

    public async clearCookies(url?: string): Promise<void>
    {
        if(url)
        {
            const currentUrl = await this.driver.getCurrentUrl();
            await this.navigate(url);
            await this.driver.manage().deleteAllCookies();
            await this.navigate(currentUrl);
        } else
        {
            await this.driver.manage().deleteAllCookies();
        }
    }

    public async waitUntil(findBy: Identifier, selector: string): Promise<void>
    {
        if(typeof findBy as "ID")
        {
            this.driver.wait(until.elementIsVisible(this.findElementById(selector)));

        } else if (typeof findBy as "CSS")
        {
            this.driver.wait(until.elementIsVisible(this.findElementByCSS(selector)));
        }
    }
}