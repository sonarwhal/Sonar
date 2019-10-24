import { generateHTMLPage, getHintPath } from '@hint/utils';
import { HintTest, testHint } from '@hint/utils-tests-helpers';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const hintPath = getHintPath(__filename);

const htmlWithManifestSpecified = generateHTMLPage('<link rel="manifest" href="site.webmanifest">');

const generateErrorMessage = (property: string, propertyValue: string, valueType: string) => {
    return `Web app manifest should not have ${valueType} value '${propertyValue}' for property '${property}'.`;
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const defaultTests: HintTest[] = [
    {
        name: `Web app manifest is specified and its content is valid JSON`,
        serverConfig: {
            '/': htmlWithManifestSpecified,
            '/site.webmanifest': JSON.stringify({ name: 'test' })
        }
    },
    {
        name: `Web app manifest is specified and its content is not valid JSON`,
        reports: [{ message: `Web app manifest should contain valid JSON.` }],
        serverConfig: {
            '/': htmlWithManifestSpecified,
            '/site.webmanifest': 'x'
        }
    },
    {
        name: `Web app manifest is specified and its content does not validate agains the schema`,
        reports: [
            {
                message: `'root' should NOT have additional properties. Additional property found 'additionalProperty'.`,
                position: { match: 'additionalProperty' }
            },
            {
                message: `'icons[0]' should NOT have additional properties. Additional property found 'density'.`,
                position: { match: 'density' }
            },
            {
                message: `'name' should be 'string'.`,
                position: { match: 'name' }
            }
        ],
        serverConfig: {
            '/': htmlWithManifestSpecified,
            '/site.webmanifest': JSON.stringify({
                additionalProperty: 'x',
                background_color: '#f00', // eslint-disable-line camelcase

                icons: [{
                    density: 2,
                    src: 'a.png',
                    type: 'image/png'
                }],
                name: 5
            })
        }
    },
    {
        name: `Web app manifest is specified and the 'lang' property is not valid`,
        reports: [{ message: `Web app manifest should not have invalid value 'en-x' for property 'lang'.` }],
        serverConfig: {
            '/': htmlWithManifestSpecified,
            '/site.webmanifest': JSON.stringify({ lang: 'en-x' })
        }
    }
];

const testsForThemeColor: HintTest[] = [
    {
        name: `Web app manifest is specified and the 'background_color' and 'theme_color' properties are valid`,
        serverConfig: {
            '/': htmlWithManifestSpecified,
            '/site.webmanifest': JSON.stringify({
                /* eslint-disable camelcase */
                background_color: 'red',
                theme_color: '#ff0a'
                /* eslint-enable camelcase */
            })
        }
    },
    {
        name: `Web app manifest is specified and the 'background_color' and 'theme_color' properties are not valid`,
        reports: [
            { message: generateErrorMessage('background_color', 'invalid', 'invalid') },
            { message: generateErrorMessage('theme_color', 'invalid', 'invalid') }
        ],
        serverConfig: {
            '/': htmlWithManifestSpecified,
            '/site.webmanifest': JSON.stringify({
                /* eslint-disable camelcase */
                background_color: 'invalid',
                theme_color: 'invalid'
                /* eslint-enable camelcase */
            })
        }
    }
];

const testForThemeColorWithNoSupportForHexWithAlpha: HintTest[] = [
    {
        name: `Web app manifest is specified and the 'background_color' and 'theme_color' properties are not supported because of the targeted browsers`,
        reports: [
            { message: generateErrorMessage('background_color', '#f00a', 'unsupported') },
            { message: generateErrorMessage('theme_color', '#ff0000aa', 'unsupported') }
        ],
        serverConfig: {
            '/': htmlWithManifestSpecified,
            '/site.webmanifest': JSON.stringify({
                /* eslint-disable camelcase */
                background_color: '#f00a',
                theme_color: '#ff0000aa'
                /* eslint-enable camelcase */
            })
        }
    }
];

testHint(hintPath, defaultTests, { parsers: ['manifest'] });
testHint(hintPath, testsForThemeColor, {
    browserslist: [
        'chrome 65',
        'firefox 60'
    ],
    parsers: ['manifest']
});
testHint(hintPath, testForThemeColorWithNoSupportForHexWithAlpha, {
    browserslist: ['chrome 50'],
    parsers: ['manifest']
});
