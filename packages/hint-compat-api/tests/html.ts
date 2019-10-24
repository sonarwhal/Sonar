import { generateHTMLPage, getHintPath, readFile } from '@hint/utils';
import { testHint } from '@hint/utils-tests-helpers';

const hintPath = getHintPath(__filename, true);

const generateHTMLConfig = (fileName: string) => {
    const path = 'fixtures/html';
    const htmlFile = readFile(`${__dirname}/${path}/${fileName}.html`);

    return { '/': generateHTMLPage(undefined, htmlFile) };
};

const targetBrowsers = ['chrome 73-74', 'edge 17-18', 'firefox 65-66', 'ie 10-11'];

testHint(hintPath,
    [
        {
            name: 'Reports unsupported HTML attributes',
            reports: [
                {
                    message: `'img[srcset]' is not supported by Internet Explorer.`,
                    position: { match: 'img srcset=' }
                },
                {
                    message: `'div[hidden]' is not supported by Internet Explorer < 11.`,
                    position: { match: 'div hidden' }
                }
            ],
            serverConfig: generateHTMLConfig('attributes')
        },
        {
            name: 'Reports unsupported HTML elements',
            reports: [
                {
                    message: `'blink' is not supported by Chrome, Edge, Firefox 22+, Internet Explorer.`,
                    position: { match: 'blink' }
                },
                {
                    message: `'details' is not supported by Edge, Internet Explorer.`,
                    position: { match: 'details' }
                }
            ],
            serverConfig: generateHTMLConfig('elements')
        },
        {
            name: 'Does not report ignored HTML features by default',
            serverConfig: generateHTMLConfig('ignore')
        },
        {
            name: 'Reports unsupported HTML attribute values',
            reports: [
                // TODO: Include <form method="dialog"> or similar once MDN data is available
                {
                    message: `'input[type=color]' is not supported by Internet Explorer.`,
                    position: { match: 'input type="color"' }
                }
            ],
            serverConfig: generateHTMLConfig('values')
        }
    ],
    { browserslist: targetBrowsers }
);

testHint(hintPath,
    [
        {
            name: 'Reports overridden ignored HTML features',
            reports: [
                {
                    message: `'script[integrity]' is not supported by Internet Explorer.`,
                    position: { match: 'script integrity' }
                }
            ],
            serverConfig: generateHTMLConfig('ignore')
        },
        {
            name: 'Does not report manually ignored HTML features',
            serverConfig: generateHTMLConfig('values')
        }
    ],
    {
        browserslist: targetBrowsers,
        hintOptions: { enable: ['integrity'], ignore: ['input[type=color]'] }
    }
);
