const inspectUser = (user) => {
  const {data, data: {session}} = user;
  console.log(`id = + ${data.id}`);
  console.log(`key = + ${session.key}`);
  console.log(`expiresAt = + ${session.expiresAt}`);
};

const inspectUser2 = ({data: {id, session: {key, expiresAt}}}) => {
  console.log(`id = ${id}`);
  console.log(`key = ${key}`);
  console.log(`expiresAt = ${expiresAt}`);
};3

inspectUser2({
  data: {
    id: "51ff0475d615329700235136",
    session: {
      key: "NoBtELh82txWnMb5kEQJ",
      expiresAt: "2013-10-22T10:04:20+00:00",
    },
  },
});
