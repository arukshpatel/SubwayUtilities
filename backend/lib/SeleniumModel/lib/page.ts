import { Browser } from "./browser";
import { HTMLQuery, Conditions, Identifier } from "./utils";

export interface NewablePage<T extends Page> {
    new(browser: Browser): T;
}


export abstract class Page
{

    constructor(protected browser: Browser, private url: string) {}

    protected setUrl(url: string) {
        this.url = url;
    }

    public async navigate(): Promise<void> {
        const findBy: Identifier = {
            condition: Conditions.ElementIsPresent,
            elementIdentifier: "#loginbutton",
            HTMLQuery: HTMLQuery.ID
        };

        await this.browser.navigate(this.url);
        await this.browser.waitUntil(findBy);
    }

    public abstract loadCondition(): Promise<void>;

}
