import { Route as RouteParser } from "route-parser";

export function isMatchingRoute(request, routes) {
    const { pathname } = new URL(request.url)
    const matcher = route => route == "*" || (new RouteParser(route)).match(pathname)
    return routes.some(matcher)
}

export default { isMatchingRoute };