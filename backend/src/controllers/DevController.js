const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

module.exports = {
  async index(request, response) {
    const devs = await Dev.find();

    return response.json(devs);
  },

  async store(request, response) {
    const { github_username, techs, latitude, longitude } = request.body;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);

      const { name = login, avatar_url, bio } = apiResponse.data;

      const techArray = parseStringArray(techs);

      const location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      }

      dev = await Dev.create({
        github_username: github_username,
        name,
        avatar_url,
        bio,
        techs: techArray,
        location
      });

      //Filtrar as conexoes que estao a no maximo 10km de distancia
      // e que o novo dev tenha pelo menos uma das tecnologias

      const sendSocketMessageTo = findConnections(
        { latitude, longitude },
        techsArray
      )

      sendMessage(sendSocketMessageTo, 'newDev', dev);

    }

    return response.json(dev);
  }
}