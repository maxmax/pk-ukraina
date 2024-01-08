const casual = require("casual");

const generateUser = () => {
  // Generation of random data for the user
  const firstName = casual.first_name;
  const lastName = casual.last_name;
  const username = `${firstName.toLowerCase()}_${lastName.toLowerCase()}`;
  const age = casual.integer(18, 65);
  const email = casual.email;

  return {
    firstName,
    lastName,
    username,
    age,
    email,
  };
};

exports.generateUsers = (req, res) => {
  const { count = 5000 } = req.query;

  const users = Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    ...generateUser(),
  }));

  res.json(users);
};
