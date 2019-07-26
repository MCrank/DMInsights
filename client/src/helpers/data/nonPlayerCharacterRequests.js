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

const createNonPlayerCharacter = (token, npcObj) =>
  new Promise((resolve, reject) => {
    axios
      .post(`${dmiApiBaseUrl}/NonPlayerCharacters`, npcObj, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => {
        resolve(resp);
      })
      .then((error) => {
        reject(error);
      });
  });

export default { getNonPlayerCharactersByUserId, createNonPlayerCharacter };
