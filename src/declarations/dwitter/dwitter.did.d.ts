import type { Principal } from '@dfinity/principal';
export interface Post { 'text' : string }
export type UserId = Principal;
export interface _SERVICE {
  'getPosts' : () => Promise<[] | [Array<Post>]>,
  'getUserPosts' : (arg_0: string) => Promise<[] | [Array<Post>]>,
  'getUsers' : () => Promise<Array<UserId>>,
  'savePost' : (arg_0: Post) => Promise<undefined>,
}
