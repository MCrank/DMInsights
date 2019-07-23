import React from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBIcon, MDBInput } from 'mdbreact';
import './PlayerCharacterForm.scss';

const defaultCharacter = {
  name: '',
  hitPoints: 0,
  armorClass: 0,
  description: '',
  imageUrl: '',
  moveSpeed: 0,
  ownerId: 0,
  characterRace: '',
  characterType: '',
  passivePerception: 0,
  initiativeModifier: 0,
  spellSaveDC: 0,
  classes: '',
  level: 0,
  campaignId: 0,
};

class PlayerCharacterForm extends React.Component {
  state = {
    character: defaultCharacter,
  };

  componentDidMount() {
    console.log(this.props);
    if (this.props.location.state !== undefined) {
      if (this.props.location.state.isEditing) {
        this.setState({
          character: this.props.location.state.character,
        });
      }
      console.log(this.props.location.state.character);
    }
  }

  formFieldStringState = (field, event) => {
    event.preventDefault();
    const tempChar = { ...this.state.character };
    tempChar[field] = event.target.value;
    this.setState({
      character: tempChar,
    });
  };

  characterNameChange = (event) => this.formFieldStringState('name', event);

  render() {
    const { character } = this.state;

    return (
      <div className="PlayerCharacterForm">
        <MDBContainer>
          <div className="white-text">
            <MDBRow>
              <MDBCol md="3" className="d-flex justify-content-center">
                <img src={character.imageUrl} className="img-thumbnail" alt="" />
              </MDBCol>
              <MDBCol>
                {/* <div className="white-text"> */}
                <MDBRow>
                  <MDBCol>
                    <MDBInput label="Armor Class" icon="shield-alt" />
                  </MDBCol>
                  <MDBCol>
                    <MDBInput label="Hit Points" icon="heart" />
                  </MDBCol>
                </MDBRow>
                <MDBRow>
                  <MDBCol>
                    <MDBInput label="Passive Perception" icon="assistive-listening-systems" />
                  </MDBCol>
                  <MDBCol>
                    <MDBInput label="Spell Save DC" icon="magic" />
                  </MDBCol>
                </MDBRow>
                <MDBRow>
                  <MDBCol>
                    <MDBInput label="Initiative Modifier" icon="hourglass-start" />
                  </MDBCol>
                  <MDBCol>
                    <MDBInput label="Movement Speed" icon="running" />
                  </MDBCol>
                </MDBRow>
                <MDBRow>
                  <MDBCol>
                    <MDBInput label="Level" icon="sort-amount-up" />
                  </MDBCol>
                </MDBRow>
                {/* </div> */}
              </MDBCol>
            </MDBRow>
            {/* <div className="white-text"> */}
            <MDBRow>
              <MDBCol>
                <MDBInput label="Image URL" icon="image" />
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol>
                <MDBInput label="Name" icon="user-circle" />
              </MDBCol>
              <MDBCol>
                <MDBInput label="Class" icon="theater-masks" />
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol>
                <MDBInput label="Race" icon="user-circle" />
              </MDBCol>
              <MDBCol>
                <MDBInput label="Type" icon="theater-masks" />
              </MDBCol>
            </MDBRow>
            {/* </div> */}

            {/* <MDBRow>
            <MDBCol md="6">
              <form>
                <p className="h5 text-center mb-4">Write to us</p>
                <div className="white-text">
                  <MDBInput label="Name" icon="user" group type="text" value={character.name} size="lg" onChange={this.characterNameChange}/>
                  <MDBInput label="Class" icon="user" group type="text" validate error="wrong" success="right" size="lg" value={character.characterRace} />
                  <MDBInput label="Your name" icon="user" group type="text" validate error="wrong" success="right"  size="lg"/>
                  <MDBInput label="Your email" icon="envelope" group type="email" validate error="wrong" success="right"  size="lg"/>
                  <MDBInput label="Subject" icon="tag" group type="text" validate error="wrong" success="right" />
                  <MDBInput label="Description" icon="pencil-alt" type="textarea" rows="2"  size="lg"/>
                </div>
              </form>
            </MDBCol>
            <MDBCol md="6">
              <form>
                <p className="h5 text-center mb-4">Write to us</p>
                <div className="white-text">
                  <MDBInput label="Level" icon="user" group type="text" validate error="wrong" success="right" />
                  <MDBInput label="Race" icon="shield-alt" group type="text" validate error="wrong" success="right" />
                  <MDBInput label="Your name" icon="user" group type="text" validate error="wrong" success="right" />
                  <MDBInput label="Your email" icon="envelope" group type="email" validate error="wrong" success="right" />
                  <MDBInput label="Subject" icon="tag" group type="text" validate error="wrong" success="right" />
                  <MDBInput type="textarea" rows="2" label="Your message" icon="pencil-alt" />
                </div>
              </form>
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <div className="text-center">
              <MDBBtn outline color="info">
                Send <MDBIcon far icon="paper-plane" className="ml-1" />
              </MDBBtn>
            </div>
          </MDBRow> */}
          </div>
        </MDBContainer>
      </div>
    );
  }
}

export default PlayerCharacterForm;
