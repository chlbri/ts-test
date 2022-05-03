"use strict";
// src/tests/reporter.ts
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
function useReduceContext(context) {
    const strings = context.label.split(DELIMITER_CONTEXT);
    const label = strings.pop();
    const parent = strings.pop();
    if (!parent) {
        throw `Composed label ${context.label} must have parent`;
    }
    if (!label) {
        throw `Composed label ${context.label} must have label`;
    }
    const weight = context.weight;
    return { label, weight, parent };
}
function rankContext(contexts, { parent }, first = true) {
    let rank = first ? 1 : 0;
    if (!parent) {
        return rank;
    }
    const find = contexts.find(ctx => ctx.label === parent);
    if (!find) {
        return rank;
    }
    rank += rankContext(contexts, find, false);
    return rank;
}
function reducerToAchievements(filePath) {
    return group => {
        const ancestors = group.ancestorTitles.join('.');
        const ancestorSeparator = ancestors !== '' ? ' -> ' : '';
        const state = group.status;
        let out;
        let context;
        let weight = 1;
        try {
            const parsed = JSON.parse(group.title);
            context = parsed.context;
            out = `${parsed.iterator}-/ ${parsed.invite}`;
            weight = parsed.weight;
        }
        catch (error) {
            out = group.title;
        }
        return {
            invite: `${filePath} -> ${ancestors}${ancestorSeparator}${out}`,
            state,
            context,
            weight,
        };
    };
}
class Collector {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {
        this._contexts = [];
        this._computedContexts = [];
        this._tests = [];
        this._json = undefined;
        this.addContexts = (...contexts) => {
            contexts.forEach(context => {
                const isComposed = context.label.includes(DELIMITER_CONTEXT);
                if (!isComposed) {
                    this._contexts.push(context);
                }
                else {
                    this._contexts.push(useReduceContext(context));
                }
            });
        };
        this.addTests = (...tests) => {
            this._tests.push(...tests);
        };
        this.buildWeightForContext = ({ label, weight: _weight, parent, rank, }) => {
            if (!rank) {
                throw `Rank is not defined for context ${label}`;
            }
            if (!parent) {
                const datas = this.getContextsLevel1();
                const len = datas.reduce((acc, ctx) => {
                    return acc + ctx.weight;
                }, 0);
                const weight = _weight / len;
                return { label, weight, parent, rank };
            }
            if (!parent) {
                throw `Parent is not defined for sub-context ${label}`;
            }
            const datas = this.getContextsByParent(parent);
            const len = datas.reduce((acc, ctx) => {
                return acc + ctx.weight;
            }, 0);
            const weight = _weight / len;
            return { label, weight, parent, rank };
        };
        this.getAchievementsByContext = (context) => {
            const label = context.label;
            const tests = this.getTestsByContext(label);
            const find = this._contexts.find(ctx => ctx.label === label);
            if (!find) {
                throw `Context ${label} is not defined`;
            }
            const totalTests = tests.map(t => t.invite);
            const passedTests = this.getTestsFromState('passed', ...tests);
            const failedTests = this.getTestsFromState('failed', ...tests);
            const skippedTests = this.getTestsFromState('skipped', ...tests);
            const pendingTests = this.getTestsFromState('pending', ...tests);
            const todoTests = this.getTestsFromState('todo', ...tests);
            const disabledTests = this.getTestsFromState('disabled', ...tests);
            return {
                ...context,
                totalTests,
                passedTests,
                failedTests,
                skippedTests,
                pendingTests,
                todoTests,
                disabledTests,
            };
        };
        this.computeContexts = () => {
            this._computedContexts.push(...this._contexts
                .map(ctx => ({
                ...ctx,
                rank: this.rankContext(ctx),
            }))
                .map(this.buildWeightForContext)
                .map(this.getAchievementsByContext));
        };
        this.computeJSON = () => {
            this._json = this._computedContexts.reduce((acc, ctx) => {
                acc[ctx.label] = this.toJSONContext(ctx);
                return acc;
            }, {});
        };
    }
    rankContext(context, first = true) {
        return rankContext(this.contexts, context, first);
    }
    getContextsLevel1() {
        return this.contexts.filter(ctx => !ctx.parent);
    }
    getContextsByParent(parent) {
        return this._contexts.filter(ctx => ctx.parent === parent);
    }
    getTestsByContext(context) {
        const datas = this._tests.filter(test => test.context === context);
        return datas;
    }
    getTestsFromState(state, ...tests) {
        return tests
            .filter(test => test.state === state)
            .map(test => test.invite);
    }
    get contexts() {
        return this._contexts;
    }
    get computedContexts() {
        return this._computedContexts;
    }
    toJSONContext(context) {
        const label = context.label;
        const _children = this.getContextsByParent(label);
        const hasChildren = _children.length > 0;
        if (!hasChildren) {
            return context;
        }
        const children = _children.reduce((acc, ctx) => {
            acc[ctx.label] = this.toJSONContext(ctx);
            return acc;
        }, {});
        return { [label]: { children, ...context } };
    }
    get json() {
        return this._json;
    }
    static getInstance() {
        if (!Collector._instance) {
            Collector._instance = new Collector();
        }
        return Collector._instance;
    }
}
const COLLECTOR = Collector.getInstance();
const DELIMITER_CONTEXT = '.';
class CustomReporter {
    async onRunComplete(configs, results) {
        // TODO Add Slack webhook trigger
        const tests = results.testResults
            .map(group => {
            const filePath = (0, path_1.relative)(process.cwd(), group.testFilePath);
            const tests = group.testResults;
            return tests.map(reducerToAchievements(filePath));
        })
            .flat();
        COLLECTOR.addContexts({
            label: 'concurrent',
            weight: 2,
        }, {
            label: 'only',
            weight: 1,
        }, {
            label: 'normal',
            weight: 3,
        }, {
            label: 'skip',
            weight: 1,
        });
        COLLECTOR.addTests(...tests);
        COLLECTOR.computeContexts();
        COLLECTOR.computeJSON();
        return console.log('reporter : ', JSON.stringify(COLLECTOR.json, null, 2));
        // console.log('config', Array.from(configs.values())[0].moduleMap);
    }
    async onTestCaseResult(test, testResult) {
        // console.log('result : ', testResult);
    }
}
exports.default = CustomReporter;
