import * as mock from 'mock-require';
import { generateHTMLPage } from '@hint/utils-create-server';
import * as utilsNetwork from '@hint/utils-network';

export const OkayMaxAge = 31536000; // a max-age value larger than the minimum
export const smallMaxAge = 1; // a max-age value less than the minimum
export const defaultMinimum = 10886400; // default value of minimum
export const stsHeader = 'strict-transport-security';

// headers that will pass
export const maxAgeOnlyHeader = { [stsHeader]: `max-age=${OkayMaxAge}` };
export const includeSubDomainsHeader = { [stsHeader]: `max-age=${OkayMaxAge}; includeSubDomains` };
export const preloadHeader = { [stsHeader]: `max-age=${OkayMaxAge}; includeSubDomains; preload` };
export const mixCaseHeader = { [stsHeader]: `Max-Age=${OkayMaxAge}` };
export const quotedStringHeader = { [stsHeader]: `max-age="${OkayMaxAge}"; includeSubDomains; preload` };

// headers that will fail
export const tooShortHeader = { [stsHeader]: `max-age=${smallMaxAge}` };
export const noMaxAgeHeader = { [stsHeader]: `maxage=${OkayMaxAge}; includeSubDomains; preload` };
export const multipleMaxAgeHeader = { [stsHeader]: `max-age=${OkayMaxAge}; max-age=${OkayMaxAge + 1}` };
export const multipleincludeSubDomainsHeader = { [stsHeader]: `includeSubDomains; max-age=${OkayMaxAge}; includeSubDomains` };
export const wrongDelimiterHeader = { [stsHeader]: `max-age=${OkayMaxAge}, includeSubDomains; preload` };
export const includeUnitMaxAgeHeader = { [stsHeader]: `max-age=${OkayMaxAge}s; includeSubDomains; preload` };

// api response
export const notPreloadableError = `www subdomain does not support HTTPS`;
export const preloaded = { status: 'preloaded' };
export const unknown = { status: 'unknown' };
export const noErrors = { errors: [] };
export const hasErrors = { errors: [{ message: notPreloadableError }] };

// error messages
export const generateTooShortError = (value: number) => {
    return `'${stsHeader}' header 'max-age' value should be more than ${value}`;
};
export const noHeaderError = `'${stsHeader}' header was not specified`;
export const noMaxAgeError = `'${stsHeader}' header requires 'max-age' directive`;
export const multipleMaxAgeError = `'${stsHeader}' header contains more than one 'max-age'`;
export const multipleincludeSubDomainsError = `'${stsHeader}' header contains more than one 'includesubdomains'`;
export const tooShortErrorDefault = generateTooShortError(defaultMinimum);
export const DelimiterwrongFormatError = `'${stsHeader}' header has the wrong format: max-age=31536000, includesubdomains`;
export const UnitwrongFormatError = `'${stsHeader}' header has the wrong format: max-age=31536000s`;
export const statusServiceError = `Error with getting preload status for https://localhost/.`;
export const preloadableServiceError = `Error with getting preload eligibility for https://localhost/.`;
export const problemWithVerificationEndpoint = `Error with getting preload status for https://localhost/. There might be something wrong with the verification endpoint.`;

// override favicon headers so that it doesn't report in chrome
export const faviconHeaderMaxAgeOnly = {
    '/': { content: generateHTMLPage() },
    '/favicon.ico': { headers: { [stsHeader]: `max-age=${OkayMaxAge + 100}` } }
};

export const generateHTMLPageData = (content: string) => {
    return {
        content,
        headers: maxAgeOnlyHeader // the page itself should pass
    };
};

export const htmlPageWithScriptData = generateHTMLPageData(generateHTMLPage(undefined, '<script src="test.js"></script>'));
export const htmlPageWithManifestData = generateHTMLPageData(generateHTMLPage('<link rel="manifest" href="test.webmanifest">'));

export const requestJSONAsyncMock = (responseObject: any) => {
    const isHTTPS = () => {
        return true;
    };
    const isRegularProtocol = () => {
        return true;
    };
    const normalizeString = (str = '') => {
        return str.toLowerCase();
    };
    const requestJSONAsync = (uri: string) => {
        let response;

        if (uri.includes('/api/v2/preloadable')) {
            response = responseObject.preloadable;
        } else {
            response = responseObject.status;
        }

        if (!response) {
            return Promise.reject('Error with the verification service.');
        }

        return Promise.resolve(response);
    };

    (utilsNetwork as any).isRegularProtocol = isRegularProtocol;
    (utilsNetwork as any).isHTTPS = isHTTPS;
    (utilsNetwork as any).requestJSONAsync = requestJSONAsync;

    mock('@hint/utils-network', utilsNetwork);
    mock('@hint/utils-string', { normalizeString });
};
