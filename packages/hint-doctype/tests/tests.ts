import { getHintPath } from 'hint/dist/src/lib/utils/hint-helpers';
import { HintTest } from '@hint/utils-tests-helpers/dist/src/hint-test-type';
import * as hintRunner from '@hint/utils-tests-helpers/dist/src/hint-runner';

const hintPath = getHintPath(__filename);

const tests: Array<HintTest> = [
    {
        name: 'DOCTYPE should only be in the first line.',
        reports: [{ message: `DOCTYPE was found somewhere else other than the first line.` }],
        serverConfig: {
            '/': {
                content: `<p><span></span>
                <a></a><!DOCTYPE html>
                <head></head>
                <!DOCTYPE html>
                `,
                headers: { 'Content-Type': 'text/html' }
            }
        }
    },
    // {
    //     name: 'HTML with no content should fail',
    //     reports: [{ message: `Resource has no content.` }],
    //     serverConfig: {
    //         '/': {
    //             content: '',
    //             headers: { 'Content-Type': 'text/html' }
    //         }
    //     }
    // },
    // {
    //     name: 'Doctype not found should fail',
    //     reports: [{ message: `The resource does not contain a valid DOCTYPE.` }],
    //     serverConfig: {
    //         '/': {
    //             content: `<head>

    //             </head>
    //             <body></body>
    //             `,
    //             headers: { 'Content-Type': 'text/html' }
    //         }
    //     }
    // },
    // {
    //     name: 'Doctype not valid should fail',
    //     reports: [{ message: `The resource does not contain a valid DOCTYPE.` }],
    //     serverConfig: {
    //         '/': {
    //             content: `<!doctype htmltest>
    //             <head></head>
    //             <body></body>
    //             `,
    //             headers: { 'Content-Type': 'text/html' }
    //         }
    //     }
    // },
    // {
    //     name: 'Doctype regular with no space between terms should fail',
    //     reports: [{ message: `The resource does not contain a valid DOCTYPE.` }],
    //     serverConfig: {
    //         '/': {
    //             content: `<!doctypehtml>
    //             <head></head>
    //             <body></body>
    //             `,
    //             headers: { 'Content-Type': 'text/html' }
    //         }
    //     }
    // },
    // {
    //     name: 'Doctype legacy-compat with no space bewteen first two terms should fail',
    //     reports: [{ message: `The resource does not contain a valid DOCTYPE.` }],
    //     serverConfig: {
    //         '/': {
    //             content: `<!doctypehtml SYSTEM "about:legacy-compat">
    //             <head></head>
    //             <body></body>
    //             `,
    //             headers: { 'Content-Type': 'text/html' }
    //         }
    //     }
    // },
    // {
    //     name: 'Doctype legacy-compat with no space bewteen second two terms should fail',
    //     reports: [{ message: `The resource does not contain a valid DOCTYPE.` }],
    //     serverConfig: {
    //         '/': {
    //             content: `<!doctype htmlSYSTEM "about:legacy-compat">
    //             <head></head>
    //             <body></body>
    //             `,
    //             headers: { 'Content-Type': 'text/html' }
    //         }
    //     }
    // },
    // {
    //     name: 'Doctype legacy-compat with no space bewteen third two terms should fail',
    //     reports: [{ message: `The resource does not contain a valid DOCTYPE.` }],
    //     serverConfig: {
    //         '/': {
    //             content: `<!doctype html SYSTEM"about:legacy-compat">
    //             <head></head>
    //             <body></body>
    //             `,
    //             headers: { 'Content-Type': 'text/html' }
    //         }
    //     }
    // },
    // {
    //     name: 'Doctype tag with legacy-compat should pass',
    //     serverConfig: {
    //         '/': {
    //             content: `<!doctype html SYSTEM "about:legacy-compat">
    //             <head></head>
    //             <body></body>
    //             `,
    //             headers: { 'Content-Type': 'text/html' }
    //         }
    //     }
    // },
    // {
    //     name: 'Doctype regular with one more spaces after html should pass',
    //     serverConfig: {
    //         '/': {
    //             content: `<!doctype html      >
    //             <head></head>
    //             <body></body>
    //             `,
    //             headers: { 'Content-Type': 'text/html' }
    //         }
    //     }
    // },
    // {
    //     name: 'Doctype legacy-compat with one more spaces after html should pass',
    //     serverConfig: {
    //         '/': {
    //             content: `<!doctype html SYSTEM "about:legacy-compat"     >
    //             <head></head>
    //             <body></body>
    //             `,
    //             headers: { 'Content-Type': 'text/html' }
    //         }
    //     }
    // },
    // {
    //     name: 'Doctype found on first line and nothing else found should pass',
    //     serverConfig: {
    //         '/': {
    //             content: `<!doctype html>
    //             <head></head>
    //             `,
    //             headers: { 'Content-Type': 'text/html' }
    //         }
    //     }
    // },
    // {
    //     name: 'Doctype with additional info on same line should fail',
    //     reports: [{ message: `There is additional information on the line with the DOCTYPE tag.` }],
    //     serverConfig: {
    //         '/': {
    //             content: `<!doctype html></br>`,
    //             headers: { 'Content-Type': 'text/html' }
    //         }
    //     }
    // },
    // {
    //     name: 'Doctype is lowercase should pass',
    //     serverConfig: {
    //         '/': {
    //             content: `<!doctype html>`,
    //             headers: { 'Content-Type': 'text/html' }
    //         }
    //     }
    // },
    // {
    //     name: 'Doctype tag in uppercase should pass',
    //     serverConfig: {
    //         '/': {
    //             content: `<!DOCTYPE html>
    //             <head></head>
    //             <body></body>
    //             `,
    //             headers: { 'Content-Type': 'text/html' }
    //         }
    //     }
    // },
    // {
    //     name: 'Doctype appearing more than once should fail',
    //     reports: [{ message: `There is more than one DOCTYPE tag in the document.` }],
    //     serverConfig: {
    //         '/': {
    //             content: `<!doctype html>
    //             <p></p>
    //             <!doctype html>`,
    //             headers: { 'Content-Type': 'text/html' }
    //         }
    //     }
    // },
    // {
    //     name: 'Doctype appearing only once should pass',
    //     serverConfig: {
    //         '/': {
    //             content: `<!doctype html>
    //             <p></p>`,
    //             headers: { 'Content-Type': 'text/html' }
    //         }
    //     }
    // }
];

hintRunner.testHint(hintPath, tests);
