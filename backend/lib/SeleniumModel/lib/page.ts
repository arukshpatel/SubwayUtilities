import { Browser }    from "./browser";

export interface NewablePage<T extends Page> {
    new(browser: Browser): T;
}


export abstract class Page
{

    protected constructor(protected browser: Browser, private url: string){};

    protected setUrl(url: string) {
        this.url = url;
    }

    public async navigate(): Promise<void> {
        await this.browser.navigate(this.url);
    }

    public abstract loadCondition(): Promise<boolean | void>;

}
