import axios from 'axios';
import apiKeys from '../apiKeys';

const dmiApiBaseUrl = apiKeys.DMInsightsAPI.baseUrl;

const getplayerCharactersByUserId = (uid, token) =>
  new Promise((resolve, reject) => {
    axios
      .get(`${dmiApiBaseUrl}/PlayerCharacters/${uid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => {
        resolve(resp.data);
      })
      .catch((error) => {
        console.error(error);
      });
  });

export default { getplayerCharactersByUserId };
