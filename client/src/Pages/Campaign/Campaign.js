import React from 'react';
import { Link } from 'react-router-dom';
import { withAuth } from '@okta/okta-react';
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBTable, MDBTableHead, MDBTableBody } from 'mdbreact';
import CampaignCard from '../../Components/CampaignCard/CampaignCard';
import CampaignPlayer from '../../Components/CampaignPlayers/CampaignPlayer';
import CampaignSession from '../../Components/CampaignSessions/CampaignSession';
import CampaignEncounter from '../../Components/CampaignEncounters/CampaignEncounter';
import userRequests from '../../helpers/data/userRequests';
import campaignRequests from '../../helpers/data/campaignRequests';

import './Campaign.scss';

class Campaign extends React.Component {
  state = {
    myCampaigns: [],
    campaignPlayers: [],
    campaignSessions: [],
    campaignEncounters: [],
    isLoading: true,
    isPlayersLoading: false,
    isSessionsLoading: false,
    isEncountersLoading: false,
    userDbId: -1,
  };

  getAccessToken = async () => {
    return await this.props.auth.getAccessToken();
  };

  getCurrentUser = async () => {
    const user = await this.props.auth.getUser();
    return user;
  };

  getDbUserRequestItems = async () => {
    const accessToken = await this.getAccessToken();
    const tokenId = await this.getCurrentUser();
    const dbUid = await userRequests.getUserByTokenId(accessToken, tokenId.user_id);
    let dbRequestObj = {
      accessToken: accessToken,
      tokenId: tokenId,
      dbUid: dbUid.id,
    };
    return dbRequestObj;
  };

  componentDidMount() {
    this.getMyCampaigns().then(() => {
      this.setState({
        isLoading: false,
      });
    });
  }

  getMyCampaigns = async () => {
    const dbRequest = await this.getDbUserRequestItems();
    campaignRequests.getUserCampaigns(dbRequest.accessToken, dbRequest.dbUid).then((resp) => {
      this.setState({
        myCampaigns: resp,
        userDbId: dbRequest.dbUid,
      });
    });
  };

  getCampaignStats = async (campaignId) => {
    this.setState({
      isPlayersLoading: true,
      isSessionsLoading: true,
    });
    const dbRequest = await this.getDbUserRequestItems();
    campaignRequests.getCampaignStatsPlayers(dbRequest.accessToken, campaignId).then((resp) => {
      this.setState({
        isPlayersLoading: false,
        campaignPlayers: resp,
      });
    });
    campaignRequests
      .getCampaignStatsSessions(dbRequest.accessToken, campaignId)
      .then((resp) => {
        this.setState({
          isSessionsLoading: false,
          campaignSessions: resp,
        });
      })
      .catch((error) => {
        console.error('An error occurred retrieving campaign stats', error);
      });
  };

  getCampaignEncounters = async (sessionId) => {
    this.setState({
      isEncountersLoading: true,
    });
    const dbRequest = await this.getDbUserRequestItems();
    campaignRequests
      .getCampaignStatsEncounters(dbRequest.accessToken, sessionId)
      .then((resp) => {
        this.setState({
          isEncountersLoading: false,
          campaignEncounters: resp,
        });
      })
      .catch((error) => {
        console.error('An error occured retrieving campaign encounters', error);
      });
  };

