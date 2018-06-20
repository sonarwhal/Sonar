#!/usr/bin/env node

/**
 * @fileoverview Main CLI that is run via the hint command. Based on ESLint.
 */

/* eslint no-console:off, no-process-exit:off */

/*
 * ------------------------------------------------------------------------------
 * Helpers
 * ------------------------------------------------------------------------------
 */

const debug = (process.argv.includes('--debug'));

import * as d from 'debug';

// This initialization needs to be done *before* other requires in order to work.
if (debug) {
    d.enable('hint:*');
}

/*
 * ------------------------------------------------------------------------------
 * Requirements
 * ------------------------------------------------------------------------------
 * Now we can safely include the other modules that use debug.
 */
import * as cli from '../lib/cli';
import { trackException, sendPendingData } from '../lib/utils/appinsights';

/*
 * ------------------------------------------------------------------------------
 * Execution
 * ------------------------------------------------------------------------------
 */

process.once('uncaughtException', async (err) => {
    console.error(err.message);
    console.error(err.stack);
    trackException(err);
    await sendPendingData();
    process.exit(1);
});

process.once('unhandledRejection', async (reason) => {
    const source = reason.error ? reason.error : reason;

    trackException(source);
    await sendPendingData();
    console.error(`Unhandled rejection promise:
    uri: ${source.uri}
    message: ${source.message}
    stack:
${source.stack}`);
    process.exit(1);
});

const run = async () => {
    process.exitCode = await cli.execute(process.argv);
    if (debug) {
        console.log(`Exit code: ${process.exitCode}`);
    }
    process.exit(process.exitCode);
};

run();
