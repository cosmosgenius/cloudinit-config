function Method(method: string) {
  const methodlower = method.toLowerCase();
  return (request: Request) => request.method.toLowerCase() === methodlower;
}

function Path(regExp: string) {
  return (request: Request) => {
    const url = new URL(request.url);
    const path = url.pathname;
    const match = path.match(regExp) || [];
    return match[0] === path;
  };
}

const Get = Method('get');
const Connect = Method('connect');
const Delete = Method('delete');
const Head = Method('head');
const Options = Method('options');
const Patch = Method('patch');
const Post = Method('post');
const Put = Method('put');
const Trace = Method('trace');

export class Router {
  readonly routes: Array<Route>;
  constructor() {
    this.routes = [];
  }
  get(path: string, handler: RouterHandlerInterface) {
    return this.handle([Get, Path(path)], handler);
  }
  connect(path: string, handler: RouterHandlerInterface) {
    return this.handle([Connect, Path(path)], handler);
  }
  delete(path: string, handler: RouterHandlerInterface) {
    return this.handle([Delete, Path(path)], handler);
  }
  head(path: string, handler: RouterHandlerInterface) {
    return this.handle([Head, Path(path)], handler);
  }
  options(path: string, handler: RouterHandlerInterface) {
    return this.handle([Options, Path(path)], handler);
  }
  patch(path: string, handler: RouterHandlerInterface) {
    return this.handle([Patch, Path(path)], handler);
  }
  post(path: string, handler: RouterHandlerInterface) {
    return this.handle([Post, Path(path)], handler);
  }
  put(path: string, handler: RouterHandlerInterface) {
    return this.handle([Put, Path(path)], handler);
  }
  trace(path: string, handler: RouterHandlerInterface) {
    return this.handle([Trace, Path(path)], handler);
  }

  handle(
    conditions: Array<ConditionInterface>,
    handler: RouterHandlerInterface
  ) {
    this.routes.push(new Route(conditions, handler));
    return this;
  }
  all(handler: RouterHandlerInterface) {
    return this.handle([], handler);
  }
  resolve(request: Request) {
    return this.routes.find(r => r.match(request));
  }
  async route(request: Request): Promise<Response> {
    const route = this.resolve(request);
    if (route) {
      return route.handler(request);
    }
    return new Response('resource not found', {
      status: 404,
      statusText: 'not found',
      headers: {
        'content-type': 'text/plain',
      },
    });
  }
}

export interface ConditionInterface {
  (request: Request): boolean;
}

export interface RouterHandlerInterface {
  (request: Request): Promise<Response>;
}

class Route {
  constructor(
    readonly conditions: Array<ConditionInterface>,
    readonly handler: RouterHandlerInterface
  ) {}

  match(request: Request) {
    if (!this.conditions.length) {
      return true;
    }
    return this.conditions.every(c => c(request));
  }
}