  render() {
    const {
      myCampaigns,
      campaignPlayers,
      campaignSessions,
      campaignEncounters,
      isLoading,
      isPlayersLoading,
      isSessionsLoading,
      isEncountersLoading,
      userDbId,
    } = this.state;

    const campaignCards = (myCampaigns) =>
      myCampaigns.map((campaign, index) => (
        <CampaignCard
          key={campaign.id}
          campaign={campaign}
          getCampaigns={this.getMyCampaigns}
          userDbId={userDbId}
          getCampaignStats={this.getCampaignStats}
        />
      ));

    const campaignTableCharacters = (myCampaignPlayers) =>
      myCampaignPlayers.map((campaignPlayer) => (
        <CampaignPlayer key={campaignPlayer.id} campaignPlayer={campaignPlayer} />
      ));

    const campaignTableSessions = (myCampaignSessions) =>
      myCampaignSessions
        .sort((a, b) => a.dateCreated > b.dateCreated)
        .map((campaignSession) => (
          <CampaignSession
            key={campaignSession.id}
            campaignSession={campaignSession}
            getCampaignEncounters={this.getCampaignEncounters}
          />
        ));

    const campaignTableEncounters = (myEncounters) =>
      myEncounters
        .sort((a, b) => a.dateCreated > b.dateCreated)
        .map((campaignEncounter) => (
          <CampaignEncounter key={campaignEncounter.id} campaignEncounter={campaignEncounter} />
        ));

    return (
      <div className="Campaign">
        <MDBContainer fluid>
          <MDBRow>
            <MDBCol className="campaign-card-col" md="6" sm="12" lg="3">
              {isLoading ? (
                <MDBContainer className="d-flex justify-content-center pt-3">
                  <div className="spinner-border text-warning" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </MDBContainer>
              ) : (
                ''
              )}
              <MDBRow around>
                <Link to={{ pathname: '/campaignform', state: { isEditing: false } }}>
                  <MDBBtn className="campaign-card-button" outline color="primary">
                    Create Campaign
                  </MDBBtn>
                </Link>
              </MDBRow>
              {campaignCards(myCampaigns)}
            </MDBCol>
            <MDBCol md="6" sm="12" lg="9">
              <MDBRow className="campaign-info-title">
                <MDBCol md="12" lg="4">
                  {isPlayersLoading ? (
                    <MDBContainer className="d-flex justify-content-center pt-3">
                      <div className="spinner-border text-warning" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </MDBContainer>
                  ) : (
                    ''
                  )}
                  <h3>Characters</h3>
                  {campaignPlayers.length !== 0 ? (
                    <MDBTable striped small responsiveMd>
                      <MDBTableHead textWhite>
                        <tr>
                          <th>Name</th>
                          <th>Level</th>
                          <th>Race</th>
                          <th>Class</th>
                          <th>HP</th>
                        </tr>
                      </MDBTableHead>
                      <MDBTableBody textWhite>{campaignTableCharacters(campaignPlayers)}</MDBTableBody>
                    </MDBTable>
                  ) : (
                    ''
                  )}
                </MDBCol>
                <MDBCol>
                  {isSessionsLoading ? (
                    <MDBContainer className="d-flex justify-content-center pt-3">
                      <div className="spinner-border text-warning" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </MDBContainer>
                  ) : (
                    ''
                  )}
                  <h3>Game Sessions</h3>
                  {campaignSessions.length !== 0 ? (
                    <MDBTable striped small responsiveMd autoWidth>
                      <MDBTableHead textWhite>
                        <tr>
                          <th colSpan={2}>Date</th>
                          <th>Title</th>
                          <th>Description</th>
                        </tr>
                      </MDBTableHead>
                      <MDBTableBody textWhite>{campaignTableSessions(campaignSessions)}</MDBTableBody>
                    </MDBTable>
                  ) : (
                    ''
                  )}
                </MDBCol>
                <MDBCol md="12" lg="4">
                  {isEncountersLoading ? (
                    <MDBContainer className="d-flex justify-content-center pt-3">
                      <div className="spinner-border text-warning" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </MDBContainer>
                  ) : (
                    ''
                  )}
                  <h3>Encounters</h3>
                  {campaignEncounters.length !== 0 ? (
                    <MDBTable striped small responsiveMd mx-auto="true">
                      <MDBTableHead textWhite>
                        <tr>
                          <th colSpan={2}>Date</th>
                        </tr>
                      </MDBTableHead>
                      <MDBTableBody textWhite>{campaignTableEncounters(campaignEncounters)}</MDBTableBody>
                    </MDBTable>
                  ) : (
                    ''
                  )}
                </MDBCol>
              </MDBRow>
              {/* <MDBRow>
                <MDBCol md="12" lg="4">
                  <h3>Notes Sections</h3>
                </MDBCol>
              </MDBRow> */}
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
    );
  }
}

export default withAuth(Campaign);
