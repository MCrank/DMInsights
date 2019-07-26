import axios from 'axios';
import apiKeys from '../apiKeys';

const dmiApiBaseUrl = apiKeys.DMInsightsAPI.baseUrl;

const getNonPlayerCharactersByUserId = (token, uid) =>
  new Promise((resolve, reject) => {
    axios
      .get(`${dmiApiBaseUrl}/NonPlayerCharacters/user/${uid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => {
        resolve(resp.data);
      })
      .catch((error) => {
        reject(error);
      });
  });

export default { getNonPlayerCharactersByUserId };
