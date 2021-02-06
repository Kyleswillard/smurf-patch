const express = require("express");
const cors = require("cors");
const port = 3333;

const server = express();
server.use(express.json());
server.use(cors());

const sendUserError = (msg, res) => {
  res.status(422);
  res.json({ Error: msg });
  return;
};

let smurfs = [
  {
    name: "Poppa Smurf",
    position: "Village Leader",
    nickname: "Pops",
    description:
      "Papa is the practical village leader and the father figure of 100 or so young Smurfs. He is easily identified by his red Smurf hat, pants, and a shortly-trimmed white beard and moustache.",
    id: 0,
  },
];
server.get("/smurfs", (req, res) => {
  res.json(smurfs);
});
let smurfId = smurfs.length;

server.post("/smurfs", (req, res) => {
  const { name, position, nickname, description } = req.body;
  const newSmurf = { ...req.body, id: smurfId };
  if (!name || !position || !nickname || !description) {
    return sendUserError(
      "Ya gone did smurfed! Name/Position/Nickname/Description are all required to create a smurf in the smurf DB.",
      res
    );
  }
  const findSmurfByName = (smurf) => {
    return smurf.name === name;
  };
  if (smurfs.find(findSmurfByName)) {
    return sendUserError(
      `Ya gone did smurfed! ${name} already exists in the smurf DB.`,
      res
    );
  }

  smurfs.push(newSmurf);
  smurfId++;
  res.json(smurfs);
});

server.put("/smurfs/:id", (req, res) => {
  const { id } = req.params;
  const { name, position, nickname, description } = req.body;
  const findSmurfById = (smurf) => {
    return smurf.id == id;
  };
  const foundSmurf = smurfs.find(findSmurfById);
  if (!foundSmurf) {
    return sendUserError("No Smurf found by that ID", res);
  } else {
    if (name) foundSmurf.name = name;
    if (position) foundSmurf.position = position;
    if (nickname) foundSmurf.nickname = nickname;
    if (description) foundSmurf.description = description;
    res.json(smurfs);
  }
});

server.delete("/smurfs/:id", (req, res) => {
  const { id } = req.params;
  const foundSmurf = smurfs.find((smurf) => smurf.id == id);

  if (foundSmurf) {
    const SmurfRemoved = { ...foundSmurf };
    smurfs = smurfs.filter((smurf) => smurf.id != id);
    res.status(200).json(smurfs);
  } else {
    sendUserError("No smurf by that ID exists in the smurf DB", res);
  }
});

server.listen(port, (err) => {
  if (err) console.log(err);
  console.log(`server is listening on port ${port}`);
});
