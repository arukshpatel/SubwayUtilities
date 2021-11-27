import 'chromedriver';
import { Builder, By, ThenableWebDriver, until, WebElementPromise } from "selenium-webdriver";
import * as chrome                                                  from "selenium-webdriver/chrome";
import { Conditions, HTMLQuery, Identifier, IdentifierError }       from "./utils";


export class Browser
{
    private driver: ThenableWebDriver;
    private chromeOptions: chrome.Options;


    public constructor(public browserName: string, private isPrivate: boolean) {
        this.chromeOptions = new chrome.Options().headless();

        if(isPrivate) {
            this.chromeOptions.addArguments('--incognito');
        }

        this.driver = new Builder().forBrowser(browserName).setChromeOptions(this.chromeOptions).build();
    }

    public async navigate(url: string): Promise<void> {
        await this.driver.navigate().to(url);
    }

    public findElementById(idSelector: string): WebElementPromise {
        return this.driver.findElement(By.id(idSelector));
    }

    public findElementByCSS(cssSelector: string): WebElementPromise {
        return this.driver.findElement(By.css(cssSelector));
    }

    public async clearCookies(url?: string): Promise<void> {
        if(url) {
            const currentUrl = await this.driver.getCurrentUrl();
            await this.navigate(url);
            await this.driver.manage().deleteAllCookies();
            await this.navigate(currentUrl);
        } else {
            await this.driver.manage().deleteAllCookies();
        }
    }

    public async waitUntil(waitUntil: Identifier): Promise<boolean | void> {
        
        switch(waitUntil.condition) {

        case Conditions.ElementIsVisible:
            return await this.waitUntilElementIsVisible(waitUntil);

        case Conditions.ElementIsPresent:
            return await this.waitUntilElementIsPresent(waitUntil);

        case Conditions.PageHasLoaded:
            return await this.waitUntilPageHasLoaded(waitUntil);

        }
    }

    /**
     * Waits until Page has loaded by matching URL.
     * @param findBy
     * findBy.condition has to be Conditions.PageHasLoaded
     * findBy.elementIdentifier has to be string "{URL}"
     * @private
     */
    private async waitUntilPageHasLoaded(findBy: Identifier): Promise<boolean | undefined>
    {
        if(!(findBy.elementIdentifier instanceof Array) && findBy.elementIdentifier)
        {
            return this.driver.wait(
                until.urlIs(findBy.elementIdentifier),
                findBy.timeOut,
                "URL not loaded. Timed out")
        }
        return;
    }

    private async waitUntilElementIsPresent(findBy: Identifier): Promise<void> {
        let elementSelector: string;

        if(findBy.HTMLQuery instanceof Array && findBy.elementIdentifier instanceof Array) {
            if(findBy.elementIdentifier.length !== findBy.HTMLQuery.length) {
                throw new IdentifierError("Array length mismatch. Lengths do not match.");
            }
            for(let i = 0; i < findBy.elementIdentifier.length; i++) {
                elementSelector = findBy.elementIdentifier[i];

                switch(findBy.HTMLQuery[i]) {
                case HTMLQuery.ID:
                    await this.driver.wait(
                        until.elementIsEnabled(this.findElementById(elementSelector)),
                        findBy.timeOut,
                        'Could not find element. Timed Out.'
                    );

                    return;
                case HTMLQuery.CSS:
                    await this.driver.wait(
                        until.elementIsEnabled(this.findElementByCSS(elementSelector)),
                        findBy.timeOut,
                        'Could not find element. Timed Out.'
                    );
                    return;
                case HTMLQuery.JS:
                    return;
                }
            }
            return;
        }

        if(typeof findBy.HTMLQuery === "number" && findBy.elementIdentifier)
        {
            for(elementSelector of findBy.elementIdentifier)
            {
                switch(findBy.HTMLQuery) {
                case HTMLQuery.ID:
                    await this.driver.wait(
                        until.elementIsEnabled(this.findElementById(elementSelector)),
                        findBy.timeOut,
                        'Could not find element. Timed Out.'
                    );
                    return;

                case HTMLQuery.CSS:
                    await this.driver.wait(
                        until.elementIsEnabled(this.findElementByCSS(elementSelector)),
                        findBy.timeOut,
                        'Could not find element. Timed Out.'
                    );
                    return;

                case HTMLQuery.JS:
                    return;
                }
            }
        }

    }

    /**
     *
     * @param findBy - Of type Identifier
     * <br> Consists of HTMLQuery: string | string[], elementIdentifier: string | string[] <br>
     * If HTMLQuery: string && elementIdentifier: string[], HTMLQuery will be default for all elementIdentifier
     * elements <br>
     * If HTMLQuery: string[] && elementIdentifer: string[], It will map each query type to its corresponding
     * elementIdentifier
     */
    private async waitUntilElementIsVisible(findBy: Identifier): Promise<void> {
        let elementSelector: string;

        if(findBy.HTMLQuery instanceof Array && findBy.elementIdentifier instanceof Array) {
            if(findBy.elementIdentifier.length !== findBy.HTMLQuery.length) {
                throw new IdentifierError("Array length mismatch. Lengths do not match.");
            }

            for(let i = 0; i < findBy.elementIdentifier.length; i++) {
                elementSelector = findBy.elementIdentifier[i];

                if(findBy.HTMLQuery[i] === HTMLQuery.ID) {
                    await this.driver.wait(until.elementIsVisible(this.findElementById(elementSelector)));

                } else if(findBy.HTMLQuery[i] === HTMLQuery.CSS) {
                    await this.driver.wait(until.elementIsVisible(this.findElementByCSS(elementSelector)));
                }

            }
        }

        if(typeof findBy.HTMLQuery === "number" && findBy.elementIdentifier) {
            for(elementSelector of findBy.elementIdentifier) {
                if(findBy.HTMLQuery === HTMLQuery.ID) {
                    try {
                        await this.driver.wait(until.elementIsVisible(this.findElementById(elementSelector)));
                    } catch(e) {

                        continue;
                    }

                } else if(findBy.HTMLQuery === HTMLQuery.CSS) {
                    await this.driver.wait(until.elementIsVisible(this.findElementByCSS(elementSelector)));
                }
            }
        }
    }

    public async close(): Promise<void> {
        await this.driver.quit();
    }
}