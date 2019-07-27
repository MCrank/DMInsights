import axios from 'axios';
import apiKeys from '../apiKeys';

const dmiApiBaseUrl = apiKeys.DMInsightsAPI.baseUrl;

const getUserCampaigns = (token, uid) =>
  new Promise((resolve, reject) => {
    axios
      .get(`${dmiApiBaseUrl}/users/${uid}/campaigns`, {
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

export default { getUserCampaigns };
