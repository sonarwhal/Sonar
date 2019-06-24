/**
 * @fileoverview The stylish formatter, it outputs the results in a table format with different colors.
 *
 * This formatter is based on [eslint stylish formatter](https://github.com/eslint/eslint/blob/master/lib/formatters/stylish.js)
 */

/*
 * ------------------------------------------------------------------------------
 * Requirements
 * ------------------------------------------------------------------------------
 */

import chalk from 'chalk';
import forEach = require('lodash/forEach');
import groupBy = require('lodash/groupBy');
import reduce = require('lodash/reduce');
import sortBy = require('lodash/sortBy');
import * as logSymbols from 'log-symbols';
import * as table from 'text-table';
const stripAnsi = require('strip-ansi');

import { debug as d, fs, logger, misc } from '@hint/utils';
import { FormatterOptions, IFormatter, Problem, Severity } from 'hint';

import { getMessage } from './i18n.import';

const { cutString } = misc;

const _ = {
    forEach,
    groupBy,
    reduce,
    sortBy
};
const { writeFileAsync } = fs;
const debug = d(__filename);

const printPosition = (position: number, text: string) => {
    if (position === -1) {
        return '';
    }

    return `${text} ${position}`;
};

/*
 * ------------------------------------------------------------------------------
 * Formatter
 * ------------------------------------------------------------------------------
 */

export default class StylishFormatter implements IFormatter {
    /** Format the problems grouped by `resource` name and sorted by line and column number */
    public async format(messages: Problem[], options: FormatterOptions = {}) {

        debug('Formatting results');

        if (messages.length === 0) {
            return;
        }

        const resources: _.Dictionary<Problem[]> = _.groupBy(messages, 'resource');
        let totalErrors: number = 0;
        let totalWarnings: number = 0;

        let result = _.reduce(resources, (total: string, msgs: Problem[], resource: string) => {
            let warnings: number = 0;
            let errors: number = 0;
            const sortedMessages: Problem[] = _.sortBy(msgs, ['location.line', 'location.column']);
            const tableData: string[][] = [];
            let hasPosition: boolean = false;

            let partialResult = `${chalk.cyan(cutString(resource, 80))}\n`;

            _.forEach(sortedMessages, (msg: Problem) => {
                const severity: string = Severity.error === msg.severity ? chalk.red('Error') : chalk.yellow('Warning');

                if (Severity.error === msg.severity) {
                    errors++;
                } else {
                    warnings++;
                }

                const line: string = printPosition(msg.location.line, getMessage('@hint/formatter-stylish/line', { language: options.language }));
                const column: string = printPosition(msg.location.column, getMessage('@hint/formatter-stylish/col', { language: options.language }));

                if (line) {
                    hasPosition = true;
                }

                tableData.push([line, column, severity, msg.message, msg.hintId]);
            });

            /*
             * If no message in this resource has a position, then we remove the
             * position components from the array to avoid unnecessary white spaces
             */
            if (!hasPosition) {
                tableData.forEach((row: string[]) => {
                    row.splice(0, 2);
                });
            }

            partialResult += `${table(tableData)}\n`;

            const color: typeof chalk = errors > 0 ? chalk.red : chalk.yellow;

            totalErrors += errors;
            totalWarnings += warnings;

            const foundMessage = getMessage('@hint/formatter-stylish/partialFound', {
                language: options.language,
                substitutions: [
                    errors.toString(),
                    errors === 1 ? getMessage('@hint/formatter-stylish/error') : getMessage('@hint/formatter-stylish/errors'),
                    warnings.toString(),
                    warnings === 1 ? getMessage('@hint/formatter-stylish/warning') : getMessage('@hint/formatter-stylish/warnings')
                ]
            });

            partialResult += color.bold(`${logSymbols.error} ${foundMessage}`);
            partialResult += '\n\n';

            return total + partialResult;
        }, '');

        const color: typeof chalk = totalErrors > 0 ? chalk.red : /* istanbul ignore next */ chalk.yellow;
        const foundTotalMessage = getMessage('@hint/formatter-stylish/totalFound', {
            language: options.language,
            substitutions: [
                totalErrors.toString(),
                totalErrors === 1 ? getMessage('@hint/formatter-stylish/error') : getMessage('@hint/formatter-stylish/errors'),
                totalWarnings.toString(),
                totalWarnings === 1 ? getMessage('@hint/formatter-stylish/warning') : getMessage('@hint/formatter-stylish/warnings')
            ]
        });

        result += color.bold(`${logSymbols.error} ${foundTotalMessage}`);

        if (!options.output) {
            logger.log(result);

            return;
        }

        await writeFileAsync(options.output, stripAnsi(result));
    }
}
