import { getHintPath } from 'hint/dist/src/lib/utils/hint-helpers';
import { HintTest } from '@hint/utils-tests-helpers/dist/src/hint-test-type';
import generateHTMLPage from 'hint/dist/src/lib/utils/misc/generate-html-page';
import readFile from 'hint/dist/src/lib/utils/fs/read-file';
import * as hintRunner from '@hint/utils-tests-helpers/dist/src/hint-runner';

const hintPath = getHintPath(__filename, true);

const generateHTMLConfig = (fileName: string) => {
    const path = 'fixtures/html';
    const htmlFile = readFile(`${__dirname}/${path}/${fileName}.html`);

    return { '/': generateHTMLPage(htmlFile) };
};

/*
 * Tests for html features that were removed / deprecated.
 * More information about how `hintRunner` can be configured is
 * available in:
 * https://webhint.io/docs/contributor-guide/how-to/test-hints/
 */

const elementNeverRemoved: HintTest[] = [
    {
        name: 'Elements that were never removed should pass.',
        serverConfig: generateHTMLConfig('div')
    }
];

hintRunner.testHint(hintPath, elementNeverRemoved, { browserslist: ['> 1%'], parsers: ['html']});

const elementAttrNeverRemoved: HintTest[] = [
    {
        name: 'Element attributes that were never removed should pass.',
        serverConfig: generateHTMLConfig('form-method')
    }
];

hintRunner.testHint(hintPath, elementAttrNeverRemoved, { browserslist: ['> 1%'], parsers: ['html']});

const removedForFlags: HintTest[] = [
    {
        name: 'Elements removed from versions requiring flags should pass.',
        serverConfig: generateHTMLConfig('shadow')
    }
];

hintRunner.testHint(hintPath, removedForFlags, { browserslist: ['firefox 60'], parsers: ['css']});

const elementRemovedVersionLaterThanTargetedBrowser: HintTest[] = [
    {
        name: 'Elements that were removed in a version later than the targeted browser should pass.',
        serverConfig: generateHTMLConfig('blink')
    }
];

hintRunner.testHint(hintPath, elementRemovedVersionLaterThanTargetedBrowser, { browserslist: ['firefox 20'], parsers: ['html']});

const elementRemovedVersionOfTargetedBrowser: HintTest[] = [
    {
        name: 'Elements that were removed the version of the targeted browser should fail.',
        reports: [{ message: 'blink element is not supported on firefox 22 browser.' }],
        serverConfig: generateHTMLConfig('blink')
    }
];

hintRunner.testHint(hintPath, elementRemovedVersionOfTargetedBrowser, { browserslist: ['firefox 22'], parsers: ['html']});

const elementRemovedVersionEarlierThanMultipleTargetedBrowser: HintTest[] = [
    {
        name: 'Elements that were removed in a version before the targeted browser should fail.',
        reports: [{ message: 'blink element is not supported on firefox 24-26 browsers.'}],
        serverConfig: generateHTMLConfig('blink')
    }
];

hintRunner.testHint(hintPath, elementRemovedVersionEarlierThanMultipleTargetedBrowser, { browserslist: ['firefox 24 - 26'], parsers: ['html']});

const elementRemovedVersionEarlierThanTargetedBrowser: HintTest[] = [
    {
        name: 'Elements that were removed in a version before the targeted browsers should fail with one error.',
        reports: [{ message: 'blink element is not supported on any of your browsers to support.' }],
        serverConfig: generateHTMLConfig('blink')
    }
];

hintRunner.testHint(hintPath, elementRemovedVersionEarlierThanTargetedBrowser, { browserslist: ['firefox 23 - 24', 'opera 16'], parsers: ['html']});

/*
const elementAttrRemovedVersionLaterThanTargetedBrowser: HintTest[] = [
    {
        name: 'Element attributes that were removed in a version later than the targeted browser should pass.',
        serverConfig: generateHTMLConfig('style-scoped')
    }
];

hintRunner.testHint(hintPath, elementAttrRemovedVersionLaterThanTargetedBrowser, { browserslist: ['firefox 52'], parsers: ['html']});

const elementAttrRemovedVersionOfTargetedBrowser: HintTest[] = [
    {
        name: 'Element attributes that were removed the version of the targeted browser should fail.',
        reports: [{ message: 'scoped attribute of the style element is not supported on firefox 55 browser.'}],
        serverConfig: generateHTMLConfig('style-scoped')
    }
];

hintRunner.testHint(hintPath, elementAttrRemovedVersionOfTargetedBrowser, { browserslist: ['firefox 55'], parsers: ['html']});

const elementAttrRemovedVersionEarlierThanTargetedBrowser: HintTest[] = [
    {
        name: 'Element attributes that were removed in a version before the targeted browser should fail.',
        reports: [{ message: 'scoped attribute of the style element is not supported on firefox 56 browser.'}],
        serverConfig: generateHTMLConfig('style-scoped')
    }
];

hintRunner.testHint(hintPath, elementAttrRemovedVersionEarlierThanTargetedBrowser, { browserslist: ['firefox 56'], parsers: ['html']});
 */
/*
 * GLOBAL ATTRIBUTES
 */
const globalAttributeNeverRemoved: HintTest[] = [
    {
        name: 'Global attributes that were never removed should pass.',
        serverConfig: generateHTMLConfig('div')
    }
];

hintRunner.testHint(hintPath, globalAttributeNeverRemoved, { browserslist: ['> 1%'], parsers: ['html']});

/*
 * FIXME: Browserlist doesn't have the whole list of browsers, 
 * so for firefox android is always returning the 63th version.
 * This is a problem because the test only make sense for the 
 * contextmenu attribute.
 * https://github.com/mdn/browser-compat-data/blob/master/html/global_attributes.json
 */

/*
const globalAttributeRemovedLaterThanTargetedBrowser: HintTest[] = [
    {
        name: 'Global attributes that were removed after the targeted browsers should pass',
        serverConfig: generateHTMLConfig('global-attr-contextmenu')
    }
];

hintRunner.testHint(hintPath, globalAttributeRemovedLaterThanTargetedBrowser, { browserslist: ['and_ff 55'], parsers: ['html']});

const globalAttributeRemovedVersionOfTargetedBrowser: HintTest[] = [
    {
        name: 'Global attributes that were removed the version of the targeted browser should fail',
        reports: [{ message: 'global attribute contextmenu is not supported on firefox_android 56 browser.'}],
        serverConfig: generateHTMLConfig('global-attr-contextmenu')
    }
];

hintRunner.testHint(hintPath, globalAttributeRemovedVersionOfTargetedBrowser, { browserslist: ['and_ff 56'], parsers: ['html']});

const globalAttributeRemovedEarlierThanTargetedBrowser: HintTest[] = [
    {
        name: 'Global attributes that were removed before the targeted browsers should fail',
        reports: [{ message: 'global attribute contextmenu is not supported on firefox_android 57 browser.'}],
        serverConfig: generateHTMLConfig('global-attr-contextmenu')
    }
];

hintRunner.testHint(hintPath, globalAttributeRemovedEarlierThanTargetedBrowser, { browserslist: ['and_ff 57'], parsers: ['html']});
*/

/*
 * INPUT TYPES
 * Presently there are no input types that have been removed.
 */
/* const inputTypeNeverRemoved: HintTest[] = [
    {
        name: 'Input types that were never removed should pass.',
        serverConfig: generateHTMLConfig('input-button')
    }
];

hintRunner.testHint(hintPath, inputTypeNeverRemoved, { browserslist: ['> 1%'], parsers: ['html']});
*/
