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

const getplayerCharactersByUserIdCampaign = (token, uid, campaignId) =>
  new Promise((resolve, reject) => {
    axios
      .get(`${dmiApiBaseUrl}/PlayerCharacters/${uid}/campaign/${campaignId}`, {
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

const createPlayerCharacter = (token, playerCharacterObj) =>
  new Promise((resolve, reject) => {
    axios
      .post(`${dmiApiBaseUrl}/PlayerCharacters`, playerCharacterObj, {
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

const updatePlayerCharacter = (token, playerCharacterObj) =>
  new Promise((resolve, reject) => {
    axios
      .put(`${dmiApiBaseUrl}/PlayerCharacters`, playerCharacterObj, {
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

const deletePlayerCharacter = (token, id) =>
  new Promise((resolve, reject) => {
    axios
      .delete(`${dmiApiBaseUrl}/PlayerCharacters/${id}`, {
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
  getplayerCharactersByUserId,
  createPlayerCharacter,
  updatePlayerCharacter,
  deletePlayerCharacter,
  getplayerCharactersByUserIdCampaign,
};
