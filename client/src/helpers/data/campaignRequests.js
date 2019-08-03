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

const createCampaign = (token, newCampaign) =>
  new Promise((resolve, reject) => {
    axios
      .post(`${dmiApiBaseUrl}/campaigns`, newCampaign, {
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

const updateCampaign = (token, updatedCampaign) =>
  new Promise((resolve, reject) => {
    axios
      .put(`${dmiApiBaseUrl}/campaigns`, updatedCampaign, {
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

const deleteCampaign = (token, campaignId) =>
  new Promise((resolve, reject) => {
    axios
      .delete(`${dmiApiBaseUrl}/campaigns/${campaignId}`, {
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

const getCampaignStatsPlayers = (token, campaignId) =>
  new Promise((resolve, reject) => {
    axios
      .get(`${dmiApiBaseUrl}/campaigns/${campaignId}/players`, {
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

const getCampaignStatsSessions = (token, campaignId) =>
  new Promise((resolve, reject) => {
    axios
      .get(`${dmiApiBaseUrl}/campaigns/${campaignId}/sessions`, {
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

const getCampaignStatsEncounters = (token, sessionId) =>
  new Promise((resolve, reject) => {
    axios
      .get(`${dmiApiBaseUrl}/campaigns/${sessionId}/encounters`, {
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

const getCampaignByConnectionId = (token, connectionId) =>
  new Promise((resolve, reject) => {
    axios
      .get(`${dmiApiBaseUrl}/campaigns/${connectionId}/connection`, {
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

export default {
  getUserCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getCampaignStatsPlayers,
  getCampaignStatsSessions,
  getCampaignStatsEncounters,
  getCampaignByConnectionId,
};
