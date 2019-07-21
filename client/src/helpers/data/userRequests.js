import axios from 'axios';
import apiKeys from '../apiKeys';

const dmiApiBaseUrl = apiKeys.DMInsightsAPI.baseUrl;

const getAllUsers = (token) =>
  new Promise((resolve, reject) => {
    axios
      .get(`${dmiApiBaseUrl}/users/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => reject(error));
  });

const getUserByTokenId = (token, tokenId) =>
  new Promise((resolve, reject) => {
    axios
      .get(`${dmiApiBaseUrl}/users/${tokenId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        console.error('Error retrieving user from Database', error);
        reject(error);
      });
  });

const createNewUser = (token, userObj) =>
  new Promise((resolve, reject) => {
    axios
      .post(`${dmiApiBaseUrl}/users`, userObj, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((error) => reject(error));
  });

export default { getAllUsers, getUserByTokenId, createNewUser };
