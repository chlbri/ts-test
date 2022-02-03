"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ttest = exports.mapperTest = void 0;
const core_1 = require("@core_chlbri/core");
const nanoid_1 = require("nanoid");
const compares_1 = require("./helpers/compares");
function mapperTest({ spy, compare, }) {
    return async (test) => {
        const _spy = spy;
        const _processed = async () => {
            if (spy.length === 0) {
                return await _spy();
            }
            else if (spy.length === 1) {
                return await _spy(test.args);
            }
            else {
                return await _spy(...test.args);
            }
        };
        let falsePass = false;
        try {
            const processed = await _processed();
            if (test.throws) {
                console.log('not to thrown');
                falsePass = true;
                return expect(false).toBe(true);
            }
            const assertion = compare(processed, test.expected);
            // #region Logs
            (0, core_1.log)('args', test.args);
            (0, core_1.log)('expected', test.expected);
            (0, core_1.log)('_processed', _processed);
            (0, core_1.log)('assertion', assertion);
            // #endregion
            expect(assertion).toBeTruthy();
        }
        catch (error) {
            expect(error).toBeDefined();
            if (!test.throws) {
                return expect(false).toBe(true);
            }
            if (falsePass) {
                falsePass = false;
                return expect(false).toBe(true);
            }
            const thrown = test.thrown;
            // #region Logs
            (0, core_1.log)('args', test.args);
            (0, core_1.log)('thrown', error);
            // #endregion
            thrown && expect(error).toEqual(thrown);
        }
    };
}
exports.mapperTest = mapperTest;
const ttest = ({ func, tests, compare = compares_1.dataCompare, }) => {
    const spy = jest.fn(func);
    const mapper = mapperTest({ spy, compare });
    tests.forEach(test => {
        var _a;
        const invite = `${(_a = test.invite) !== null && _a !== void 0 ? _a : (0, nanoid_1.nanoid)()} ==>`;
        it(invite, async () => {
            await mapper(test);
        });
    });
    // const tests = _tests.forEach(mapper);
    const len = tests.length;
    it(`${func.name} should be call ${len} times`, () => {
        expect(spy).toBeCalledTimes(len);
    });
    return spy;
};
exports.ttest = ttest;
exports.ttest.skip = ({ func }) => {
    const spy = jest.fn(func);
    return spy;
};
exports.ttest.concurrent = ({ func, tests, compare = compares_1.dataCompare, }) => {
    const spy = jest.fn(func);
    const mapper = mapperTest({ spy, compare });
    tests.forEach(test => {
        var _a;
        const invite = `${(_a = test.invite) !== null && _a !== void 0 ? _a : (0, nanoid_1.nanoid)()} ==>`;
        it.concurrent(invite, () => {
            mapper(test);
        });
    });
    const len = tests.length;
    it(`${func.name} should be call ${len} times`, () => {
        expect(spy).toBeCalledTimes(len);
    });
    return spy;
};
exports.ttest.only = ({ func, tests, compare = compares_1.dataCompare, }) => {
    const spy = jest.fn(func);
    const mapper = mapperTest({ spy, compare });
    tests.forEach(test => {
        var _a;
        const invite = `${(_a = test.invite) !== null && _a !== void 0 ? _a : (0, nanoid_1.nanoid)()} ==>`;
        it.only(invite, () => {
            mapper(test);
        });
    });
    // const tests = _tests.forEach(mapper);
    const len = tests.length;
    it.only(`${func.name} should be call ${len} times`, () => {
        expect(spy).toBeCalledTimes(len);
    });
    return spy;
};
