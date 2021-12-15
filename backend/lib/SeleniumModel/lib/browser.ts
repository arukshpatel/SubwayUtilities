import 'chromedriver';
import { Builder, By, ThenableWebDriver, until, WebElementPromise } from "selenium-webdriver";
import { Options }                                                           from "selenium-webdriver/chrome";
import { Condition, HTMLQuery, Identifier, IdentifierError } from "./utils";

export class Browser
{
    private readonly driver: ThenableWebDriver;


    public constructor(private isPrivate: boolean = false, private isHeadless: boolean = true) {

        this.driver = this.initDriver().build();
    }

    public getDriver(): ThenableWebDriver
    {
        return this.driver;
    }

    private initDriver(): Builder {

        let chromeCapabilities: Options = new Options();

        if(this.isPrivate) {
            chromeCapabilities.addArguments('--incognito');
        }

        if(this.isHeadless) {
            chromeCapabilities.headless();
        }

        chromeCapabilities.setAcceptInsecureCerts(true);

        return new Builder().forBrowser('chrome').setChromeOptions(chromeCapabilities);
    }


    public async navigate(url: string) {
        try{
            await this.driver.get(url);
        } catch(e) {
            console.log("Cannot navigate.");
        }

    }

    public Identify(selector: string): WebElementPromise {

        if(selector.charAt(0) === '#')
        {
            return this.driver.wait(until.elementLocated(By.id(selector.split("#")[1])));

        } else if(selector.charAt(0) === ".")
        {

            return this.driver.wait(until.elementLocated(By.className(selector.split('.')[1])));
        }else
        {
            return this.driver.wait(until.elementLocated(By.name(selector)));
        }
    }

    public findBy(selector: Identifier): WebElementPromise {
        if(!selector.HTMLQuery)
        {
            throw new IdentifierError("HTMLQuery undefined")
        }

        if(selector.HTMLQuery instanceof Array || selector.elementIdentifier instanceof Array)
        {
            throw new IdentifierError("HTML Query or Element Identifier are of type string Array. Not Valid.")
        }

        return this.driver.findElement(new By(selector.HTMLQuery, selector.elementIdentifier));
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

        case Condition.ElementIsVisible:
            return await this.waitUntilElementIsVisible(waitUntil);

        case Condition.ElementIsPresent:
            return await this.waitUntilElementIsPresent(waitUntil);

        case Condition.PageHasLoaded:
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
    private async waitUntilPageHasLoaded(findBy: Identifier): Promise<boolean>
    {
        if(findBy.elementIdentifier instanceof Array)
        {
            throw new IdentifierError("elementIdentifer needs to be of type string, not string[]")
        }

        try{
            this.driver.wait(until.urlContains(findBy.elementIdentifier), findBy.timeOut, "URL Not Loaded");

            return true;

        } catch(e) {

            return false;
        }
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

        if(typeof findBy.HTMLQuery === "string" && findBy.elementIdentifier instanceof Array)
        {
            for(let i = 0; i < findBy.elementIdentifier.length; i++)
            {
                switch(findBy.HTMLQuery) {
                case HTMLQuery.ID:
                    await this.driver.wait(
                        until.elementIsEnabled(this.findElementById(findBy.elementIdentifier[i])),
                        findBy.timeOut,
                        'Could not find element. Timed Out.'
                    );
                    return;

                case HTMLQuery.CSS:
                    await this.driver.wait(
                        until.elementIsEnabled(this.findElementByCSS(findBy.elementIdentifier[i])),
                        findBy.timeOut,
                        'Could not find element. Timed Out.'
                    );
                    return;

                case HTMLQuery.JS:
                    return;
                }
            }
        }

        if(typeof findBy.HTMLQuery === "string" && typeof findBy.elementIdentifier === "string")
        {
            switch(findBy.HTMLQuery) {
            case HTMLQuery.ID:
                await this.driver.wait(
                    until.elementIsEnabled(this.findElementById(findBy.elementIdentifier)),
                    findBy.timeOut,
                    'Could not find element. Timed Out.'
                );
                return;

            case HTMLQuery.CSS:
                await this.driver.wait(
                    until.elementIsEnabled(this.findElementByCSS(findBy.elementIdentifier)),
                    findBy.timeOut,
                    'Could not find element. Timed Out.'
                );
                return;

            case HTMLQuery.JS:
                return;
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


        if(findBy.HTMLQuery instanceof Array && findBy.elementIdentifier instanceof Array) {
            if(findBy.elementIdentifier.length !== findBy.HTMLQuery.length) {
                throw new IdentifierError("Array length mismatch. Lengths do not match.");
            }

            for(let i = 0; i < findBy.elementIdentifier.length; i++) {

                if(findBy.HTMLQuery[i] === HTMLQuery.ID) {
                    await this.driver.wait(until.elementIsVisible(this.findElementById(findBy.elementIdentifier[i])));

                } else if(findBy.HTMLQuery[i] === HTMLQuery.CSS) {
                    await this.driver.wait(until.elementIsVisible(this.findElementByCSS(findBy.elementIdentifier[i])));
                }

            }
        }

        if(typeof findBy.HTMLQuery === "string" && findBy.elementIdentifier instanceof Array) {

            for(let i = 0; i < findBy.elementIdentifier.length; i++)
            {
                if(findBy.HTMLQuery === HTMLQuery.ID) {
                    try {
                        await this.driver.wait(until.elementIsVisible(this.findElementById(findBy.elementIdentifier[i])));
                    } catch(e) {

                        console.log("Could not find element: " + findBy.HTMLQuery)
                    }

                } else if(findBy.HTMLQuery === HTMLQuery.CSS) {
                    await this.driver.wait(until.elementIsVisible(this.findElementByCSS(findBy.elementIdentifier[i])));
                }
            }
        }

        if(typeof findBy.HTMLQuery === "string" && typeof findBy.elementIdentifier === "string") {

            if(findBy.HTMLQuery === HTMLQuery.ID) {
                try {
                    await this.driver.wait(until.elementIsVisible(this.findElementById(findBy.elementIdentifier)));
                } catch(e) {

                    console.log("Could not find element: " + findBy.HTMLQuery)
                }

            } else if(findBy.HTMLQuery === HTMLQuery.CSS) {
                await this.driver.wait(until.elementIsVisible(this.findElementByCSS(findBy.elementIdentifier)));
            }
        }
    }

    public async close(): Promise<void> {
        await this.driver.quit();
    }
}