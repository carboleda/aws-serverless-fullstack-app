import { inject, injectable, InjectionToken } from "tsyringe";

// Create a symbol-based registry to map models to unique tokens
// This prevents minification issues since symbols are always unique
const tokenRegistry = new Map<any, symbol>();

export function getRepositoryToken<R>(
  model: new (...args: never[]) => R,
): InjectionToken {
  // Check if we already created a token for this model
  if (!tokenRegistry.has(model)) {
    // Create a unique symbol for this model - symbols are never minified
    tokenRegistry.set(model, Symbol(`${model.name}_Repository`));
  }
  return tokenRegistry.get(model)!;
}

export function InjectRepository<R>(
  model: new (...args: never[]) => R,
): ParameterDecorator {
  return inject(getRepositoryToken(model));
}

export function Injectable() {
  return injectable();
}

export function Inject(token: InjectionToken): ParameterDecorator {
  return inject(token);
}
