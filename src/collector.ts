import { DELIMITER_CONTEXT } from './constants';
import { AchievementTest, Context, TestState, TestWeight } from './types';

type ContextProps = {
  label: string;
  weight: TestWeight;
};

function useReduceContext(context: Context) {
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
  return { label, weight, parent } as const;
}

function rankContext(
  contexts: Context[],
  { parent }: Context,
  first = true,
): number {
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

class Collector {
  private readonly _contexts: Context[] = [];
  private readonly _computedContexts: Context[] = [];
  private readonly _tests: AchievementTest[] = [];
  private _json: any = undefined;
  readonly addContexts = (...contexts: ContextProps[]) => {
    contexts.forEach(context => {
      const isComposed = context.label.includes(DELIMITER_CONTEXT);
      if (!isComposed) {
        this._contexts.push(context);
      } else {
        this._contexts.push(useReduceContext(context));
      }
    });
  };

  readonly addTests = (...tests: AchievementTest[]) => {
    this._tests.push(...tests);
  };

  private rankContext(context: Context, first = true): number {
    return rankContext(this.contexts, context, first);
  }

  private getContextsLevel1() {
    return this.contexts.filter(ctx => !ctx.parent);
  }

  private getContextsByParent(parent: string) {
    return this._contexts.filter(ctx => ctx.parent === parent);
  }

  private getTestsByContext(context: string) {
    const datas = this._tests.filter(test => test.context === context);
    return datas;
  }

  private buildWeightForContext = ({
    label,
    weight: _weight,
    parent,
    rank,
  }: Context): Context => {
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

  private getTestsFromState(
    state: TestState,
    ...tests: AchievementTest[]
  ) {
    return tests
      .filter(test => test.state === state)
      .map(test => test.invite);
  }

  private getAchievementsByContext = (context: Context): Context => {
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

  readonly computeContexts = () => {
    this._computedContexts.push(
      ...this._contexts
        .map(ctx => ({
          ...ctx,
          rank: this.rankContext(ctx),
        }))
        .map(this.buildWeightForContext)
        .map(this.getAchievementsByContext),
    );
  };

  get contexts() {
    return this._contexts;
  }

  get computedContexts() {
    return this._computedContexts;
  }

  private toJSONContext(context: Context) {
    const label = context.label;
    const _children = this.getContextsByParent(label);
    const hasChildren = _children.length > 0;
    if (!hasChildren) {
      return context;
    }
    const children = _children.reduce((acc, ctx) => {
      acc[ctx.label] = this.toJSONContext(ctx);
      return acc;
    }, {} as any);

    return { [label]: { children, ...context } };
  }

  readonly computeJSON = () => {
    this._json = this._computedContexts.reduce((acc, ctx) => {
      acc[ctx.label] = this.toJSONContext(ctx);
      return acc;
    }, {} as any);
  };

  get json() {
    return this._json;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  // #region Static
  private static _instance: Collector;

  static getInstance() {
    if (!Collector._instance) {
      Collector._instance = new Collector();
    }
    return Collector._instance;
  }
  // #endregion
}

export const COLLECTOR = Collector.getInstance();
