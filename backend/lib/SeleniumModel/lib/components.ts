import { WebElementPromise } from "selenium-webdriver";
import { Identifier }        from "./utils";

export class WebComponent
{
    constructor(protected element: WebElementPromise, public identifier?: Identifier) {}

    public async click() {
        try {
            return await this.element.click();
        } catch (clickErr) {
            try {
                await this.element.getDriver().executeScript('arguments[0].click();', this.element);
            } catch (jsErr) {
                throw clickErr;
            }
        }
    }

    public async isDisplayed() {
        try {
            return await this.element.isDisplayed();
        } catch (ex) {
            return false;
        }
    }

    public async getText() {
        return await this.element.getText();
    }

}

export class Button extends WebComponent {
    constructor(element: WebElementPromise, identifier?: Identifier) {
        super(element, identifier);
    }

    public async isDisabled() {
        try {
            return await this.element.getAttribute('disabled') === 'disabled';
        } catch (ex) {
            return false;
        }
    }
}

export class TextInput extends WebComponent {
    constructor(element: WebElementPromise, identifier?: Identifier) {
        super(element, identifier);
    }

    public async type(text: string) {
        console.log(await this.element.getTagName());
        return this.element.sendKeys(text);
    }

    public getElement(): WebElementPromise {
        return this.element;
    }
}
