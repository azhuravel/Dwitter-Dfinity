export const idlFactory = ({ IDL }) => {
  const Post = IDL.Record({ 'text' : IDL.Text });
  const UserId = IDL.Principal;
  return IDL.Service({
    'getPosts' : IDL.Func([], [IDL.Opt(IDL.Vec(Post))], []),
    'getUserPosts' : IDL.Func([IDL.Text], [IDL.Opt(IDL.Vec(Post))], []),
    'getUsers' : IDL.Func([], [IDL.Vec(UserId)], []),
    'savePost' : IDL.Func([Post], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
