/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as categories from "../categories.js";
import type * as comments from "../comments.js";
import type * as http from "../http.js";
import type * as mcp from "../mcp.js";
import type * as media from "../media.js";
import type * as pages from "../pages.js";
import type * as posts from "../posts.js";
import type * as seo from "../seo.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  categories: typeof categories;
  comments: typeof comments;
  http: typeof http;
  mcp: typeof mcp;
  media: typeof media;
  pages: typeof pages;
  posts: typeof posts;
  seo: typeof seo;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
