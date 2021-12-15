# Selenium Model

> This model was built to navigate the Subway Partners website.

### Use Case:

- Authenticate User:
  - Utilize the Subway login page to check if the user is actually a Subway partner.
- Access Partner's data:
  - Be able to download data related to the Partners restaurant and everything pertaining to it.

### Example Code:

```
import * as Selenium from "./SeleniumModel";
import { Browser } from "./SeleniumModel/lib";

const browser = new Browser();

Selenium.AccessPage(browser, $username, $password)
        .then( _ => {
            console.log( _ )
        })
        .catch( e => {
            console.error(e)
        });

browser.close().then(_ => _);
```

### Acknowledgments:

- Special thanks to [@goenning](https://github.com/goenning) for creating this [example](https://github.com/goenning/typescript-selenium-example) for me to work off of
