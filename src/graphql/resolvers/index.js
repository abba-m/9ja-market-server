const Articles = [
  {
    id: 1,
    title: "Post 1",
    desc: "Anim reprehenderit officia nulla incididunt. Eiusmod amet eu voluptate culpa exercitation consectetur labore fugiat. Non non cupidatat velit dolore. Incididunt nisi esse voluptate ut enim proident magna esse. Ut tempor est ea ad duis excepteur officia ad aliqua laborum et reprehenderit aliqua. Id laboris commodo laboris Lorem est dolor enim ad eu est qui.",
  },
  {
    id: 2,
    title: "Post 2",
    desc: "Consequat irure sit magna aliqua. Dolore commodo in dolor exercitation adipisicing enim deserunt ullamco anim elit amet veniam minim. Ex et excepteur labore duis aliquip ea cillum esse.",
  },
];

module.exports = {
  articles: () => Articles,

  createArticle: ({ title, desc }) => {
    const articleToSave = { id: Articles.length + 1, title, desc };
    Articles.push(articleToSave);
    return articleToSave;
  },

  deleteArticle: ({ id }) => {
    return Articles.filter((a) => a.id !== id);
  },
};
