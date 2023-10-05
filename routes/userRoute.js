const { userData } = require("../data/userData");
const bcrypt = require("bcrypt");

let refreshTokens = [];

/**
 *  DTO(Data Tranfer Object ) to get Data using Promise
 * pagination and search with role , name and email
 *  Promise.all it will be handle function async
 * @param {*} req
 * @param {*} res
 */
async function getUser(req, res) {
  try {
    let { page } = req.query || 1;
    let { size } = req.query || 10;
    let { name, email } = req.query || "";
    let { role } = req.query || "";

    let start = (page - 1) * size;
    let end = start + size;

    const DTOs = await Promise.all(
      userData.map(async (item) => {
        const hashedPassword = await bcrypt.hash(item.password, 10);
        return { ...item, password: hashedPassword };
      })
    );
    let items = DTOs.slice(start, end);
    let searchingItems = items.filter((item) => {
      if (role) {
        return item.role.toLowerCase() === role.toLowerCase();
      }
      if (name) {
        return item.name.toLowerCase().includes(name.toLowerCase());
      }
      if (email) {
        return item.email.toLowerCase().includes(email.toLowerCase());
      }
      return item;
    });
    res.status(200).json({ page, size, searchingItems });
  } catch (error) {
    res.status(500).send("Internal Server Errror");
  }
}

/**
 * handle Create User
 * @param {*} req
 * @param {*} res
 * @returns
 */
async function handleCreateUser(req, res) {
  try {
    const id = Date.now();
    const { name, role, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { id, name, email, password: hashedPassword, role };

    let conditionMatch = false;

    for (const item in userData) {
      if (name === userData[item].name) {
        res.status(400).json({ message: "name cannot match" });
        return;
      }
      if (email === userData[item].email) {
        res.status(400).json({ messagae: "email cannot match" });
        return;
      }
    }

    userData.push(user);
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).send({ message: "Something went was wrong", error });
  }
}
/**
 * get User by Id
 * @param {*} req
 * @param {*} res
 *
 */
function getUserById(req, res) {
  try {
    const { id } = req.params;
    const userById = userData.find((item) => item.id === Number(id));

    res.status(200).json(userById);
  } catch (error) {
    res.status(500).send(error);
  }
}

/**
 * update User by Id
 * @param {*} req
 * @param {*} res
 */
async function handleUpdateUserById(req, res) {
  try {
    const { id } = req.params;
    const userById = userData.find((item) => Number(id) === item.id);
    const { name, role, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    if (id) {
      userById.name = name;
      userById.email = email;
      userById.role = role;
      userById.password = hashedPassword;
    }
    userData.push(...item, userById);
    res.status(200).json({ messages: "Edit Succesfully", userById, userData });
  } catch (error) {
    res.status(500).json(error);
  }
}
/**
 *  Delete user by id
 * @param {*} req
 * @param {*} res
 */
function handleDeleteUserById(req, res) {
  try {
    const { id } = req.params;
    userData = userData.filter((item) => Number(id) !== item.id);

    res.status(200).send({ message: "Delete Succefully" });
  } catch (error) {
    res.status(500).send({ error });
  }
}

module.exports = {
  getUser,
  getUserById,
  handleCreateUser,
  handleUpdateUserById,
  handleDeleteUserById,
};
