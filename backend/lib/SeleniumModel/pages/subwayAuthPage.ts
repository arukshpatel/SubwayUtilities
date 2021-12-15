import { Browser, Button, Condition, Identifier, Page, TextInput } from "../lib";
import { until }                                                   from "selenium-webdriver";


export class SubwayAuthPage extends Page
{

    public usernameInput: TextInput = new TextInput(this.browser.Identify("#signInName"));
    public passwordInput: TextInput = new TextInput(this.browser.Identify("#password"));
    public signInButton: Button = new Button(this.browser.Identify("#next"));

    constructor(browser: Browser, URL: string) {
        super(browser, URL);
    }

    public loadCondition() {
        let successfulLoad: Identifier = {
            condition: Condition.PageHasLoaded,
            HTMLQuery: undefined,
            elementIdentifier: "https://subid.subway.com",
            webElement: undefined,
        };
        return this.browser.waitUntil(successfulLoad).then( _ => _);
    }


    public async signInAs(username: string, password: string): Promise<boolean | void> {
        let successAuth: Identifier = {
            condition: Condition.PageHasLoaded,
            HTMLQuery: undefined,
            elementIdentifier: "https://thefeed.subway.com",
            webElement: undefined,
        };


        await this.usernameInput
                  .type(username)
                  .then(_ => _)
                  .catch(err => {throw new Error("Could not input username")});

        await this.passwordInput
                  .type(password)
                  .then( _ => _)
                  .catch(err => {throw new Error("Could not input password")});

        await this.signInButton
                  .click()
                  .then(_ => _)
                  .catch(err => {throw new Error("Could not click")});

        if(typeof successAuth.elementIdentifier === "string") {
            await this.browser
                      .getDriver()
                      .wait(until.urlContains(successAuth.elementIdentifier))
                      .then(res => res)
                      .catch(err => {throw new Error("Could not authenticate\n" + err)});
        } else {
            await this.browser
                      .getDriver()
                      .wait(until.urlContains("https://thefeed.subway.com"))
                      .then(res => res)
                      .catch(err => {throw new Error("Could not authenticate\n" + err)});
        }
    }

}
