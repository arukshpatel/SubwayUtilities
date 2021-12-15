import { Browser }            from "./lib";
import { SubwayAuthPage } from "./pages";

export async function AuthenticateUser(browser: Browser, userName: string, password: string)
{
    let success: boolean = false;

    try{
        const url = "https://partners.subway.com/";

        const subwayAuthPage = new SubwayAuthPage(browser, url);

        await subwayAuthPage.navigate();

        await subwayAuthPage.loadCondition();

        await subwayAuthPage.signInAs(userName, password);

        success = true;

    } catch(e)
    {
        console.error("Could not authenticate user\n" + e);
        success = false;
    }

    return success;
}

export async function AccessPage(browser: Browser, userName: string, password: string)
{
    let authenticated = false;

    await AuthenticateUser(browser, userName, password).then(_ => {authenticated = _});

    if(authenticated)
    {
        throw new Error("User successfully authenticated");
    }
}