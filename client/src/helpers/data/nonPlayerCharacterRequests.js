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

const updateNonPlayerCharacter = (token, npcObj) =>
  new Promise((resolve, reject) => {
    axios
      .put(`${dmiApiBaseUrl}/NonPlayerCharacters`, npcObj, {
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

const deleteNonPlayerCharacter = (token, id) =>
  new Promise((resolve, reject) => {
    axios
      .delete(`${dmiApiBaseUrl}/NonPlayerCharacters/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => {
        resolve(resp);
      })
      .catch((error) => {
        reject(error);
      });
  });

export default {
  getNonPlayerCharactersByUserId,
  createNonPlayerCharacter,
  updateNonPlayerCharacter,
  deleteNonPlayerCharacter,
};
